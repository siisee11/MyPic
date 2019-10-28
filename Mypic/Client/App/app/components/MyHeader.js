import React, { Component } from 'react';
import {View, Text, StyleSheet, ScrollView, ImageBackground,
TouchableWithoutFeedback} from 'react-native';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';

import {Actions} from 'react-native-router-flux';

import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";

export default class MyHeader extends Component {
    constructor(props){
        super(props)
    }
    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    goAddTour () {
        Actions.addtour()
    }

    goBack () {
        Actions.pop()
    }

    render() {
        return (
            <Header style={{backgroundColor: 'white'}}>
                <Left><Ionicons name='ios-images' size={25} style={{ paddingLeft: 10}}/></Left>
                <Body>
                    {
                        this.state.fontLoaded ? (
                            <Text style={{fontFamily: 'Dancing_Script-Bold', fontSize: 20}}>
                                Mypic
                            </Text>
                        ) : null
                    }
                </Body>
                <Right>
                    <TouchableWithoutFeedback
                        onPress={this.goAddTour}>
                        <Ionicons name='ios-add-circle' size={25} style={{ paddingRight:10 }}/>
                    </TouchableWithoutFeedback>
                </Right>
            </Header>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});