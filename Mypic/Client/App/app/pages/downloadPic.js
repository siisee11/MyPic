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

        let date_json = this.props.tour.tour_startedAt.toDate();
        let date_string = date_json.getFullYear() + '년 ' + date_json.getMonth()+1 + '월 ' + date_json.getDate() + '일';

        this.state={
            name:'',
            owner : '',
            imageBrowserOpen: false,
            photos: [],
            date_string: date_string,
            tour_ref: this.props.tour.tour_ref,
        };
        alert("uid: " + this.props.uid + "\ntours_: " + this.props.tour.tour_ref.tourName);

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
                source={{uri: item}}
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

    componentDidMount(){

    }
/*
    componentDidMount = async () => {
        StatusBar.setHidden(true);

        await firebase.firestore().collection("Tour").doc(this.state.tour_ref.images)
            .onSnapshot((doc) => {
                let tours = doc.data().tours;
                tours? (
                    tours.map( tour => {
                        tour.get()
                            .then(res =>{
                                let data = res.data();
                                let tour_info = {
                                    tour_name : data.tourName,
                                    tour_description : data.description,
                                    tour_thumbnail : data.thumbnail,
                                    tour_startedAt : data.tourStartedAt,
                                };
                                let append_tours = this.state.tours.concat(tour_info);
                                this.setState(prevState => ({
                                    tours : append_tours,
                                }));
                                console.log("tours");
                                console.log(this.state.tours);
                            }).catch(error => console.log(error))
                    })
                ) : null;
            });

        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });
    }
*/

    render() {
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser max={100} callback={this.imageBrowserCallback}/>);
        }

        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />
                <Text style={{...styles.textInput, marginTop:20}}>
                           {this.props.tour.tour_ref.tourName}
                </Text>

                <Text style={styles.textInput}>
                           {this.state.date_string}
                </Text>

                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{flexGrow : 1, justifyContent: 'center'}}
                    style={styles.scrollView}>
                    {this.props.tour.tour_ref.images.map((item,i) => this.renderImage(item,i))}
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
