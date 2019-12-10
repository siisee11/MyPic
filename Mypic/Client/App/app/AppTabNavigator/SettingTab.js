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
		teamVisible: false,
		dataSource: [],
		teamInfo: [],
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }
		

	async getTeamInfo() {
		return fetch("https://raw.githubusercontent.com/k-young-passionate/TermsandConditions/master/team-info.json")
			.then((response) => response.json())
			.then((responseJson) => {

				this.setState({
					teamInfo: responseJson.Teams,
				}, function(){
					//ToastAndroid.show(JSON.stringify(this.state.teamInfo), ToastAndroid.SHORT)
				});

			})
			.catch((error) =>{
				console.error(error);
			});
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

	setTeamVisible(visible) {
		this.setState({teamVisible: visible});
		if(visible){
			return this.getTeamInfo()
		}
	}

	toggleReuseFace() {
		if (global.ReuseFace) {
			global.ReuseFace = false;
		}else {
			global.ReuseFace = true;
		}
	}

    render() {
		let reuse_face_button_title = "";
		if (global.ReuseFace) {
			reuse_face_button_title = "reuse face off"
		}else {
			reuse_face_button_title = "reuse face on"
		}
        return (
            <Container style={style.container}>
                <MyHeader />
					<Modal
						animationType="slide"
						transparent={false}
						visible={this.state.teamVisible}
						onRequestClose={() => this.setTeamVisible(!this.state.teamVisible)}>

						<View style={{flex: 1, paddingTop:20, backgroundColor:"white"}}>
							<Text style={style.modalStyle}> Teams </Text>
							<FlatList
								data={this.state.teamInfo}
								renderItem={({item}) => <Text style={{paddingLeft:5, fontSize : 15}}>{item.name} </Text>}
								keyExtractor={(item, id) => id}
							/>
						</View>
					</Modal>


					<Modal
						animationType="slide"
						transparent={false}
						visible={this.state.modalVisible}
						onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}>
						<Text style={style.modalStyle}> Terms </Text>
						<View style={style.modalContentStyle}>
							<FlatList
								data={this.state.dataSource}
								renderItem={({item}) => <Text>{item.defaultTermsOfService} </Text>}
								keyExtractor={(item, id) => id}
							/>
						</View>
						<Text style={style.modalStyle}> Privacy Policy </Text>
						<View style={style.modalContentStyle}>
							<FlatList
								data={this.state.dataSource}
								renderItem={({item}) => <Text>{item.defaultPrivacyPolicy} </Text>}
								keyExtractor={(item, id) => id}
							/>
						</View>

					</Modal>

						
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{color : '#000000', fontWeight: 'bold', fontSize : 20}}> Settings </Text>
					</View>



					<View style={style.header}>
							<Text style={{color : '#000000', fontWeight: 'bold', fontSize : 15}}> Accounts </Text>
					</View>

					<View style={{ width: "98%", padding: "2%"}}>
							<Button
									onPress={() => firebase.auth().signOut()}
									title={"Sign Out"}
									color='#b0b0b0'/>
					</View>

					<View style={style.header}>
							<Text style={{color : '#000000', fontWeight: 'bold', fontSize : 15}}> Settings </Text>
					</View>

					<View style={{ width: "98%", padding: "2%"}}>
							<Button
									onPress={() => this.toggleReuseFace()}
									title={reuse_face_button_title}
									color='#b0b0b0'/>
					</View>

					<View style={style.header}>
							<Text style={{color : '#000000', fontWeight: 'bold', fontSize : 15}}> About </Text>
					</View>

					<View style={{ width: "98%", padding: "2%"}}>
							<Button
									onPress={() => this.setModalVisible(!this.state.modalVisible)}
									title={"Terms and Conditions"}
									color='#b0b0b0'/>
					</View>

					<View style={{ width: "98%", padding: "2%"}}>
							<Button
									onPress={() => this.setTeamVisible(!this.state.teamVisible)}
									title={"Team Infomation"}
									color='#b0b0b0'/>
					</View>

				<View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                </View>

            </Container>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
				justifyContent: 'center', 
        backgroundColor: 'white'
    },
		button: {
				padding: 20,
				fontSize: 15,
				fontFamily: "arial",
				width: 400,
				height: 40,
				color: "red",
				textAlign: "center"
	  },
		header: {
				justifyContent: 'center', 
//				alignItems: 'center', 
				backgroundColor: '#d3d3d3',
				flex: 1,
				paddingLeft: 5,
		},
modalStyle: {backgroundColor: '#c3c3c3', padding: 5, fontWeight: 'bold', fontSize:25, textAlign:"center"},
modalContentStyle: {flex:1, paddingLeft: 10, paddingRight: 10, fontSize:15}
});
