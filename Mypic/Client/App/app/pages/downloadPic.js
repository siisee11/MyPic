import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Keyboard,
    TextInput,
    ScrollView,
    StatusBar,
    SafeAreaView,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import ImageBrowser from "../components/ImageBrower";
import MyHeader from "../components/MyHeader";
import DownloadPicHeader from "../components/DownloadPicHeader"

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        this.state={
            name:'',
            owner : '',
            imageBrowserOpen: false,
            photos: []
        };

        alert("uid: " + this.props.uid);
    }

    goBack() {
        Actions.pop()
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
        const {name ,owner} = this.state;

        //save data with asyncstorage
        let TourDetails={
            name : name,
            owner : owner
        };

        AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));

        Keyboard.dismiss();
        alert("Tour (" + name + ') created. ');
        this.goBack();
    };

    componentDidMount() {
        StatusBar.setHidden(true);
    }

    render() {
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser max={100} callback={this.imageBrowserCallback}/>);
        }

        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />
                <TextInput style={{...styles.textInput, marginTop:20}}
                           onChangeText={(email) => this.setState({email})}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Tour name"
                           placeholderTextColor = "#121212"
                           selectionColor="#fff"
                           onSubmitEditing={()=> this.password.focus()}/>

                <TextInput style={styles.textInput}
                           onChangeText={(password) => this.setState({password})}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Date"
                           placeholderTextColor = "#121212"
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
                          onPress={() => this.setState({imageBrowserOpen: true})}>
                        CHOOSE IMAGES
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{...styles.button}}>
                    <Text style={{fontSize:20, fontWeight: 'bold'}} onPress={this.saveData}>
                        DOWNLOAD IMAGES
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
//        backgroundColor: '#121212',
    },
    signupTextCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: 16,
        flexDirection: 'row'
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
