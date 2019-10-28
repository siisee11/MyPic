import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default class AddMediaTab extends Component {

    static navigationOptions = {
        tabBarIcon: ({ focused, tintColor }) => (
            <Ionicons name='ios-add-circle' style={{ color : tintColor }}/>
        )
    }

    render() {
        return (
            <View style={style.container}>
            <Text>AddMediaTab</Text>
            </View>
    );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});