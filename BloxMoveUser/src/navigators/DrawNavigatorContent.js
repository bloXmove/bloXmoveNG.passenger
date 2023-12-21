import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Profile from '@app/assets/image/icons/profile.svg';
import {History, Help, Logout, Home, Wallet} from '@app/assets/image/icons';
import {useSelector, useDispatch} from 'react-redux';
import deviceStorage from '../screens/utils/AuthDeviceStorage';
import {Button, COLORS, Text} from '@components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {setPaymentNumber} from '@app/src/screens/HomeScreens/redux/actions';

const DrawNavigatorContent = props => {
  const {menuItems, appConfig} = props;
  const {navigation} = props;
  const insets = useSafeAreaInsets();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorImg, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // TODO: remove
  const appStyles = props.appStyles;

  const currentUser = useSelector(state => state.auth.user);

  const logout = async () => {
    setLoading(true);
    await deviceStorage.setAccessToken('');
    await deviceStorage.setExpired('');
    await deviceStorage.setShouldShowOnboardingFlow('false');
    dispatch(setPaymentNumber({data: 0}));
    setIsModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoginStack',
          params: {appConfig: appConfig},
        },
      ],
    });
    setLoading(false);
  };

  const renderIcon = data => {
    const {title} = data;

    switch (title) {
      case 'Home':
        return <Home style={styles.icon} />;
      case 'Wallet':
        return <Wallet style={styles.icon} />;
      case 'Ride History':
        return <History style={styles.icon} />;
      case 'Support':
        return <Help style={styles.icon} />;
    }
  };

  const mappingMenuItems = menuItems.map((menuItem, index) => (
    <TouchableOpacity
      key={index}
      style={styles.button}
      onPress={() => {
        navigation.navigate(menuItem.navigationPath, {
          appStyles: appStyles,
          appConfig: appConfig,
        });
      }}>
      {renderIcon(menuItem)}
      <Text textStyle="body14SemiBold" style={styles.title}>
        {menuItem.title}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <>
      <View
        style={[
          styles.container,
          {paddingTop: insets.top, paddingBottom: insets.bottom},
        ]}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.header}>
          {/* <Profile style={styles.icon} /> */}
          {currentUser.avatar !== '' ? (
            <FastImage
              style={styles.profileImg}
              source={{
                uri: currentUser.avatar,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.normal,
              }}
              collapsable={false}
              resizeMode={FastImage.resizeMode.contain}
              onError={() => setError(true)}
            />
          ) : (
            <Profile style={styles.profileImg} />
          )}
          <View style={styles.profile}>
            <Text textStyle="body18Medium" numberOfLines={1}>
              {currentUser?.username}
            </Text>
            <Button
              onPress={() =>
                navigation.navigate('Profile', {
                  appStyles: appStyles,
                })
              }
              textStyle="body14SemiBold"
              type="link"
              title="View Profile"
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.contentWrapper}>
          <View>{mappingMenuItems}</View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsModalVisible(true)}>
            <Logout style={styles.icon} />
            <Text textStyle="body14SemiBold" style={styles.title}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        swipeDirection={['down']}
        onSwipeComplete={() => setIsModalVisible(false)}
        style={styles.modal}
        isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.centered} textStyle="body18Semibold">
            You appear to be logging out
          </Text>
          <Text style={[styles.centered, styles.description]}>
            Are you sure you want to log out? Logging out means you lose any
            locally saved data.
          </Text>
          <Button
            type="primaryWarning"
            disabled={loading}
            containerStyle={loading ? styles.btnDisabled : ''}
            title="Yes, Log Out"
            onPress={logout}
          />
          <Button
            containerStyle={[
              styles.buttonMargin,
              {backgroundColor: COLORS.disabled},
            ]}
            textStyle={{color: COLORS.black}}
            title="Cancel"
            onPress={() => setIsModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    marginRight: 16,
    width: 56,
    height: 56,
    borderRadius: 80,
  },
  title: {
    marginLeft: 10,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.form,
  },
  contentWrapper: {
    padding: 32,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 8,
    paddingVertical: 8,
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
  centered: {
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    color: COLORS.body,
  },
  buttonMargin: {
    marginTop: 8,
  },
  profile: {
    flexShrink: 1,
  },
});

export default DrawNavigatorContent;
