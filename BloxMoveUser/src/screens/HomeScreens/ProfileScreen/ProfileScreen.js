import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {useSelector, connect} from 'react-redux';
import {getUser, updateUserToken, deleteAccount} from '../utils/api/users';
import {displayErrors} from '../../../helpers';
import {TNActivityIndicator, Text, Button, COLORS} from '@components';
import Profile from '@app/assets/image/icons/profile.svg';
import ProfileEdit from './ProfileEdit';
import FastImage from 'react-native-fast-image';
import authDeviceStorage from '@app/src/screens/utils/AuthDeviceStorage';
import {getPhrase} from '@app/src/lib/LocalWallet';
import Clipboard from '@react-native-clipboard/clipboard';

const ProfileScreen = props => {
  const {route, navigation} = props;
  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;
  const apiToken = useSelector(state => state.auth.token);

  const userData = useSelector(state => state.auth.user);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const accountId = useSelector(state => state.auth.accountId);

  const [isLoading, setLoading] = useState(false);
  const [loading, setBtnLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [phraseModalVisible, setPhraseModalVisible] = useState(false);
  const [phrase, setPhrase] = useState('');

  const deleteAccountAction = async () => {
    deleteAccount(apiToken)
      .then(async response => {
        await authDeviceStorage.setShouldShowOnboardingFlow('false');
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'LoginStack',
              params: {appStyles: appStyles, appConfig: appConfig},
            },
          ],
        });
        setDeleteModalVisible(false);
      })
      .catch(error => {
        displayErrors(error);
      });
  };

  const showRecovery = async () => {
    setBtnLoading(true);

    const userPhrase = await getPhrase();

    if (userPhrase) {
      setPhrase(userPhrase);
      setBtnLoading(false);
      setPhraseModalVisible(true);
      return;
    }
    setBtnLoading(false);
  };

  const vibratePhone = () => {
    try {
      Vibration.vibrate(Platform.OS === 'android' ? 100 : [100]);
    } catch {}
  };

  if (isLoading) {
    return <TNActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.header, styles.row]}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrowleft" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Profile</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditVisible(true)}>
            <Icon name="edit" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileImageContainer}>
          {userData.avatar === '' ? (
            <Profile />
          ) : (
            <FastImage
              style={styles.profileImage}
              source={{
                uri: userData.avatar,
                cache: FastImage.cacheControl.web,
                priority: FastImage.priority.normal,
              }}
              collapsable={false}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
          <Text textStyle="body18Semibold" style={styles.name}>
            {userData?.username}
          </Text>
          {userData.referralCode && userData.referralCode !== '' && (
            <Text textStyle="body18Semibold" style={styles.referralBy}>
              Referral code - {userData?.referralCode}
            </Text>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <Text style={styles.sectionTitle} textStyle="body14SemiBold">
            Personal Info
          </Text>
          <Text textStyle="body10Regular" style={styles.greyColor}>
            Email
          </Text>
          <Text style={styles.userData} textStyle="body18Regular">
            {userData?.email ?? ''}
          </Text>
          <Text textStyle="body10Regular" style={styles.greyColor}>
            Name
          </Text>
          <Text style={styles.userData} textStyle="body18Regular">
            {userData?.username ?? ''}
            {/* {userData?.firstName ?? ''} */}
          </Text>
          {/* <Text textStyle="body10Regular">Last name</Text>
          <Text style={styles.userData} textStyle="body18Regular">
            {userData?.lastName ?? ''}
          </Text> */}
          <Text textStyle="body10Regular" style={styles.greyColor}>
            Phone number
          </Text>
          <Text style={styles.userData} textStyle="body18Regular">
            {userData?.phoneNumber ?? ''}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <Text style={styles.sectionTitle} textStyle="body14SemiBold">
            Wallet information
          </Text>
          <Text textStyle="body10Regular" style={styles.greyColor}>
            Wallet address
          </Text>
          <TouchableOpacity
            onPress={() => {
              try {
                Clipboard.setString(accountId);
                vibratePhone();
              } catch (e) {
                console.log(e);
              }
            }}>
            <Text style={styles.userData} textStyle="body14Regular">
              {accountId &&
                accountId.substring(0, 8) + '...' + accountId.substring(30)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flexContainer}
            onPress={() => showRecovery()}>
            <Text style={styles.userData} textStyle="body14Regular">
              Recovery Phrase
            </Text>
            <Icon name="right" size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => {
            setDeleteModalVisible(true);
          }}
          style={styles.button}>
          <Icon
            style={styles.backButton}
            name="delete"
            size={25}
            color={'#F4574D'}
          />
          <Text style={{color: COLORS.error}} textStyle="body18Regular">
            Delete Account
          </Text>
        </TouchableOpacity>
        <Modal
          onSwipeComplete={() => setDeleteModalVisible(false)}
          avoidKeyboard={true}
          style={styles.modal}
          isVisible={deleteModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.centered} textStyle="body18Semibold">
              Delete Account?
            </Text>
            <Text
              textStyle="body14Regular"
              style={[styles.description, styles.centered]}>
              After confirming, your account will be deleted from our system and
              all funds in NFTicket will be lost.
            </Text>
            <Button
              type="primaryWarning"
              title="Yes, Delete Account"
              onPress={deleteAccountAction}
              containerStyle={styles.buttonMargin}
            />
            <Button
              type="outlined"
              containerStyle={{backgroundColor: COLORS.disabled}}
              textStyle={{color: COLORS.black}}
              title="No"
              onPress={() => setDeleteModalVisible(false)}
            />
          </View>
        </Modal>

        <Modal
          onSwipeComplete={() => setPhraseModalVisible(false)}
          avoidKeyboard={true}
          style={styles.modal}
          isVisible={phraseModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.centered} textStyle="body18Semibold">
              Recovery Phrase
            </Text>
            <TouchableOpacity
              onPress={() => {
                try {
                  Clipboard.setString(phrase);
                  vibratePhone();
                } catch (e) {
                  console.log(e);
                }
              }}>
              <Text textStyle="body18Regular" style={styles.recoveryContainer}>
                {phrase}
              </Text>
            </TouchableOpacity>
            <Button
              type="outlined"
              containerStyle={{backgroundColor: COLORS.form}}
              textStyle={{color: COLORS.black}}
              title="Close"
              disabled={loading}
              onPress={() => setPhraseModalVisible(false)}
            />
          </View>
        </Modal>
        {isEditVisible && (
          <ProfileEdit
            isEditVisible={isEditVisible}
            setIsEditVisible={setIsEditVisible}
          />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    backgroundColor: COLORS.white,
  },
  inner: {
    paddingTop: 20,
    backgroundColor: COLORS.white,

    flexGrow: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.form,
    borderRadius: 40,
  },
  name: {
    marginTop: 8,
  },
  referralBy: {
    marginTop: 8,
    color: COLORS.body,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 16,
    padding: 32,
    paddingTop: 0,
  },
  content: {
    paddingHorizontal: 32,
  },
  backButton: {
    marginRight: 24,
    padding: 8,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.form,
  },
  userData: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 32,
    paddingVertical: 16,
  },

  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  description: {
    color: COLORS.body,

    marginVertical: 24,
  },
  centered: {
    textAlign: 'center',
  },
  buttonMargin: {
    marginBottom: 8,
  },
  editButton: {
    padding: 8,
  },
  greyColor: {
    color: COLORS.body,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recoveryContainer: {
    color: COLORS.black,
    marginVertical: 24,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.disabled,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
});

const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
  };
};

export default connect(mapStateToProps, {
  getUser,
  updateUserToken,
})(ProfileScreen);
