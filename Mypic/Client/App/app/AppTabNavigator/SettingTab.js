import React, { Component } from 'react';
import {View, Text, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";

import MyHeader from "../components/MyHeader"

export default class SettingTab extends Component {
    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),

        });

        this.setState({ fontLoaded: true });
    }

    render() {
        return (
            <Container style={style.container}>
                <MyHeader />

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Setting</Text>
                </View>

            </Container>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});