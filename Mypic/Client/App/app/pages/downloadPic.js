import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Dimensions,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import DownloadPicHeader from "../components/DownloadPicHeader"
import * as Font from "expo-font";

var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        this.state={
            tour: {
                tour_name : '',
                tour_description : '',
                tour_startedAt : null,
                tour_images : [],
            },
            fontLoaded: false,
        };
    }

    componentDidMount = async () => {
        this.props.tour
            .get()
            .then(res => {
                let data = res.data();
                this.setState({
                    tour: {
                        tour_name : data.tourName,
                        tour_description : data.description,
                        tour_startedAt : data.tourStartedAt,
                        tour_images : data.images,
                    },
                });
            }).catch(error => console.log(error))

        await Font.loadAsync({
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });
    };

    goBack() {
        Actions.pop()
    }

    saveData =async()=>{
        alert('Tour images saved to gallery');
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
        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />
                <Text style={{...styles.textInput, marginTop:20, fontSize: 30, fontFamily: 'Yeon_Sung-Regular'}}>
                           {
                             this.state.tour.tour_name ?
                             this.state.tour.tour_name : null
                           }
                </Text>

                <Text style={{...styles.textInput, fontSize:20,fontFamily: 'Nanum_pen_Script-Regular', }}>
                           {
                             this.state.tour.tour_startedAt ?
                             this.state.tour.tour_startedAt.toDate().toDateString() : null
                           }
                </Text>

                <Text style={{...styles.textInput, fontSize: 20,fontFamily: 'Yeon_Sung-Regular', }}>
                    {
                        this.state.tour.tour_description ?
                            this.state.tour.tour_description: null
                    }
                </Text>

                <View style={{ flex: 1, }}>
                    {this.state.tour.tour_images ? this.renderSection() : null }
                </View>

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
    textInput:{
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: 'white',
        height: 50,
        marginHorizontal: 50,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 15,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 2
    },
});
