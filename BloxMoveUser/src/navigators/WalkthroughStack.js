import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DynamicAppStyles from '../AppStyles';
import SocialNetworkConfig from '../WalkthroughAppConfig';

import {Walkthrough} from '../screens/Onboarding';

const Stack = createStackNavigator();

const WalkthroughStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="Welcome"
      initialParams={{
        appStyles: DynamicAppStyles,
        appConfig: SocialNetworkConfig,
      }}
      component={Walkthrough}
    />
  </Stack.Navigator>
);

export default WalkthroughStack;
