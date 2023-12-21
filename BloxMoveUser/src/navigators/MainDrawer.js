import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawNavigatorContent from './DrawNavigatorContent';
import DynamicAppStyles from '../AppStyles';
import SocialNetworkConfig from '../WalkthroughAppConfig';
import {
  HomeScreen,
  ProfileScreen,
  WalletScreen,
  BookedHailScreen,
  BookedIntScreen,
  HelpScreen,
  MyRidesScreen,
  NewRequestScreen,
  ContactScreen,
  ErrorScreen,
} from '../screens/HomeScreens';
import ManageNotification from '@app/src/helpers/ManageNotification';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  ManageNotification();
  return (
    <Drawer.Navigator
      drawerContent={({navigation}) => (
        <DrawNavigatorContent
          navigation={navigation}
          //TODO: remove
          appStyles={DynamicAppStyles}
          menuItems={SocialNetworkConfig.drawerMenu.upperMenu}
          appConfig={SocialNetworkConfig}
        />
      )}
      screenOptions={{header: () => null}}>
      <Drawer.Screen
        name="Home"
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: SocialNetworkConfig,
        }}
        component={HomeScreen}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Wallet" component={WalletScreen} />
      <Drawer.Screen
        name="MyRides"
        component={MyRidesScreen}
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: SocialNetworkConfig,
        }}
      />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="BookHail" component={BookedHailScreen} />
      <Drawer.Screen name="BookInt" component={BookedIntScreen} />
      <Drawer.Screen name="NewRequest" component={NewRequestScreen} />
      <Drawer.Screen name="ErrorScreen" component={ErrorScreen} />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
