import React, {useEffect, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {Button, LoginActivityIndicator} from '@components';
import dynamicStyles from './styles';
import FastImage from 'react-native-fast-image';
import {useWalletConnectModal} from '@walletconnect/modal-react-native';
import {useDispatch} from 'react-redux';
import deviceStorage from '../../utils/AuthDeviceStorage';
import {
  getNFTDataAddress,
  getUserInfo,
  loginActions,
} from '../../utils/api/actions';
import {createSinger, getLocalSigner} from '@app/src/lib/WalletFacade';

const WelcomeScreen = props => {
  const {navigation} = props;

  const styles = dynamicStyles();
  const dispatch = useDispatch();
  const {isConnected, address} = useWalletConnectModal();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    tryLoginFirst();
  }, []);

  const tryLoginFirst = async () => {
    await getNFTDataAddress();
    // await getLocalSigner();
    const localWallet = await deviceStorage.getAccountNumber();
    const accessToken = await deviceStorage.getAccessToken();
    const expiredAt = await deviceStorage.getExpired();
    const shouldShowOnboardingFlow =
      await deviceStorage.getShouldShowOnboardingFlow();
    // Local Wallet
    if (shouldShowOnboardingFlow && localWallet !== '') {
      const userInfo = await getUserInfo(accessToken);
      if (userInfo.success === true) {
        loginAction(localWallet, accessToken);
      } else {
        setLoading(false);
      }
      return;
    }
    if (isConnected && typeof localWallet === 'string' && accessToken !== '') {
      const accountId = address;
      if (localWallet.toUpperCase() !== accountId.toUpperCase()) {
        setLoading(false);
        return;
      }
      if (accessToken !== '' && expiredAt > Math.round(Date.now() / 1000)) {
        const userInfo = await getUserInfo(accessToken);
        if (userInfo.success === true) {
          loginAction(accountId, accessToken);
        } else {
          setLoading(false);
        }
        return;
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const loginAction = async (accountId, token) => {
    await dispatch(loginActions(token, accountId));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeStack',
        },
      ],
    });
  };
  const signIn = async () => {
    const local = await getLocalSigner();
    if (local.exist) {
      try {
        const signer = local.signer;
        navigation.navigate('LoginStack', {
          screen: 'Grant',
          params: {
            accountId: signer.address,
            exist: true,
          },
        });
      } catch {
        gotoRecovery();
      }
    } else {
      gotoRecovery();
    }
  };
  const gotoRecovery = () => {
    navigation.navigate('Recovery');
  };
  const signUp = async () => {
    setBtnLoading(true);
    try {
      const signer = await createSinger();
      if (signer !== false) {
        navigation.navigate('Grant', {
          accountId: signer.address,
          exist: false,
        });
        setBtnLoading(false);
      } else {
        setBtnLoading(false);
      }
    } catch (e) {
      setBtnLoading(false);
    }
  };
  if (loading) {
    return <LoginActivityIndicator />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <FastImage
          style={styles.image}
          source={require('@app/assets/image/icons/logo_small.png')}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.centerContainer}>
          <Button
            containerStyle={styles.button}
            type="primary"
            onPress={signIn}
            title="Sign In"
            disabled={btnLoading}
          />
          <Button
            containerStyle={styles.button}
            type="primary"
            onPress={signUp}
            title="Sign Up"
            disabled={btnLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
