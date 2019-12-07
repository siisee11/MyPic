import React, { Component } from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {createMaterialTopTabNavigator, createBottomTabNavigator} from "react-navigation-tabs";
import {createAppContainer} from "react-navigation";
import { Ionicons } from '@expo/vector-icons';

import HomeTab from "../AppTabNavigator/HomeTab";
import ProfileTab from "../AppTabNavigator/ProfileTab";
import SettingTab from "../AppTabNavigator/SettingTab";
import MapTab from "../AppTabNavigator/MapTab";
import IconWithBadge from '../AppTabNavigator/IconWithBadge'

const HomeIconWithBadge = props => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithBadge {...props} badgeCount={0} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = Ionicons;
    let iconName;
    if (routeName === 'Home') {
        iconName = 'ios-home';
        // We want to add badges to home tab icon
        IconComponent = HomeIconWithBadge;
    } else if (routeName === 'Setting') {
        iconName = 'ios-options';
    } else if (routeName === 'Profile') {
        iconName = 'ios-person';
    } else if (routeName === 'Map') {
        iconName = 'ios-compass';
    }

    // You can return any component that you like here!
    return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const AppTabContainet = createAppContainer(
    createBottomTabNavigator(
        {
            Home: { screen: HomeTab},
            Profile: { screen: ProfileTab},
            Map: {screen: MapTab},
            Setting: { screen: SettingTab},
        },
        {
            defaultNavigationOptions: ({navigation }) => ({
                tabBarIcon: ({ focused, tintColor}) =>
                    getTabBarIcon(navigation, focused, tintColor),
            }),
            tabBarOptions: {
                activeTintColor: '#12799f',
                inactiveTintColor: '#d1cece',
            },
        }
    )
);

export default class MainPage extends Component {

    static navigationOptions = {
        header: null
    };

    render() {
        return <AppTabContainet/>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});