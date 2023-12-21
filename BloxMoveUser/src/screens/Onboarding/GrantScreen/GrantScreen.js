import {Button, Text} from '@components';
import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import deviceStorage from '../../utils/AuthDeviceStorage';
import {
  getEmailStatus,
  getToken,
  loginActions,
  getVersions,
} from '../../utils/api/actions';
import {setUserData} from '../redux/index';
import svgs from '../../../../assets/svg/svgs';
import dynamicStyles from './styles';
import {getSignatureLogin} from '@app/src/screens/HomeScreens/utils/api/nft';
import {displayLoginErrors, displayErrors} from '@app/src/helpers';
import DeviceInfo from 'react-native-device-info';
import {SERVER_URL} from '@app/src/lib/config';
import FastImage from 'react-native-fast-image';
import {useWalletConnectModal} from '@walletconnect/modal-react-native';
import {setProvider} from '@app/src/lib/WalletFacade';
import {clearLocalWallet} from '@app/src/lib/LocalWallet';

const GrantScreen = props => {
  const {navigation, route} = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const styles = dynamicStyles();
  const {isConnected, provider} = useWalletConnectModal();

  const accountId = route.params.accountId;
  const exist = route.params.exist;

  const confirmAccess = async () => {
    setLoading(true);
    const checkUpgrade = await forceUpgrade();
    if (checkUpgrade.success !== true) {
      setLoading(false);
      return;
    }
    getEmailStatus(accountId)
      .then(async () => {
        const signatureResult = await getSignatureLogin(accountId);
        if (signatureResult.success !== true) {
          setLoading(false);
          return;
        } else {
          loginAction();
        }
      })
      .catch(async error => {
        const hanldeError = displayLoginErrors(error);
        if (hanldeError === 'loginAction') {
          if (exist) {
            await setProvider(null);
            await clearLocalWallet();
            Alert.alert(
              'Passenger not found',
              'Please register as a new passenger to proceed.',
            );
            setLoading(false);
            return;
          }
          redirectLogin();
        }
        if (hanldeError === 'noInternet') {
          navigation.navigate('ErrorScreen', {
            title: 'You’re offline',
            subTitle: 'No internet. Connect to wi-fi or cellular network. ',
            buttonTitle: 'Try again',
          });
        }
        setLoading(false);
      });
  };

  const forceUpgrade = async () => {
    // Check App version only if it's a prod version
    if (SERVER_URL !== 'https://ngraprod.bloxmove.ng/nigeria-backend/v1/') {
      return {
        success: true,
      };
    }
    let buildNumber = DeviceInfo.getBuildNumber();
    let version = DeviceInfo.getVersion();
    const currentVersion = version + '(' + buildNumber + ')';
    const versionNumbers = await getVersions();
    if (!versionNumbers.success) {
      const hanldeError = displayLoginErrors(versionNumbers.error);
      if (hanldeError === 'noInternet') {
        navigation.navigate('ErrorScreen', {
          title: 'You’re offline',
          subTitle: 'No internet. Connect to wi-fi or cellular network. ',
          buttonTitle: 'Try again',
        });
      }
      return {
        success: false,
      };
    }
    let serverVersion = '';
    let forceFlag = '';
    versionNumbers.data.map(item => {
      if (item.key === 'PSG_APP_FORCE_UP') {
        forceFlag = item.value;
      }
    });
    if (forceFlag === 'OFF') {
      return {
        success: true,
      };
    }
    if (Platform.OS === 'android') {
      versionNumbers.data.map(item => {
        if (item.key === 'PSG_APP_VER_ANDROID') {
          serverVersion = item.value;
        }
      });
    }
    if (Platform.OS === 'ios') {
      versionNumbers.data.map(item => {
        if (item.key === 'PSG_APP_VER_IOS') {
          serverVersion = item.value;
        }
      });
    }
    if (serverVersion !== currentVersion) {
      navigation.navigate('ErrorScreen', {
        title: 'New update',
        subTitle:
          'You are using the old app version. Update your app to continue.',
        buttonTitle: 'Update',
      });
      return {
        success: false,
      };
    } else {
      return {
        success: true,
      };
    }
  };
  const goBack = async () => {
    setLoading(true);
    if (isConnected) {
      try {
        await provider?.disconnect();
      } catch (e) {}
    }
    // setProvider(null);
    navigation.goBack();
    setLoading(false);
  };

  const redirectLogin = () => {
    navigation.navigate('Login', {
      accountId: accountId,
    });
  };

  const loginAction = async () => {
    const result = await getToken(accountId);
    if (result.success === true) {
      await deviceStorage.setAccountNumber(accountId);
      const token = result.data.token;
      await dispatch(loginActions(token, accountId));
      if (!isConnected) {
        await deviceStorage.setShouldShowOnboardingFlow('true');
      }
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
      });
      setLoading(false);
    } else {
      displayErrors(result.error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              disabled={loading}
              style={styles.btnToggle}
              onPress={() => goBack()}>
              <svgs.Back />
            </TouchableOpacity>
            <FastImage
              style={styles.image}
              source={require('@app/assets/image/icons/logo_small.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          {!exist && (
            <>
              <Text textStyle="body14SemiBold">New wallet created</Text>
              <Text style={styles.text}>
                A new and secure wallet will be created for your transactions.
                You can Access the wallet recovery phrase in the profile section
                for future access.
              </Text>
            </>
          )}
          {exist && (
            <>
              <Text style={styles.text}>
                bloXmove wants to secure connection with your Wallet.
              </Text>
              <Text textStyle="body14SemiBold">Wallet address</Text>
              <Text style={styles.text}>{accountId}</Text>
            </>
          )}
        </View>
        <Button
          onPress={confirmAccess}
          disabled={loading}
          containerStyle={styles.button}
          title="Proceed"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(null, {
  setUserData,
})(GrantScreen);
