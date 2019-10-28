import React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, Platform, ImageBackground} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcon from '@expo/vector-icons/MaterialIcons'
import * as Font from "expo-font";

import MyHeader from '../components/MyHeader'

export default class SearchTab extends Component {
    state = {
        fontLoaded: false,
        search: '',
    };

    updateSearch = search => {
        this.setState({ search });
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
                        underlineColorAndroid="transparent"
                        placeholder="Type here..."
                        placeholderTextColor="grey"
                        style={{flex:1, fontWeight: '700',
                        backgroundColor: 'white',
                        borderRadius:5}}
                    />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Search</Text>
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