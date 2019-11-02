import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, ScrollView, StatusBar,
    Animated, Dimensions, SafeAreaView, ImageBackground, TouchableWithoutFeedback} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import firebase from 'firebase'

import MyHeader from '../components/MyHeader'

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT= Dimensions.get('window').height;

const images = [
    { id: 1, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Fcinque-terre.jpg?alt=media&token=84ee3271-5468-464c-ac1d-78ceadf50247'},
    { id: 2, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Feiffel-tower.jpg?alt=media&token=895c6c6f-6702-4187-b886-bc90dfd7dfb3'},
    { id: 3, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Fgo-pro.jpg?alt=media&token=b4724847-16e1-4eeb-8f9e-1642645bd3e1'},
    { id: 4, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Fhot-air-balloon.jpg?alt=media&token=e640261f-9872-405c-a6bd-eeea4341b837'},
    { id: 5, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Fmaldives.jpg?alt=media&token=2ca5699a-8ab7-4b88-aaa6-27608131453c'},
    { id: 6, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Fsea.jpg?alt=media&token=9518ce10-9d60-42b7-8db3-6e9e2c089bb1'},
    { id: 7, uri: 'https://firebasestorage.googleapis.com/v0/b/mypic-92b94.appspot.com/o/images%2Fsunrise.jpg?alt=media&token=d6a14fa6-0a1f-437e-b229-9162a426cf13'},
];

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
        }
    }

    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <MyHeader />

                <ScrollView style={{flex : 1}}>
                    {
                        images.map((image, index) => {
                            const random = Math.floor(Math.random() * 4);
                            return (
                                <TouchableWithoutFeedback key={image.id}>
                                    <Animated.View
                                        style={{
                                            height : SCREEN_HEIGHT - 150,
                                            width: SCREEN_WIDTH,
                                            padding: 15
                                        }}>
                                       <ImageBackground
                                           source={{uri: image.uri}}
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
                                                       2019년 10월 21일
                                                   </Text>
                                                   ) : null
                                           }
                                           {
                                               this.state.fontLoaded ? (
                                                   <Text style={{
                                                       ...style.textOverImage,
                                                       fontFamily : fonts[random].font,
                                                   }}>
                                                       대한민국 수원시{"\n"}
                                                       종설투어 여행
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