import React, { Component } from 'react';
import {StyleSheet, YellowBox, StatusBar} from 'react-native';

import {Asset} from 'expo-asset'
import {AppLoading} from "expo";
import firebase from 'firebase';
import * as Permissions from 'expo-permissions'
import {firebaseConfig} from './config'

YellowBox.ignoreWarnings(['Setting a timer']);
firebase.initializeApp(firebaseConfig);


import Route from './app/Route'

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

async function getPermissionsAsync() {
  // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
  const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === 'granted') {
      console.log("permission granted")
  } else {
    throw new Error('Location permission not granted');
  }
}

export default class App extends Component {
  constructor(){
    super();
    this.state={
      isReady : false
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    getPermissionsAsync();
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/images/sea.jpg'),
      require('./assets/images/sunrise.jpg'),
      require('./assets/images/hot-air-balloon.jpg'),
      require('./assets/images/maldives.jpg'),
    ]);
    await Promise.all([...imageAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
          <AppLoading
              startAsync={this._loadAssetsAsync}
              onFinish={() => this.setState({ isReady: true })}
              onError={console.warn}
          />
      );
    }
    return <Route />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
