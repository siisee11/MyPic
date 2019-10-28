import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, ScrollView, StatusBar,
    Animated, Dimensions, SafeAreaView, ImageBackground, TouchableWithoutFeedback} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

import MyHeader from '../components/MyHeader'

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT= Dimensions.get('window').height;

const images = [
    { id: 1, src: require('../../assets/images/sea.jpg')},
    { id: 2, src: require('../../assets/images/sunrise.jpg')},
    { id: 3, src: require('../../assets/images/maldives.jpg')},
    { id: 4, src: require('../../assets/images/hot-air-balloon.jpg')},
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
                                           source={image.src}
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