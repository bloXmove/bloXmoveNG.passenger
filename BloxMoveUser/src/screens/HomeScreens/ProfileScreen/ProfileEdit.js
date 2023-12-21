import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Svgs from '../../../../assets/svg/svgs';
import {useSelector, useDispatch, connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {
  getUser,
  updateUserData,
  updateUserToken,
  uploadFile,
  deleteAvatar,
  changeEmail,
} from '../utils/api/users';
import PhoneInput from 'react-native-phone-input';
import {
  checkCameraPermission,
  displayErrors,
  openSetting,
} from '../../../helpers';
import {
  CountriesModalPicker,
  Text,
  Button,
  COLORS,
  Input,
  InputEmail,
  FONTS,
} from '@components';
import Profile from '@app/assets/image/icons/profile.svg';
import {getNamePattern, required} from '@app/src/utils/validation';
import {Controller, useForm} from 'react-hook-form';
import {setUserData} from '../../Onboarding/redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ProfileEdit = props => {
  const {isEditVisible, setIsEditVisible} = props;
  const currentUser = useSelector(state => state.auth.user);
  const apiToken = useSelector(state => state.auth.token);
  const insets = useSafeAreaInsets();

  const phoneRef = useRef();
  const imgRef = useRef();

  // User Information
  const [profileImg, setImg] = useState(currentUser.avatar);
  const [errorImg, setError] = useState(false);
  const [phone, setPhone] = useState('');

  const [countriesPickerData, setCountriesPickerData] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const {
    setFocus,
    control,
    // handleSubmit,
    setValue,
    getValues,
    formState: {isValid: isFormValid, isDirty, errors},
  } = useForm({
    mode: 'onChange',
  });

  const onPressCancelContryModalPicker = () => {
    setCountryModalVisible(false);
  };

  const selectCountry = country => {
    phoneRef.current.selectCountry(country.iso2);
  };
  const onPressFlag = () => {
    setCountryModalVisible(true);
  };
  useEffect(() => {
    if (phoneRef && phoneRef.current) {
      setCountriesPickerData(phoneRef.current.getPickerData());
    }
  }, [phoneRef]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    getUser(apiToken)
      .then(response => {
        const userData = response.data.data;
        console.log('userData', userData);
        setValue('username', userData.username);
        setPhone(userData.phoneNumber);
        setValue('email', userData.email);
        setValue('phoneNumber', userData.phoneNumber);
        setValue('avatar', userData.avatar);
        setImg(
          userData.avatar === '' ? '' : userData.avatar + '?v=' + Date.now(),
        );
        phoneRef.current?.setValue(userData.phoneNumber);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  const startUpload = async source => {
    setLoading(true);
    const data = {
      type: 'AVATAR',
      file: {
        uri: source.path,
        type: source.mime,
        name: Date.now() + source.path.split('/').pop(),
      },
    };
    uploadFile(data, apiToken)
      .then(async response => {
        if (response.success === true) {
          setError(false);
          setValue('avatar', response.data);
          setImg(response.data);
        }
        setLoading(false);
      })
      .catch(_error => {
        setLoading(false);
      });
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 400,
      height: 400,
    }).then(image => {
      setModalVisible(false);
      startUpload(image);
    });
  };

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 400,
      height: 400,
    }).then(image => {
      setModalVisible(false);
      startUpload(image);
    });
  };

  const changeAvatar = type => {
    if (type === 0) {
      onLaunchCamera();
    } else {
      onOpenPhotos();
    }
  };

  const deleteAction = () => {
    Alert.alert('Do you want to remove profile pic?', '', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => deleteAvatarAction(),
        style: 'cancel',
      },
    ]);
  };

  const deleteAvatarAction = () => {
    // apiToken
    deleteAvatar(apiToken).then(() => {
      setImg('');
      const newUser = currentUser;
      newUser.avatar = '';
      dispatch(
        setUserData({
          user: newUser,
          loading: false,
        }),
      );
    });
  };

  const changeEmailAction = async newEmail => {
    const data = {
      email: newEmail,
    };
    changeEmail(data, apiToken)
      .then(response => {
        Alert.alert('Please verify email address to change your email');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const editAction = async () => {
    const {username, email} = getValues();
    if (!phoneRef.current.isValidNumber()) {
      Alert.alert('', 'Please input valid phone number');
      return;
    }
    setLoading(true);
    if (currentUser.email !== email) {
      changeEmailAction(email);
    }
    // let userData = currentUser;
    let userData = {};
    userData.username = username;
    userData.email = email;
    userData.phoneNumber = phoneRef.current.getValue();
    userData.avatar = profileImg;
    userData.deviceId = currentUser.deviceId;
    updateUserData(userData, apiToken)
      .then(async response => {
        await refreshUser();
        setIsEditVisible(false);
        setLoading(false);
        setValue('email', currentUser.email);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  const runIfCameraPermissionGranted = async () => {
    const permissions = await checkCameraPermission();
    if (permissions !== 'granted') {
      openSetting(
        'You must enable camera permissions in order to take photos.',
        'Camera permission denied',
      );
      return;
    }
    setModalVisible(true);
  };

  const refreshUser = () => {
    getUser(apiToken)
      .then(response => {
        dispatch(
          setUserData({
            user: response.data.data,
            loading: false,
          }),
        );
        return 'success';
      })
      .catch(error => {
        return 'fail';
      });
  };

  return (
    <>
      <Modal
        onSwipeComplete={() => setIsEditVisible(false)}
        avoidKeyboard={true}
        style={[
          styles.modal,
          {paddingTop: insets.top / 2, paddingBottom: insets.bottom},
        ]}
        isVisible={isEditVisible}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsEditVisible(false)}>
              <Icon name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Edit Profile</Text>
          </View>
          <View style={styles.content}>
            <Controller
              name="avatar"
              control={control}
              defaultValue=""
              render={({
                field: {onChange, value, onBlur},
                fieldState: {error},
              }) => (
                <View
                  // disabled={isLoading}
                  style={styles.avatarContainer}>
                  {!errorImg && profileImg !== '' ? (
                    <FastImage
                      style={styles.profileImage}
                      ref={imgRef}
                      source={{
                        uri: profileImg,
                        cache: FastImage.cacheControl.immutable,
                        priority: FastImage.priority.high,
                      }}
                      onLoadEnd={data => {
                        currentUser.avatar !== profileImg
                          ? onChange('changed')
                          : onChange('');
                        FastImage.clearDiskCache();
                        FastImage.clearMemoryCache();
                      }}
                      onError={() => setError(true)}
                      collapsable={false}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : (
                    <Profile height={112} width={112} />
                  )}
                  <TouchableOpacity
                    onPress={() => runIfCameraPermissionGranted()}
                    style={styles.cameraIcon}>
                    <Icon name="camerao" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                  {!errorImg && profileImg !== '' && (
                    <TouchableOpacity
                      style={styles.deleteAvatar}
                      disabled={isLoading}
                      onPress={deleteAction}>
                      <Svgs.Delete size={20} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />

            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{
                required,
                pattern: getNamePattern(),
              }}
              render={({
                field: {onChange, value, onBlur},
                fieldState: {error},
              }) => (
                <Input
                  label="Name"
                  placeholder="Enter name"
                  error={error?.message}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus('email')}
                />
              )}
            />

            <InputEmail
              controllerProps={{
                control,
                defaultValue: '',
              }}
              inputProps={{
                returnKeyType: 'next',
                onSubmitEditing: () => phoneRef.current?.focus(),
              }}
            />
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{
                required,
                // pattern: getNamePattern(),
              }}
              render={({
                field: {onChange, value, onBlur},
                fieldState: {error},
              }) => (
                <View style={styles.phoneContainer}>
                  <Text style={styles.phoneNumberLabel}>Phone Number</Text>
                  <PhoneInput
                    ref={phoneRef}
                    initialCountry={'ng'}
                    style={styles.phoneInput}
                    textStyle={styles.phoneInputText}
                    onPressFlag={onPressFlag}
                    initialValue={phone}
                    placeholder="Enter Phone Number"
                    value={phoneRef.current?.getValue()}
                    textProps={{
                      returnKeyType: 'done',
                      placeholder: 'Enter Phone Number',
                      onChangeText: async data => {
                        value = data;
                        await phoneRef.current?.setValue(data);
                        phoneRef.current?.isValidNumber(data)
                          ? onChange(data)
                          : onChange('');
                      },
                    }}
                    offset={10}
                  />
                  {countriesPickerData && (
                    <CountriesModalPicker
                      data={countriesPickerData}
                      onChange={country => {
                        selectCountry(country);
                      }}
                      visible={countryModalVisible}
                      onCancel={onPressCancelContryModalPicker}
                    />
                  )}
                  {errors.phoneNumber && (
                    <Text style={styles.error}>
                      Please enter a valid mobile number.
                    </Text>
                  )}
                </View>
              )}
            />

            <Button
              disabled={!isFormValid || isLoading || !isDirty}
              title="Save changes"
              onPress={editAction}
            />
          </View>
          <Modal
            swipeDirection={['down']}
            onSwipeComplete={() => setModalVisible(false)}
            style={styles.imagePickerModal}
            isVisible={modalVisible}>
            <View style={styles.imagePickerContent}>
              <View style={styles.imagePickerHeader}>
                <Text textStyle="body18Semibold">Choose Image from</Text>
                <Icon
                  name="close"
                  size={25}
                  color={'black'}
                  style={styles.connectCloseIcon}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={styles.imagePickerButtonContainer}>
                <TouchableOpacity
                  onPress={() => changeAvatar(0)}
                  style={styles.imagePickerButton}>
                  <Icon name="camerao" size={30} color={COLORS.black} />
                  <Text>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => changeAvatar(1)}
                  style={styles.imagePickerButton}>
                  <Icon name="jpgfile1" size={30} color={COLORS.black} />
                  <Text>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAwareScrollView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  modal: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    // justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 16,
  },
  closeButton: {
    marginRight: 32,
    padding: 8,
  },
  profileImage: {
    width: 112,
    height: 112,
    borderWidth: 1,
    borderColor: COLORS.form,
    borderRadius: 100,
  },
  phoneInput: {
    height: 64,
    backgroundColor: COLORS.white,

    paddingHorizontal: 16,
    paddingTop: 8,

    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.disabled,
  },
  phoneInputText: {
    marginTop: 6,
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: 18,
    lineHeight: Platform.OS === 'android' ? 18 * 1.1 : 18 * 1.35,
    flex: 1,
  },
  phoneNumberLabel: {
    position: 'absolute',
    zIndex: 2,

    left: 16,
    top: 10,

    fontFamily: FONTS.regular,
    fontSize: 10,
  },
  avatarContainer: {
    width: 112,
    height: 112,

    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    marginBottom: 60,
    marginTop: 20,
  },
  imagePickerModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  imagePickerContent: {
    backgroundColor: COLORS.white,

    padding: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imagePickerButtonContainer: {
    flexDirection: 'row',

    justifyContent: 'space-around',
  },
  imagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePickerButton: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingTop: 20,
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,

    backgroundColor: COLORS.primary,
    padding: 4,
    borderRadius: 20,
  },

  deleteAvatar: {
    position: 'absolute',
    left: 0,
    bottom: 0,

    backgroundColor: COLORS.disabled,
    padding: 4,
    borderRadius: 20,
  },
  phoneContainer: {
    marginBottom: 20,
  },
  error: {
    color: COLORS.error,
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
})(ProfileEdit);
