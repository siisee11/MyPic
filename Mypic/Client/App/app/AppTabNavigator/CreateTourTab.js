import React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, ImageBackground, Animated, Dimensions, } from 'react-native';
import { Container, } from 'native-base';
import * as Font from "expo-font";

import MyHeader from '../components/MyHeader'

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT= Dimensions.get('window').height;

export default class CreateTourTab extends Component {
    state = {
        fontLoaded: false,
        search: '',
        email:'',
        password: '',
        imageBrowserOpen: false,
        photos: [],
        images: []
    };

    async componentDidMount() {
        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            console.log(photos);
            this.setState({
                imageBrowserOpen: false,
                photos
            })
        }).catch((e) => console.log(e))
    };

    renderImage(item, i) {
        return(
            <Image
                style={{height: 300, width: 300}}
                source={{uri: item.file}}
                key={i}
            />
        )
    }

    render() {
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser max={10} callback={this.imageBrowserCallback}/>);
        }

        const { search } = this.state;
        return (
            <Container style={styles.container}>
                <MyHeader />

                <TextInput style={{...styles.textInput, marginTop:20}}
                           onChangeText={(email) => this.setState({email})}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Email"
                           placeholderTextColor = "#002f6c"
                           selectionColor="#fff"
                           keyboardType="email-address"
                           onSubmitEditing={()=> this.password.focus()}/>

                <TextInput style={styles.textInput}
                           onChangeText={(password) => this.setState({password})}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Password"
                           secureTextEntry={true}
                           placeholderTextColor = "#002f6c"
                           ref={(input) => this.password = input}
                />

                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{flexGrow : 1, justifyContent: 'center'}}
                    style={styles.scrollView}>
                    {this.state.photos.map((item,i) => this.renderImage(item,i))}
                </ScrollView>

                <TouchableOpacity style={{...styles.button, backgroundColor: '#12799f'}}>
                    <Text style={{fontSize:20, fontWeight: 'bold', color: 'white'}}
                          onPress={()=>this.setState({imageBrowserOpen: true})}>
                        CHOOSE IMAGES
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{...styles.button}}>
                    <Text style={{fontSize:20, fontWeight: 'bold'}} onPress={this.saveData}>
                        SIGN UP
                    </Text>
                </TouchableOpacity>

                <View style={{...styles.signupTextCont}}>
                    <Text style={styles.signupText}>Already have an account? </Text>
                    <TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}>Sign in</Text></TouchableOpacity>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    textOverImage: {
        fontSize: 32,
        color: 'white',
        marginLeft: 20
    },
    signupText: {
        color: '#12799f',
        fontSize:16
    },
    signupButton: {
        color: '#12799f',
        fontSize:16,
        fontWeight: '500'
    },
    textInput:{
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'white',
        height: 50,
        marginHorizontal: 50,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    scrollView: {
        height : 300,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor:'rgba(0,0,0,0.2)',
        backgroundColor:'white',
        marginHorizontal : 10,
        marginVertical: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    }
});
