import React, { Component } from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, ImageBackground, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Container, Content, } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import MyHeader from '../components/MyHeader';
import ImageBrowser from "../components/ImageBrower";

var { height, width } = Dimensions.get('window');

export default class ProfileTab extends Component {
    state = {
        fontLoaded: false,
        data: [],
        imageBrowserOpen: false,
        photos: [],
        user: {
            name: '',
            email: '',
            photoURL: '',
            uid: '',
        },
    };

    componentDidMount = async() => {
        await this.getUserInfo();

        await firebase.firestore().collection("User").doc(this.state.user.uid)
            .onSnapshot((doc) => {
                console.log("Current data: ", doc.data());
                doc.data().uris ? (
                    this.setState({data: doc.data().uris})
                ) : null
            });
/*
        const ref = firebase.database().ref().child("images").child(this.state.user.uid);
        ref.on("value", snapshot => {
            this.setState({data: []});
            snapshot.forEach( childSnapshot => {
                this.setState(prevState => ({
                    data : [childSnapshot.val(), ...prevState.data]
                }));
            })
        });
 */

        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    onChooseImagePress = async () => {
        console.log("photo:");
        console.log(this.state.photos);

        this.state.photos.map( (photo, index) => {
            this.uploadImage(photo.uri, index)
                .then(() => {
                    Alert.alert("Success");
                })
                .catch((error) => {
                    Alert.alert(error.message);
                });
        })
    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref().child("user_images/" + this.state.user.uid + '/'+ imageName);
        await ref.put(blob);

        ref.getDownloadURL().then( (url) => {
            firebase
                .firestore()
                .collection('User')
                .doc(this.state.user.uid)
                .update({
                    uris: firebase.firestore.FieldValue.arrayUnion(url),
                }).then((result) => {
                    console.log("URI uploaded to cloud firestore.")
                }).catch((error) => {
                    console.log(error)
                });
        }).catch( (error) => {
            console.log('cannot get URL from firebase');
        });
        return true;
    };

    renderGridImages() {
        return this.state.data.map((image, index) => {
            return (
                <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                    <Image style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined,
                    }}
                           source={{ uri: image}}>
                    </Image>
                </View>
            )
        })
    }

    renderSection() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 20, }}>
                {this.renderGridImages()}
            </View>
        )
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            console.log("image callback");
            this.setState({
                imageBrowserOpen: false,
                photos
            });
            this.onChooseImagePress()
        }).catch((e) => console.log(e))
    };

    getUserInfo = () => {
        let user = firebase.auth().currentUser;
        let name, email, photoUrl, uid, emailVerified;

        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                             // this value to authenticate with your backend server, if
                             // you have one. Use User.getToken() instead.
        }

        this.setState({
            user: {
                name: name,
                email: email,
                photoURL: photoUrl,
                uid: uid,
            }
        })
    }

    render() {
        const {
            user
        } = this.state;

        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser max={10} callback={this.imageBrowserCallback}/>);
        }
        return (
            <Container tyle={style.container}>
                <MyHeader />

                <View>
                    <View style={{
                        flexDirection:'row',
                        paddingTop:15,
                        shadowOffset: { width: 2, height: 2 },
                        shadowColor: 'black',
                        shadowOpacity: 0.2,
                        elevation: 2,
                    }}>
                        <View style={{flex:1, alignItems:'center'}}>
                            {
                                user.photoURL ? (
                                    <Image source={{ uri: user.photoURL}}
                                           style={{width:60, height:60, borderRadius:30, borderColor:'#12799f', borderWidth:2}}/>
                                ) : null
                            }
                        </View>
                        <View style={{flex:3}}>
                            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                                <View style={{paddingHorizontal:5, paddingVertical:10}}>
                                    <Text style={{fontWeight:'bold', fontSize: 15, }}>{user.name} </Text>
                                    <Text>{user.email}</Text>
                                </View>
                                <View style={{paddingHorizontal:10, paddingVertical:15, alignItems:'center'}}>
                                    <Text>1</Text>
                                    <Text style={{fontSize:10, color:'gray'}}>following</Text>
                                </View>
                                <View style={{paddingHorizontal:10, paddingVertical:15, alignItems:'center'}}>
                                    <Text>999+</Text>
                                    <Text style={{fontSize:10, color:'gray'}}>follower</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, }}>
                    {this.state.data ? this.renderSection() : null }
                    <View style={{
                        flex: 1,
                        paddingBottom:15,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        }}
                    >
                        <TouchableOpacity
                            style={{}}
                            onPress={()=>this.setState({imageBrowserOpen: true})}>
                            <Ionicons name='ios-add-circle' size={30} style={{}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});