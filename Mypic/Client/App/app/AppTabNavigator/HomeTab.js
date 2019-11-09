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
            tours: [],
            mypic_refs: [],
            thumbnails: [],
            user: {
                name: '',
                email: '',
                photoURL: '',
                uid: '',
            },
        };
        this.goDownloadPic = this.goDownloadPic.bind(this)
    }

    state = {
        fontLoaded: false,
    };

    goDownloadPic (index) {
        Actions.downloadPic({
            uid: this.state.user.uid,
            tour_info : this.state.tours[index],
            mypic_ref: this.state.mypic_refs[index],
        })
    }

    componentDidMount = async () => {
        await this.getUserInfo();

        await firebase.firestore()
            .collection("User")
            .doc(this.state.user.uid)
            .collection("Mytour")
            .get().then( (querySnapshot) => {
                querySnapshot.forEach( (doc) => {
                    let doc_data = doc.data();
                    let append_mypic_refs = this.state.mypic_refs.concat(doc_data.thisRef);
                    this.setState({
                        mypic_refs : append_mypic_refs,
                    })
                    doc_data.tourRef.get()
                        .then(res =>{
                            let data = res.data();
                            let tour_info = {
                                tour_name : data.tourName,
                                tour_description : data.description,
                                tour_thumbnail : data.thumbnail,
                                tour_startedAt : data.tourStartedAt,
                                tour_location : data.location,
                            };
                            let append_tours = this.state.tours.concat(tour_info);
                            this.setState(prevState => ({
                                tours : append_tours,
                            }));
                        }).catch(error => console.log(error))
                })
            })

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
        let name, email, photoUrl, uid;

        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            uid = user.uid;
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
                            let date_string = date_json.toDateString();
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
                                                        {tour.tour_location}
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
