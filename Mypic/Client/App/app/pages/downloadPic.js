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
    ImageBackground,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import DownloadPicHeader from "../components/DownloadPicHeader"
import * as Font from "expo-font";
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        this.state={
            tour: this.props.tour_info,
            my_images : [],
            fontLoaded: false,
        };
    }

    componentDidMount = async () => {
        this.props.mypic_ref
            .get()
            .then(res => {
                let data = res.data();
                this.setState({
                    my_images : data.myImages,
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
        alert('Saving to local device finish in few seconds.');
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status == 'granted') {
            this.state.my_images.map(async (img_uri) => {
                let img_name = img_uri.split('%')[2].split('?')[0].substring(2);

                const file = await FileSystem.downloadAsync(
                    img_uri,
                    FileSystem.documentDirectory + img_name,
                );

                const asset = await MediaLibrary.createAssetAsync(file.uri);
                MediaLibrary.createAlbumAsync(this.state.tour.tour_name, asset)
                    .then(() => {
                        console.log('Album ' + this.state.tour.tour_name + ' created!');
                    })
                    .catch(error => {
                        console.log('err', error);
                    });
            }) /* map end */
        }

        this.goBack();
    };


    renderGridImages() {
        return this.state.my_images.map((image, index) => {
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                {this.renderGridImages()}
            </View>
        )
    }

    renderThumbnail() {
        return (
            <ImageBackground
                blurRadius={ Platform.OS == 'ios' ? 10 : 5 }
                source={{uri: this.state.tour.tour_thumbnail}}
                imageStyle={{ borderRadius: 0}}
                style={{flex:1, height:null, width:null,
                    resizeMode: 'cover', borderRadius:0,
                    justifyContent: 'center'}}>
                <View style={{...styles.overlay, borderRadius:0 }}>
                {
                    this.state.fontLoaded ? (
                        <Text style={{...styles.textInput, marginTop:10, fontSize: 40, fontFamily: 'EastSeaDokdo-Regular'}}>
                            {
                                this.state.tour.tour_name ?
                                    this.state.tour.tour_name : null
                            }
                        </Text>
                    ) : null
                }
                {
                    this.state.fontLoaded ? (
                        <Text style={{...styles.textInput, fontSize:20, marginVertical:0, color: '#868e96', fontFamily: 'Nanum_pen_Script-Regular', }}>
                            {
                                this.state.tour.tour_startedAt ?
                                    this.state.tour.tour_startedAt.toDate().toDateString() : null
                            }
                        </Text>
                    ) : null
                }
                {
                    <Text style={{...styles.textInput, fontSize: 30,fontFamily: 'EastSeaDokdo-Regular', }}>
                        {
                            this.state.tour.tour_location?
                                this.state.tour.tour_location: null
                        }
                    </Text>
                }
                </View>
            </ImageBackground>
        );
    }

    render() {
        console.log(this.state.tour)
        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />

                <View
                    style={{
                        height : height / 5,
                        width: width,
                        marginVertical: 5
                    }}>
                    { this.state.tour.tour_thumbnail? this.renderThumbnail() : null }
                </View>


                <View style={{ flex: 1, }}>
                    {this.state.my_images? this.renderSection() : null }
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
    overlay: {
        flex:1,
        backgroundColor:'rgba(255,255,255,0.6)',
//        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput:{
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
//        alignSelf: 'center',
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
