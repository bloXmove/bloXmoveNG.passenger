import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {
  GrantScreen,
  LoginScreen,
  WelcomeScreen,
  Walkthrough,
  RecoveryScreen,
} from '../screens/Onboarding';
import {COLORS} from '@components';
import {ErrorScreen} from '@app/src/screens/HomeScreens';
// import {WelcomeScreen as NogLogin} from '../screens/NonConnectedScreens';

const Stack = createStackNavigator();

const LoginStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      cardStyle: {backgroundColor: COLORS.white},
      header: () => null,
    }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    {/* <Stack.Screen name="NonLogin" component={NogLogin} /> */}
    <Stack.Screen name="Walkthrough" component={Walkthrough} />
    <Stack.Screen name="Grant" component={GrantScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Recovery" component={RecoveryScreen} />
    <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
  </Stack.Navigator>
);

export default LoginStack;
