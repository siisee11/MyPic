import React, { Component } from 'react';
import {Modal, FlatList, View, Text, ToastAndroid, StyleSheet, Button, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";

import MyHeader from "../components/MyHeader"
import firebase from 'firebase'

export default class SettingTab extends Component {
    state = {
        fontLoaded: false,
				modalVisible: false,
				dataSource: [],
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),

        });

        this.setState({ fontLoaded: true });
    }
		
// 'https://facebook.github.io/react-native/movies.json'
		async getTermsandConditions() {
			return fetch('https://raw.githubusercontent.com/brikteknologier/default-terms-and-conditions/master/terms-and-conditions.json')
				.then((response) => response.json())
				.then((responseJson) => {

					this.setState({
						dataSource: responseJson,
					}, function(){
						ToastAndroid.show(JSON.stringify(responseJson), ToastAndroid.SHORT)
					});

				})
				.catch((error) =>{
        console.error(error);
				});

		}

		setModalVisible(visible) {
			this.setState({modalVisible: visible});
			if(visible){
				return this.getTermsandConditions()
			}
		}

    render() {
        return (
            <Container style={style.container}>
                <MyHeader />
									<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						        <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible)}>
											<Text style={{color : '#12799f'}}> popup </Text>
										</TouchableOpacity>
									
									</View>

												<Modal
													animationType="slide"
													transparent={false}
													visible={this.state.modalVisible}
													onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}>

													<View style={{flex: 1, paddingTop:20}}>
														<FlatList
															data={this.state.dataSource}
															renderItem={({item}) => <Text>{item.defaultTermsOfService} {item.defaultPrivacyPolicy}</Text>}
															keyExtractor={() => id}
														/>
													</View>
												</Modal>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => firebase.auth().signOut()}>
                        <Text style={{color : '#12799f'}}> SignOut </Text>
                    </TouchableOpacity>

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
