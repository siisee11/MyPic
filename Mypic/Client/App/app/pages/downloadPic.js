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
    Slider,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import DownloadPicHeader from "../components/DownloadPicHeader"
import * as Font from "expo-font";
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import ndarray from 'ndarray'
import gemm from 'ndarray-gemm'
import ops from 'ndarray-ops'
import pack from 'ndarray-pack'


var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        /*
        props : {
            uid : user id
            profile_embeddings: user's profile embeddings
            tour_info : tour information
            mypic_ref: reference to 'User/Mytour/<Tourname>'
            tour_refs : reference to 'Tour/<Tourname>'
        }
        */

        this.state={
            tour: this.props.tour_info, // copy from props for easy use
            images : [],                // All images from myImages
            likelihoods : [],           // All likelihoods from myImages
            my_images : [],             // images above threshold
            uris : [],                  // uri for download images (Unused)
            fontLoaded: false,
            threshold: 50,
            profile_embeddings: this.props.profile_embeddings,
            profile_embeddings_ndarray: null,
            tour_images_embeddings: [],
            tour_images_embeddings_ndarray: null,
        };
    }

    componentDidMount = async () => {
        this.props.mypic_ref
//            .get()
            .onSnapshot(res => {
//            .then(res => {
                let data = res.data();
                for (const key in data.myImages) {
                    let likelihood = data.myImages[key];
                    let append_images = this.state.images.concat(key)
                    this.setState(({
                        images : append_images,
                    }));
                    let append_likelihood = this.state.likelihoods.concat(likelihood)
                    this.setState(({
                        likelihoods : append_likelihood,
                    }));
                }

                this.state.images.map( (image, index) => {
                    if (this.state.likelihoods[index] * 100 > this.state.threshold) {
                        let append_my_images = this.state.my_images.concat(image);
                        this.setState(({
                            my_images : append_my_images,
                        }));
                    }
                })

            }).catch(error => console.log(error));


        this.props.tour_ref
            .collection("Embedding")
//            .get().then( (querySnapshot) => {
            .onSnapshot( (querySnapshot) => {
                querySnapshot.forEach( (doc) => {
                    let doc_data = doc.data();
                    let doc_id = doc.id;
                    let image_embeddings = new Array(); 
                    let image_map = new Map();      // map image name and embedding
                    for (var key in doc_data){
                        value = doc_data[key]
                        image_embeddings.push(value)
                    }
                    image_map.set("embeddings", image_embeddings);
                    image_map.set("file_name", doc_id);

//                    if (doc_id === '20190924_131430.jpg')
//                        console.log(image_embeddings)

                    let append_tour_images_embeddings= this.state.tour_images_embeddings.concat(image_embeddings);
                    this.setState({
                        tour_images_embeddings : append_tour_images_embeddings,
                    })
                })

                let tour_embeddings_to_ndarray = pack(this.state.tour_images_embeddings)

                this.setState({
                    tour_images_embeddings_ndarray: tour_embeddings_to_ndarray,
                })
                console.log("shape of tour embeddings: ")
                console.log(this.state.tour_images_embeddings_ndarray.shape)
            }).catch(error => console.log(error));

        await Font.loadAsync({
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });

        let profile_embeddings_to_array = Object.values(this.state.profile_embeddings);
        let profile_embeddings_to_ndarray = pack(profile_embeddings_to_array);
        console.log("shape of profile embeddings:")
        console.log(profile_embeddings_to_ndarray.shape);
        this.setState({
            profile_embeddings_ndarray: profile_embeddings_to_ndarray,
        });
    };

    goBack() {
        Actions.pop()
    }

    get_angular_distances(embs1, embs2) {
        // Returns Cosine Angular Distance Matrix of given 2 sets of embeddings.
        var distanceMatrix = ndarray(new Float32Array(embs1.shape[0] * embs2.shape[0]), [embs1.shape[0], embs2.shape[0]])
        gemm(distanceMatrix, embs1, embs2.transpose(1, 0))

        for (let i=0; i<embs1.shape[0]; ++i) {
            ops.divseq(distanceMatrix.pick(i, null), ops.norm2(embs1.pick(i, null)))
        }

        for (let j=0; j<embs2.shape[0]; ++j) {
            ops.divseq(distanceMatrix.pick(null, j), ops.norm2(embs2.pick(j, null)))
        }

        return distanceMatrix
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

    getImage = async (image) => {
        const ref = firebase.storage().ref().child("tour_images/" + this.state.tour.tour_name + image);
        ref.getDownloadURL().then( (url) => {
            this.setState(prevState => ({
                uris : [url, ...prevState.uris]
            }));
        }).catch( (error) => {
            console.log('cannot get image from firebase');
        });
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 2, }}>
                {
                    this.renderGridImages()
                }
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
        this.state.tour_images_embeddings_ndarray && this.state.profile_embeddings_ndarray? (
            console.log(this.get_angular_distances(this.state.tour_images_embeddings_ndarray, this.state.profile_embeddings_ndarray))
        ) : null

        return(
            <SafeAreaView style={styles.container}>
                <DownloadPicHeader title="Download Pictures" />

                <View
                    style={{
                        height : height / 5,
                        width: width,
                        marginTop: 5,
                    }}>
                    { this.state.tour.tour_thumbnail? this.renderThumbnail() : null }
                </View>

                <ScrollView style={{flex: 1, backgroundColor: 'white'}}>

                    <View style={{ flex: 1, }}>
                        {this.state.my_images? this.renderSection() : null }
                    </View>
                </ScrollView>

                    <Slider 
                        style={{width : width * 2 / 3, alignSelf:'center', marginTop:5,}}
                        maximumValue={100}
                        minimumValue={0}
                        minimumTrackTintColor="#307ecc"
                        maximumTrackTintColor="#000000"
                        step={1} 
                        value={this.state.threshold}
                        onValueChange={(sliderValue) => this.setState({ threshold : sliderValue })}
                    />

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
