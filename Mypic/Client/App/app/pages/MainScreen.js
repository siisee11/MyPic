import React, { Component } from 'react';
import { StyleSheet, Platform, View, Text } from 'react-native';
import { Icon } from 'native-base';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import HomeTab from '../AppTabNavigator/HomeTab'
import SearchTab from '../AppTabNavigator/SearchTab'
import AddMediaTab from '../AppTabNavigator/AddMediaTab'
import LikesTab from '../AppTabNavigator/LikesTab'
import ProfileTab from '../AppTabNavigator/ProfileTab'
import IconWithBadge from '../AppTabNavigator/IconWithBadge'

const HomeIconWithBadge = props => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithBadge {...props} badgeCount={3} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = Ionicons;
    let iconName;
    if (routeName === 'Home') {
        iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        // We want to add badges to home tab icon
        IconComponent = HomeIconWithBadge;
    } else if (routeName === 'Settings') {
        iconName = `ios-options${focused ? '' : '-outline'}`;
    }

    // You can return any component that you like here!
    return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const AppTabNavigator = createMaterialTopTabNavigator({
    HomeTab: { screen: HomeTab},
    SearchTab: { screen: SearchTab },
    AddMediaTab: { screen: AddMediaTab },
    LikesTab: { screen: LikesTab },
    ProfileTab: { screen: ProfileTab }
}, {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
        style: {
            ...Platform.select({
                ios: {
                    backgroundColor: 'white',
                },
                android: {
                    backgroundColor: 'white',
                }
            })
        },
        iconStyle: {height: 100},
        activeTintColor: '#000',
        inactiveTintColor: '#d1cece',
        upperCaseLabel: false,
        showLabel: false,
        showIcon: true,
    }
});

//const AppTabContainet = createAppContainer(AppTabNavigator);
const AppTabContainet = createAppContainer(
    createBottomTabNavigator(
        {
            Home: { screen: HomeTab},
            Setting: { screen: HomeTab},
        },
        {
            defaultNavigationOptions: ({navigation }) => ({
                tabBarIcon: ({ focused, tintColor}) =>
                    getTabBarIcon(navigation, focused, tintColor),
            }),
            tabBarOptions: {
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            },
        }
    )
);

export default class MainScreen extends Component {

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