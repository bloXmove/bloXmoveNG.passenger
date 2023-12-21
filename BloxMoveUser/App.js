import './global.js';
import './shim.js';
import 'react-native-get-random-values'
import '@ethersproject/shims'

import React, {useEffect, useState} from 'react';
import {Appearance, Platform, SafeAreaView} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import AppNavigator from './src/navigators/AppNavigation';
import AppReducer from './src/reducers';
import {LogBox} from 'react-native';
import {WalletConnectModal} from '@walletconnect/modal-react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  projectId,
  providerMetadata,
  sessionParams,
} from '@app/src/lib/wcConfig';

const store = createStore(AppReducer, applyMiddleware(thunk));

export default function App() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      console.log(token);
    }
  }
  const showNotification = notification => {
    PushNotification.localNotification({
      channelId: 'bloxMove_notification_channel',
      title: notification?.title,
      message: notification?.body,
    });
  };
  useEffect(() => {
    requestUserPermission();
    Appearance.addChangeListener(({color}) => {
      setColorScheme(color);
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showNotification(remoteMessage.notification);
    });

    return unsubscribe;
  });
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator colorScheme={colorScheme} />
        <WalletConnectModal
          projectId={projectId}
          providerMetadata={providerMetadata}
          sessionParams={sessionParams}
          themeMode="light"
        />
      </SafeAreaProvider>
    </Provider>
  );
}
