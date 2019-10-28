import React, { Component } from 'react';
import {View, Text, StyleSheet, ActivityIndicator,} from 'react-native';
import { Container,} from 'native-base';

import {Actions} from 'react-native-router-flux';
import firebase from 'firebase'

export default class Loading extends Component {

    componentDidMount() {
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                Actions.mainpage()
            } else {
                Actions.login()
            }
        }.bind(this))
    };

    render() {
        return (
            <Container style={style.container}>
                <ActivityIndicator size="large"/>
            </Container>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    }
});