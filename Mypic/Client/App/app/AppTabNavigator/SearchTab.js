import React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, Platform, ImageBackground, Animated, Dimensions, TouchableWithoutFeedback, ToastAndroid} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcon from '@expo/vector-icons/MaterialIcons'
import * as Font from "expo-font";

import MyHeader from '../components/MyHeader'

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT= Dimensions.get('window').height;

const getimages = [
    { id: 1, tour:"종설투어", city: "수원", src: require('../../assets/images/sea.jpg')},
    { id: 2, tour:"종설투어", city: "광명", src: require('../../assets/images/sunrise.jpg')},
    { id: 3, tour:"재필투어", city: "광주", src: require('../../assets/images/maldives.jpg')},
    { id: 4, tour:"재필투어", city: "광양", src: require('../../assets/images/hot-air-balloon.jpg')},
];

const fonts = [
    { id: 1, font: 'Gaegu-Regular'},
    { id: 2, font: 'EastSeaDokdo-Regular'},
    { id: 3, font: 'Nanum_pen_Script-Regular'},
    { id: 4, font: 'Yeon_Sung-Regular'},
]

export default class SearchTab extends Component {
    state = {
        fontLoaded: false,
        search: '',
        images: []
    };

    updateSearch = search => {
        let images = [];
        for (let i=0; i<getimages.length; i++){
//            ToastAndroid.show(getimages[i].city+" == "+this.state.search, ToastAndroid.SHORT);
          if(getimages[i].city === this.state.search){
            images.push(getimages[i]);
          }
        }
        this.setState({images});
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    render() {
        const { search } = this.state;
        return (
            <Container tyle={style.container}>
                <MyHeader />
                <View style={{
                    flexDirection: 'row', padding: 10,
                    backgroundColor: 'white', marginHorizontal: 20,
                    shadowOffset: { width: 0, height: 0},
                    shadowColor: 'black',
                    shadowOpacity: 0.2,
                    elevation: 2,
                    marginTop: Platform.OS === 'android' ? 20 : null,
                }}>
                    <Ionicons name="ios-search" size={25}
                    style={{marginRight: 10,
                    marginLeft: 5}}/>
                    <TextInput
                        onChangeText={(text) => this.setState({search: text})}
                        value = {this.state.search}
                        onSubmitEditing={(search)=>this.updateSearch(this.state.search)}
                        underlineColorAndroid="transparent"
                        placeholder="Type here..."
                        placeholderTextColor="grey"
                        style={{flex:1, fontWeight: '700',
                        backgroundColor: 'white',
                        borderRadius:5}}
                    />
                </View>

                <ScrollView style={{flex : 1}}>
                    {
                        this.state.images.map((image, index) => {
                            const random = 3;//Math.floor(Math.random() * 4);
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
                                                       대한민국 {image.city}시{"\n"}
                                                       {image.tour} 여행
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

            </Container>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    textOverImage: {
        fontSize: 32,
        color: 'white',
        marginLeft: 20
    },

});
