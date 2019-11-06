import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, ScrollView, StatusBar,
    Animated, Dimensions, SafeAreaView, ImageBackground, TouchableWithoutFeedback} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import MyHeader from '../components/MyHeader'
import DownloadPic from '../pages/downloadPic'
import {Actions} from 'react-native-router-flux';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT= Dimensions.get('window').height;

const fonts = [
    { id: 1, font: 'Gaegu-Regular'},
    { id: 2, font: 'EastSeaDokdo-Regular'},
    { id: 3, font: 'Nanum_pen_Script-Regular'},
    { id: 4, font: 'Yeon_Sung-Regular'},
]

export default class HomeTab extends Component {
    constructor(){
        super()
        this.state={
            activeImage:null,
            data: [],
            tours: [],
            thumbnails: [],
            user: {
                name: '',
                email: '',
                photoURL: '',
                uid: '',
            },
        }
        this.goDownloadPic = this.goDownloadPic.bind(this)
    }

    state = {
        fontLoaded: false,
    };

    goDownloadPic (index) {
      Actions.downloadPic({
        uid: this.state.user.uid,
        tour: this.state.tours[index],
      })
    }

    componentDidMount = async () => {
        await this.getUserInfo();

        await firebase.firestore().collection("User").doc(this.state.user.uid)
            .onSnapshot((doc) => {

                let tours = doc.data().tours;
                tours? (
                    tours.map( tour => {
                        tour.get()
                            .then(res =>{
                                let data = res.data();
                                let tour_info = {
                                    tour_ref : data,
                                    tour_name : data.tourName,
                                    tour_description : data.description,
                                    tour_thumbnail : data.thumbnail,
                                    tour_startedAt : data.tourStartedAt,
                                };
                                let append_tours = this.state.tours.concat(tour_info);
                                this.setState(prevState => ({
                                    tours : append_tours,
                                }));
                                console.log("tours");
                                console.log(this.state.tours);
                            }).catch(error => console.log(error))
                    })
                ) : null;
            });

        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });
    }

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
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <MyHeader />
                <ScrollView style={{flex : 1}}>
                    {
                        this.state.tours.map((tour, index) => {
                            const random = Math.floor(Math.random() * 4);
                            let date_json = tour.tour_startedAt.toDate();
                            let date_string = date_json.getFullYear() + '년 ' + date_json.getMonth()+1 + '월 ' + date_json.getDate() + '일';

                            return (
                                <TouchableWithoutFeedback
                                  key={index}
                                  onPress={() => this.goDownloadPic(index)}>
                                    <Animated.View
                                        style={{
                                            height : SCREEN_HEIGHT - 150,
                                            width: SCREEN_WIDTH,
                                            padding: 15
                                        }}>
                                       <ImageBackground
                                           source={{uri: tour.tour_thumbnail}}
                                           imageStyle={{ borderRadius: 20}}
                                           style={{flex:1, height:null, width:null,
                                           resizeMode: 'cover', borderRadius:20,
                                           justifyContent: 'center'}}>
                                           {
                                               this.state.fontLoaded ? (
                                                   <Text style={{
                                                       ...style.textOverImage,
                                                       fontFamily : fonts[random].font,
                                                       fontSize : 20,
                                                   }}>
                                                       {date_string}
                                                   </Text>
                                                   ) : null
                                           }
                                           {
                                               this.state.fontLoaded ? (
                                                   <Text style={{
                                                       ...style.textOverImage,
                                                       fontFamily : fonts[random].font,
                                                   }}>
                                                       {tour.tour_name}{"\n"}
                                                       {tour.tour_description}
                                                   </Text>
                                               ) : null
                                           }
                                       </ImageBackground>
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    textOverImage: {
        fontSize: 32,
        color: 'white',
        marginLeft: 20
    },
});
