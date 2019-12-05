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
		
		async getTermsandConditions() {
			return fetch("https://raw.githubusercontent.com/k-young-passionate/TermsandConditions/master/terms-and-conditions.json")
				.then((response) => response.json())
				.then((responseJson) => {

					this.setState({
						dataSource: responseJson.terms,
					}, function(){
						//ToastAndroid.show(JSON.stringify(responseJson), ToastAndroid.SHORT)
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
						        
									<Modal
										animationType="slide"
										transparent={false}
										visible={this.state.modalVisible}
										onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}>

										<View style={{flex: 1, paddingTop:20}}>
											<FlatList
												data={this.state.dataSource}
												renderItem={({item}) => <Text>{item.defaultTermsOfService} </Text>}
												keyExtractor={(item, id) => id}
											/>
										</View>
									</Modal>


                  <TouchableOpacity style={{flex: 1}} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
										<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
											<Text style={{color : '#12799f'}}> Terms and Conditions </Text>
										</View>
                  </TouchableOpacity>

                  <TouchableOpacity style={{flex: 1}} onPress={() => firebase.auth().signOut()}>
										<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{color : '#12799f'}}> SignOut </Text>

										</View>
                  </TouchableOpacity>
								<View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
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
