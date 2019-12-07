import React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';
import * as Font from "expo-font";
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import MyHeader from '../components/MyHeader'

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT= Dimensions.get('window').height;

let id = 0;

let mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]

function randomColor() {
    return "hsl(" + 360 * Math.random() + ',' +
                (25 + 70 * Math.random()) + '%,' + 
                (85 + 10 * Math.random()) + '%)'
}

export default class SearchTab extends Component {
    state = {
        fontLoaded: false,
        tour_infos: [],
        markers: [],
    };

    async componentDidMount() {
//        await this.getUserInfo();

        firebase.firestore()
            .collection("Tour")
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach( (doc) => {
                    let data = doc.data();

                    this.setState({
                        markers: [
                          ...this.state.markers,
                          {
                            coordinate: {
                                latitude: data.region.latitude,
                                longitude: data.region.longitude,
                            },
                            key: id++,
                            color: randomColor(),
                            title: data.tourName,
                          },
                        ],
                      });
                })
            })


        await Font.loadAsync({
            'Dancing_Script-Bold': require('../../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }


    getUserInfo = () => {
        let user = firebase.auth().currentUser;
        let name, email, photoUrl, uid;

        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            uid = user.uid;
        }

        this.setState({
            user: {
                name: name,
                email: email,
                photoURL: photoUrl,
                uid: uid,
            }
        })
    }

    render() {
        return (
            <Container style={style.container}>
                <MyHeader />

                <MapView 
                    style={{ flex: 1 }} 
                    initialRegion={{ 
                        latitude: 37.29563567877843, 
                        longitude: 126.97583061034902, 
                        latitudeDelta: 0.02022, 
                        longitudeDelta: 0.02381, 
                        }}
                    customMapStyle={mapStyle}
                >
                    {this.state.markers.map(marker => (
                        <Marker
                        key={marker.key}
                        coordinate={marker.coordinate}
                        pinColor={marker.color}
                        title={marker.title}
                        />
                    ))}
                </MapView>

            </Container>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    textOverImage: {
        fontSize: 32,
        color: 'white',
        marginLeft: 20
    },

});
