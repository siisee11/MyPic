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
import unpack from 'ndarray-unpack'
import crows from 'ndarray-concat-rows'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        /*
        props : {
            uid : user id
            tour_info : tour information
            mypic_ref: reference to 'User/Mytour/<Tourname>'
            tour_refs : reference to 'Tour/<Tourname>'
        }
        */

        this.state={
            tour: this.props.tour_info, // copy from props for easy use
            my_images : [],             // images above threshold (resized images)
            my_origin_images: [],       // images above threshold (original images)
            uris : [],                  // uri for download images (Unused)
            fontLoaded: false,
            threshold: 0.45,            // initial threshold is cos(1.1) = 0.45
            file_names: [],
            landscape_file_names: [],   // file names for landscape images
            profile_embeddings: [],
            profile_embeddings_ndarray: null,
            tour_images_embeddings: [],
            tour_images_embeddings_ndarray: [],
        };
    }

    componentDidMount = async () => {
        /* load font */
        await Font.loadAsync({
            'Gaegu-Regular': require('../../assets/fonts/Gaegu/Gaegu-Regular.ttf'),
            'EastSeaDokdo-Regular': require('../../assets/fonts/East_Sea_Dokdo/EastSeaDokdo-Regular.ttf'),
            'Nanum_pen_Script-Regular': require('../../assets/fonts/Nanum_Pen_Script/NanumPenScript-Regular.ttf'),
            'Yeon_Sung-Regular': require('../../assets/fonts/Yeon_Sung/YeonSung-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });

        /* get user embeddings */
         await firebase.firestore().collection("User")
        .doc(this.props.uid)
        .collection("Embedding")
        .get().then( (querySnapshot) => {
//        .onSnapshot( (querySnapshot) => {
            querySnapshot.forEach( (doc) => {
                let doc_data = doc.data();
                let image_embeddings = new Array(); 
                for (var key in doc_data){
                    value = doc_data[key]
                    image_embeddings.push(value)
                }
                
                let append_profile_embeddings = this.state.profile_embeddings.concat(image_embeddings)
                this.setState({
                    profile_embeddings: append_profile_embeddings,
                })
            })

            let profile_embeddings_to_array = this.state.profile_embeddings;
            if (profile_embeddings_to_array.length == 1) {
                profile_embeddings_to_array = profile_embeddings_to_array.push(profile_embeddings_to_array[0]);
            }
            let profile_embeddings_to_ndarray = pack(profile_embeddings_to_array);
            this.setState({
                profile_embeddings_ndarray: profile_embeddings_to_ndarray,
            });

        }).catch(error => console.log(error));

        /* get tour embeddings */
        this.props.tour_ref
            .collection("Embedding")
            .onSnapshot( async (querySnapshot) => {
                querySnapshot.forEach( async (doc) => {
                    let doc_data = doc.data();
                    let doc_id = doc.id;

                    console.log("[Start] file => ", doc_id);

                    let image_embeddings = new Array(); 
                    for (var key in doc_data){
                        value = doc_data[key]
                        image_embeddings.push(value)
                    }
                    
                    /* photo with only one face would fail, so just duplicate it */
                    if (image_embeddings.length == 1) {
                        image_embeddings.push(image_embeddings[0]);
                    }

                    /* if there is at least one face */
                    if (image_embeddings.length > 0) {
                        let append_image_ndarray = {
                            "name" : doc_id,
                            "ndarray" : pack(image_embeddings),
                        }
                        this.setState({
                            tour_images_embeddings_ndarray: append_image_ndarray,
                        })
                        await this.add_to_my_images(doc_id, pack(image_embeddings))
                    } else {
                        /* This might be landscape photo */
                        console.log("landscape image");
                        let append_landscape_file_names = this.state.landscape_file_names.concat(doc_id);
                        this.setState({
                            landscape_file_names : append_landscape_file_names,
                        })
                    }
                    console.log(this.state.my_images.length);
                    console.log("[End] file => ", doc_id);
                })

            })

        console.log("[-----------ComponentDidMount------------]")
    };

    goBack() {
        Actions.pop()
    }

    async add_to_my_images(file_name, tour_embedding_ndarray) {
        let profile_embeddings_ndarray = this.state.profile_embeddings_ndarray;
        let distances = ndarray(new Float32Array([0.01]), [1,1])
        if (tour_embedding_ndarray.shape[0] != 0){
            distances = this.get_angular_distances(tour_embedding_ndarray, profile_embeddings_ndarray);
        }
        let argmax = ops.argmax(distances);
        let max = distances.get(argmax[0], argmax[1]);
        if (max > this.state.threshold) {
            urls = await this.getImageURLs(file_name)
            let my_image = {
                name : file_name,
                urls : urls,
                distance : max,
            };
            this.setState({
                my_images : [...this.state.my_images, my_image],
            });
            console.log(my_image)
            console.log("added")
        }
    }

    update_my_images() {
        this.setState({
            my_images: [],
            my_origin_images: [],
        }, async () => {
            let profile_embeddings_ndarray = this.state.profile_embeddings_ndarray;
            for (var i = 0; i < this.state.tour_images_embeddings_ndarray.length; i++) {
                let distances = ndarray(new Float32Array([0.01]), [1,1])
                if (this.state.tour_images_embeddings_ndarray[i].shape[0] != 0){
                    distances = this.get_angular_distances(this.state.tour_images_embeddings_ndarray[i], profile_embeddings_ndarray);
                }
                let argmax = ops.argmax(distances);
                let max = distances.get(argmax[0], argmax[1]);
                if (max > this.state.threshold) {
                    this.getImage(this.state.file_names[i])
                    console.log("added")
                }

                if (max > 0.65 && profile_embeddings_ndarray.shape[0] < 6 && global.ReuseFace) { 
                    // this probably my face so reuse it as profile embeddings.
                    let unpacked_tour_embeddings = unpack(this.state.tour_images_embeddings_ndarray[i]);
                    let expected_my_embedding = unpacked_tour_embeddings[argmax[0]];
                    let unpacked_profile_embeddings = unpack(profile_embeddings_ndarray);
                    unpacked_profile_embeddings.push(expected_my_embedding);
                    profile_embeddings_ndarray = pack(unpacked_profile_embeddings);
                }
            }
        })
    }

    get_angular_distances(embs1, embs2) {
//        console.log(embs1.shape[0], embs1.shape[1], embs2.shape[0], embs2.shape[1])
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
            this.state.my_images.map(async (img) => {
                let img_uri = img.urls.original;
                let img_name = img.name;

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

    /* get URL by file name and add it to my_images array */
    getImageURLs = async (image) => {
        var urls = {
            resized : null,
            original : null,
        }

		var imagebyte = image.split('.');
		var thumbimg = '/thumbnails/' + imagebyte[0] + "_200x200." + imagebyte[1];
        
        // get thumbnail of image url
        const ref = firebase.storage().ref().child("tour_images/" + this.state.tour.tour_id + thumbimg );
        await ref.getDownloadURL().then( (url) => {
            urls.resized = url;
        }).catch( (error) => {
            urls.resized = "no";
            console.log('cannot get ', thumbimg, ' from firebase');
        });

        // get original image url
        const ref_origin = firebase.storage().ref().child("tour_images/" + this.state.tour.tour_id + '/' + image);
        await ref_origin.getDownloadURL().then( (url) => {
            urls.original = url;
        }).catch( (error) => {
            console.log(error)
            console.log('cannot get image from firebase');
        });

        return urls;
    };

    renderGridImages() {
        return this.state.my_images.map((image, index) => {
            let image_url = image.urls.resized;
            if (image_url == 'no') {
                image_url = image.urls.original;
            }
            return (
                <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                    <Image style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined,
                    }}
                           source={{ uri: image_url}}>
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

                    <View style={{ flexDirection:'row', justifyContent:'center'}}>
                        <Text>
                            { Math.round(this.state.threshold*100)/100 }
                        </Text>
                        <Slider 
                            style={{width : width * 2 / 3, marginTop:5,}}
                            maximumValue={1}
                            minimumValue={0.15}
                            minimumTrackTintColor="#307ecc"
                            maximumTrackTintColor="#000000"
                            step={0.05} 
                            value={this.state.threshold}
                            onValueChange={(sliderValue)=>{
								this.setState({threshold : sliderValue, })
							    }
							}
                            onSlidingComplete={(sliderValue) => {
                                this.setState({ threshold : sliderValue, })
                                this.update_my_images()
								}
                            }
                        />
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