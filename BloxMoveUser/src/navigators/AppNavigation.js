import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import HomeStack from './HomeStack';
import LoginStack from './LoginStack';
import {LoadScreen} from '../screens/Onboarding';
import DynamicAppStyles from '../AppStyles';
import SocialNetworkConfig from '../WalkthroughAppConfig';
import WalkthroughStack from './WalkthroughStack';

const Stack = createStackNavigator();

const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoadScreen"
    screenOptions={{headerShown: false}}>
    <Stack.Screen
      name="LoadScreen"
      initialParams={{
        appStyles: DynamicAppStyles,
        appConfig: SocialNetworkConfig,
      }}
      component={LoadScreen}
    />
    <Stack.Screen name="Walkthrough" component={WalkthroughStack} />
    <Stack.Screen name="LoginStack" component={LoginStack} />
    <Stack.Screen name="HomeStack" component={HomeStack} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
