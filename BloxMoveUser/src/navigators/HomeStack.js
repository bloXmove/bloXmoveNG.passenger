import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DynamicAppStyles from '../AppStyles';
import SocialNetworkConfig from '../WalkthroughAppConfig';

import MainDrawer from './MainDrawer';
import Svgs from '../../assets/svg/svgs';

import {
  HomeScreen,
  DetailTripScreen,
  DetailTripIntScreen,
  ListIntScreen,
  TransactionScreen,
  CompletedScreen,
  ReviewTripScreen,
  ContactScreen,
  DetailHelpScreen,
  CancelRideScreen,
  TopUp,
  OperationState,
  ChangeBankScreen,
  ErrorScreen,
  InterstateBookingScreen,
} from '../screens/HomeScreens';
import WithdrawScreen from '../screens/HomeScreens/WalletScreen/WithdrawScreen/WithdrawScreen';
import AboutScreen from '../screens/HomeScreens/HelpScreen/AboutScreen';
import {ComingSoon} from '../screens/HomeScreens/ComingSoon/ComingSoon';
import ManageNotification from '@app/src/helpers/ManageNotification';

const Stack = createStackNavigator();

const HomeStack = () => {
  ManageNotification();
  return (
    <Stack.Navigator
      initialRouteName="NavStack"
      screenOptions={({navigation}) => ({
        headerTitle: () => {
          return <Svgs.Logo width="50" height="50" />;
        },
        headerRight: () => (
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() =>
              navigation.navigate('DetailHelp', {
                appStyles: DynamicAppStyles,
                appConfig: SocialNetworkConfig,
              })
            }>
            <Icon name="help-circle-outline" size={30} color={'black'} />
          </TouchableOpacity>
        ),
        headerStyle: {},
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      })}>
      <Stack.Screen
        name="NavStack"
        options={{headerShown: false}}
        component={MainDrawer}
      />
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: SocialNetworkConfig,
        }}
        name="Home"
        component={HomeScreen}
        options={{header: () => null}}
      />
      <Stack.Screen name="Trip" component={DetailTripScreen} />
      <Stack.Screen name="ListInt" component={ListIntScreen} />
      <Stack.Screen name="TripInt" component={DetailTripIntScreen} />
      <Stack.Screen
        name="Interstate"
        component={InterstateBookingScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Completed"
        component={CompletedScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Review"
        component={ReviewTripScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoon}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="ChangeBank"
        component={ChangeBankScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="TopUp"
        component={TopUp}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="OperationState"
        component={OperationState}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="ErrorScreen"
        component={ErrorScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="DetailHelp"
        component={DetailHelpScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="CancelRide"
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: SocialNetworkConfig,
        }}
        component={CancelRideScreen}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
