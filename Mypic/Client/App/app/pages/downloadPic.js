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
    Dimensions,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import ImageBrowser from "../components/ImageBrower";
import MyHeader from "../components/MyHeader";
import DownloadPicHeader from "../components/DownloadPicHeader"

var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);

        this.state={
            name:'',
            owner : '',
            imageBrowserOpen: false,
            photos: [],
            images:[],
            tour: null,
        };
//        alert("uid: " + this.props.uid + "\ntours_: " + this.props.tour.tour_ref.tourName);

    }

    componentDidMount = async () => {
      this.props.tour.get()
      .then(res => {
        let data = res.data();
        console.log(data);
        let tour_info = {
            tour_name : data.tourName,
            tour_description : data.description,
            tour_thumbnail : data.thumbnail,
            tour_startedAt : data.tourStartedAt,
            tour_images : data.images,
            tour_date_string : data.tourStartedAt.toDate().toDateString(),
        };
        this.setState(prevState => ({
            tour: tour_info,
        }));
      }).catch(error => console.log(error))
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

    renderGridImages() {
        return this.state.tour.tour_images.map((image, index) => {
            return (
                <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                    <Image style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined,
                    }}
                           source={{ uri: image}}>
                    </Image>
                </View>
            )
        })
    }

    renderSection() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 20, }}>
                {this.renderGridImages()}
            </View>
        )
    }

    render() {
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser max={100} callback={this.imageBrowserCallback}/>);
        }

        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />
                <Text style={{...styles.textInput, marginTop:20}}>
                           {
                             this.state.tour ?
                             this.state.tour.tour_name : null
                           }
                </Text>

                <Text style={styles.textInput}>
                           {
                             this.state.tour ?
                             this.state.tour.tour_startedAt.toDate().toDateString() : null
                           }
                </Text>

                <View style={{ flex: 1, }}>
                    {this.state.tour ? this.renderSection() : null }
                </View>

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
