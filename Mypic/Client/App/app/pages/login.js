import React, { Component } from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput,
    StatusBar, AsyncStorage, TouchableOpacity} from 'react-native';

import Svg, {Image, Circle, ClipPath} from 'react-native-svg';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from "react-native-gesture-handler";
import {Actions} from 'react-native-router-flux';
import * as Font from "expo-font";

import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';


const {width, height} = Dimensions.get('window');
const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

export class MusicApp extends Component {
    _onPress() {
        Actions.signup();
    }

    _goMainScreen() {
        Actions.mainpage();
    }

    constructor(props){
        super(props);

        this.state={
            email:'',
            password: '',
            isSignUp: false
        };

        this.buttonOpacity = new Value(1);
        this.onStateChange = Animated.event([
            {
                nativeEvent:({state})=>block([
                    cond(eq(state, State.END),
                        set(this.buttonOpacity, runTiming(new Clock(), 1, 0))),
                ])
            }
        ]);
        this.onCloseState=Animated.event([
            {
                nativeEvent:({state})=>block([
                    cond(eq(state, State.END),
                        set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [-height * 2 / 5 - 50, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputY= interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });
        this.textInputOpacity= interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        });
    };

    state = {
        fontLoaded: false,
    };

    saveData =async()=>{
        const {email,password} = this.state;

        try{
            let loginDetails = await AsyncStorage.getItem('loginDetails');
            let ld = JSON.parse(loginDetails);

            if (ld.email != null && ld.password != null)
            {
                if (ld.email === email && ld.password === password)
                {
                    this._goMainScreen();
                }
                else
                {
                    alert('Email and Password does not exist!');
                }
            }

        }catch(error)
        {
            alert(error);
        }
    };

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };
    onSignIn = googleUser => {
//        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase
            .auth().
            onAuthStateChanged(function(firebaseUser) {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!this.isUserEqual(googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken,
                    );
                    // Sign in with credential from the Google user.
                    firebase.auth().signInWithCredential(credential).then(function (result) {
                        console.log('user signed in')
                        if (result.additionalUserInfo.isNewUser)
                        {
                            firebase
                                .database()
                                .ref('/users/' + result.user.uid)
                                .set({
                                    gmail: result.user.email,
                                    profile_picture: result.additionalUserInfo.profile.picture,
                                    locale: result.additionalUserInfo.profile.locale,
                                    first_name: result.additionalUserInfo.profile.given_name,
                                    last_name: result.additionalUserInfo.profile.family_name,
                                    created_at: Date.now()
                                })
                        } else {
                            firebase
                                .database()
                                .ref('/users/' + result.user.uid)
                                .update({
                                    last_logged_in: Date.now()
                                })
                        }
                    })
                        .catch(function(error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            // ...
                        });
                } else {
                    console.log('User already signed-in Firebase.');
                }
                Actions.mainpage()
            }.bind(this));
    };


    signInWithGoogleAsync = async () => {
        try {
            console.log("signInWithGoogleAsync");
            const result = await Google.logInAsync({
//                behavior: 'web',
                androidStandaloneAppClientId: '940807570090-vd03runjhm9hheqa3kgfcf7b36b9ci3u.apps.googleusercontent.com',
                androidClientId: '940807570090-24p1vbmp2sm20u7ph0uol4sdvdgdg08u.apps.googleusercontent.com',
 //               iosClientId: '940807570090-hivdattitrnm03du5134bk696qe9ippb.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    async componentDidMount() {
        StatusBar.setHidden(true);
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf')
        });

        this.setState({ fontLoaded: true });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'flex-end'
                }}
            >

                <Animated.View style={{...StyleSheet.absoluteFill, transform:[{translateY:this.bgY}]}}>
                    <Svg height= {height + 50} width= {width}>
                        <ClipPath id={"clip"}>
                            <Circle r={height + 50} cx={width / 2}/>
                        </ClipPath>
                        <Image
                            href={require('../../assets/images/maldives.jpg')}
                            width={width}
                            height={height + 50}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#clip)"
                        />

                    </Svg>
                </Animated.View>

                {
                    this.state.fontLoaded ? (
                        <Animated.Text style={{
                            fontFamily: 'Dancing_Script-Bold',
                            fontSize: 70,
                            position: 'absolute',
                            alignSelf: 'center',
                            top: 80,
                            color: 'white',
                            opacity:this.buttonOpacity,
                        }}>
                            Mypic
                        </Animated.Text>
                    ) : null
                }
                <View style={{height: height / 6}}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View style={{...styles.button, opacity:this.buttonOpacity,
                        transform:[{translateY:this.buttonY}]}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                SIGN IN
                            </Text>
                        </Animated.View>
                    </TapGestureHandler>
                    {
                        this.state.fontLoaded ? (
                        <Animated.View style={{
                            ...styles.signupTextCont,
                            opacity: this.buttonOpacity, transform: [{translateY: this.buttonY}]
                        }}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={this._onPress}><Text style={styles.signupButton}>Sign up
                                now</Text></TouchableOpacity>
                        </Animated.View>
                        ) : null
                    }
                    <Animated.View style={{height:height * 2/5,
                    ...StyleSheet.absoluteFill, top:null, justifyContent:'center',
                    zIndex: this.textInputZindex,
                    opacity: this.textInputOpacity,
                    transform: [{translateY: this.textInputY}]
                    }}>
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{ fontSize: 15,
                                transform:[{rotate:concat(this.rotateCross, 'deg')}]}}>
                                   X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <TextInput
                            placeholder="EMAIL"
                            style={styles.textInput}
                            placeholderTextColer="black"
                            onChangeText={(email) => this.setState({email})}
                            onSubmitEditing={() => this.password.focus()}
                        />
                        <TextInput
                            placeholder="PASSWORD"
                            style={styles.textInput}
                            placeholderTextColer="black"
                            onChangeText={(password) => this.setState({password})}
                            ref={(input) => this.password = input}
                        />
                        <Animated.View style={styles.button}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}} onPress={this.saveData}>
                                SIGN IN
                            </Text>
                        </Animated.View>
                        <Animated.View style={{...styles.button,  backgroundColor: '#de5246'}}>
                            <Text style={{fontSize:20, fontWeight: 'bold', color: 'white'}} onPress={this.signInWithGoogleAsync}>
                                SIGN IN WITH GOOGLE
                            </Text>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
        );
    }
}
export default MusicApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'white',
        height: 50,
        marginHorizontal: 30,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
    GooglePlusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc4e41',
        borderWidth: 0.5,
        borderColor: '#fff',
        height: 40,
        width: 220,
        borderRadius: 5,
        margin: 5,
    },
    closeButton: {
        height: 40, width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: width / 2 - 20,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
    textInput:{
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor:'rgba(0,0,0,0.2)'
    },
    signupTextCont: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        color: 'white',
        fontSize:16
    },
    signupButton: {
        color: '#12799f',
        fontSize: 16,
        fontWeight: '500'
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
});