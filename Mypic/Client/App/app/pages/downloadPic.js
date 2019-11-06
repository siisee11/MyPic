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

var { height, width } = Dimensions.get('window');

export default class DownloadPic extends Component {
    constructor(props){
        super(props);
        this.state={
            tour: null,
        };
    }

    componentDidMount = async () => {
      this.props.tour.get()
      .then(res => {
        let data = res.data();
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
                <Text style={{...styles.textInput, marginTop:20, fontSize: 25, fontWeight: "bold"}}>
                           {
                             this.state.tour ?
                             this.state.tour.tour_name : null
                           }
                </Text>

                <Text style={{...styles.textInput, fontSize:15, }}>
                           {
                             this.state.tour ?
                             this.state.tour.tour_startedAt.toDate().toDateString() : null
                           }
                </Text>

                <Text style={{...styles.textInput, fontSize: 15,}}>
                    {
                        this.state.tour ?
                            this.state.tour.tour_description: null
                    }
                </Text>

                <View style={{ flex: 1, }}>
                    {this.state.tour ? this.renderSection() : null }
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
