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

        firebase.firestore().collection("User").doc(this.state.user.uid)
            .onSnapshot((doc) => {
                doc.data().uris ? (
                    this.setState({data: doc.data().uris})
                ) : null
            });

        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    onChooseImagePress = async () => {
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 2, }}>
                {this.renderGridImages()}
            </View>
        )
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            this.setState({
                imageBrowserOpen: false,
                photos
            });
            this.onChooseImagePress()
        }).catch((e) => console.log(e))
    };

    getUserInfo = async () => {
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
                        paddingTop:15,
                        height: height / 5,
                        backgroundColor:'#232b2b',
                    }}>
                        <View style={{alignItems:'center', marginTop: 10}}>
                            {
                                user.photoURL ? (
                                    <Image source={{ uri: user.photoURL}}
                                           style={{width:70, height:70, borderRadius:35, borderColor:'#DDDDDD', borderWidth:2}}/>
                                ) : null
                            }
                        </View>
                        <View style={{flex:1, marginBottom:10}}>
                            <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                                <View style={{paddingHorizontal:5, }}>
                                    <Text style={{fontWeight:'bold', fontSize: 15, color: 'white', alignItems:'center'}}>{user.name} </Text>
                                    <Text style={{color:'white'}}>{user.email}</Text>
                                </View>
                                <View style={{paddingHorizontal:10, alignItems:'center'}}>
                                    <Text style={{color:'white'}}>1</Text>
                                    <Text style={{fontSize:10, color:'#EEEEEE'}}>following</Text>
                                </View>
                                <View style={{paddingHorizontal:10, alignItems:'center'}}>
                                    <Text style={{color:'white'}}>999+</Text>
                                    <Text style={{fontSize:10, color:'#EEEEEE'}}>follower</Text>
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
                            style={style.closeButton}
                            onPress={()=>this.setState({imageBrowserOpen: true})}>
                            <Ionicons name='ios-add' size={35} style={{color:'#232b2b'}}/>
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
    closeButton: {
        height: 40, width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
});