/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onRegister: function (token) {},
  onNotification: function (notification) {},
  senderID: '764979507476',
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.createChannel(
  {
    channelId: 'bloxMove_notification_channel',
    channelName: 'Channel',
  },
  created => {},
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
