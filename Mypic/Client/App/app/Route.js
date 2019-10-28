import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Signup from './pages/signup';
import MusicApp from './pages/login';
import MainPage from './pages/mainpage'
import Loading from './pages/Loading'
import AddTour from './pages/addTour'

export default class Route extends Component {
    render() {
        return (
            <Router hideNavBar={true}
            >
                <Stack key="root">
                    <Scene key="loading" component={Loading} hideNavBar={true} animation='fade' initial={true}/>
                    <Scene key="login" component={MusicApp} hideNavBar={true}
                    animation='fade' />
                    <Scene key="signup" component={Signup} title="Sign up" hideNavBar={false}
                    animation='fade' />
                    <Scene key="addtour" component={AddTour} title="Create tour" hideNavBar={true}
                           animation='fade' />
                    <Scene key="mainpage" component={MainPage} hideNavBar={true} animation='fade' />
                </Stack>
            </Router>
        )
    }
}

const styles = {
    barButtonIconStyle: {
        tintColor: 'white'
    }
};