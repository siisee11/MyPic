import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Button, AsyncStorage, Keyboard, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux';

import ImageBrowser from './ImageBrower';

export default class Form extends Component {

    constructor(props){
        super(props);
        this.state={
            email:'',
            password: '',
            imageBrowserOpen: false,
            photos: []
        };
    }

    login () {
       Actions.login();
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

    saveData =async()=>{
        const {email,password} = this.state;

        //save data with asyncstorage
        let loginDetails={
            email: email,
            password: password
        };

        if(this.props.type !== 'Login')
        {
            AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));

            Keyboard.dismiss();
            alert("You successfully registered. Email: " + email + ' password: ' + password);
            this.login();
        }
        else if(this.props.type === 'Login')
        {
            try{
                let loginDetails = await AsyncStorage.getItem('loginDetails');
                let ld = JSON.parse(loginDetails);

                if (ld.email != null && ld.password != null)
                {
                    if (ld.email === email && ld.password === password)
                    {
                        alert('Go in!');
                    }
                    else
                    {
                        alert('Email and Password does not exist!');
                    }
                }

            }catch(error)
            {
                alert(error);
            }
        }
    }

    showData = async()=>{
        let loginDetails = await AsyncStorage.getItem('loginDetails');
        let ld = JSON.parse(loginDetails);
        alert('email: '+ ld.email + ' ' + 'password: ' + ld.password);
    }

    render() {
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser max={10} callback={this.imageBrowserCallback}/>);
        }

        return(
            <View style={styles.container}>
                <TextInput style={styles.textInput}
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

                <TouchableOpacity style={{...styles.button, backgroundColor: '#12799f'}}>
                    <Text style={{fontSize:20, fontWeight: 'bold', color: 'white'}}
                          onPress={() => this.setState({imageBrowserOpen: true})}>
                        CHOOSE IMAGES
                    </Text>
                </TouchableOpacity>
                <Text>This is an example of a</Text>
                <Text>multi image selector using expo</Text>
                <ScrollView>
                    {this.state.photos.map((item,i) => this.renderImage(item,i))}
                </ScrollView>

                <TouchableOpacity style={{...styles.button}}>
                    <Text style={{fontSize:20, fontWeight: 'bold'}} onPress={this.saveData}>
                        SIGN UP
                    </Text>
                </TouchableOpacity>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: 'grey'
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
        height: 60,
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
    }
});