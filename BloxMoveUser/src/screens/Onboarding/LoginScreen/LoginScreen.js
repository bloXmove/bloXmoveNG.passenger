import React, {useState, useRef, useEffect} from 'react';
import {
  Alert,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Linking,
} from 'react-native';
import deviceStorage from '../../utils/AuthDeviceStorage';
import {
  createAccount,
  getEmailStatus,
  getToken,
  loginActions,
  resendVerification,
  updateEmail,
} from '../../utils/api/actions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import {
  CountriesModalPicker,
  Text,
  Input,
  InputEmail,
  Button,
} from '@components';
import {required, getNamePattern} from '@app/src/utils/validation';
import {setUserData} from '../redux';
import {useDispatch} from 'react-redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {displayErrors, openSetting, getDeviceId} from '../../../helpers';
import {Controller, useForm} from 'react-hook-form';
import dynamicStyles from './styles';
import BackgroundTimer from 'react-native-background-timer';
import {getSignatureLogin} from '@app/src/screens/HomeScreens/utils/api/nft';
import {getUniqueId} from 'react-native-device-info';

const LoginScreen = props => {
  const {navigation, route} = props;
  const accountId = route.params.accountId;
  const styles = dynamicStyles();
  const lastInputRef = useRef();
  const referCodeRef = useRef();

  const {
    setFocus,
    control,
    handleSubmit,
    getValues,
    formState: {isValid: isFormValid, errors},
  } = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();

  const phoneRef = useRef();

  const [countriesPickerData, setCountriesPickerData] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [uuid, setUserId] = useState('');

  const onPressCancelContryModalPicker = () => {
    setCountryModalVisible(false);
  };

  const selectCountry = country => {
    phoneRef.current.selectCountry(country.iso2);
  };
  const onPressFlag = () => {
    setCountryModalVisible(true);
  };

  // Dynamic Links
  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    if (!link) {
      return;
    }
    if (link.url === 'https://bloxmoveuser.page.link/verify-email') {
      // ...navigate to your offers screen
      checkVerification(true);
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (!link) {
          return;
        }
        if (link.url === 'https://bloxmoveuser.page.link/verify-email') {
          // ...set initial route as offers screen
          checkVerification(true);
        }
      });
  }, []);

  const checkVerification = linkFlag => {
    setLoading(true);
    getEmailStatus(accountId)
      .then(response => {
        if (response.data.data.status === true) {
          linkFlag === false
            ? Alert.alert('', 'Your account is already verfied.', [
                {text: 'OK', onPress: () => loginAction()},
              ])
            : loginAction();
          return;
        }
        verificationEmail();
        setLoading(false);
      })
      .catch(error => {
        displayErrors(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (phoneRef && phoneRef.current) {
      setCountriesPickerData(phoneRef.current.getPickerData());
    }
  }, [phoneRef]);

  const saveAction = async data => {
    const {email, firstName, lastName, referralBy} = data;

    if (!phoneRef.current?.isValidNumber()) {
      Alert.alert('', 'Please input valid phone number');
      return;
    }
    const tokenPermission = await getDeviceId();
    if (tokenPermission === 'fail') {
      openSetting(
        'Please allow notification permission to get the push notification',
      );
      return;
    }
    const verification_uid = await getUniqueId();
    setLoading(true);
    const userData = {
      username: firstName.trim() + ' ' + lastName.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      walletAddress: accountId,
      phoneNumber: phoneRef.current.getValue(),
      deviceId: tokenPermission,
      referralBy: referralBy === '' ? '0' : referralBy.toString(),
      verification_uid: verification_uid,
      uuid: uuid,
    };
    if (emailAddress.trim() !== '' && emailAddress.trim() !== email.trim()) {
      updateEmail(userData)
        .then(response => {
          // setUserId(response.data.data.uuid);
          loginAction();
          setLoading(false);
        })
        .catch(error => {
          if (error.response) {
            if (
              error.response.data.message ===
              'The passenger already exists(wallet address conflicts).'
            ) {
              checkVerification(false);
              return;
            }
          }
          displayErrors(error);
          setLoading(false);
        });
    } else {
      createAccount(userData)
        .then(response => {
          setEmailAddress(email.trim());
          setUserId(response.data.data.uuid);
          loginAction();
        })
        .catch(error => {
          if (error.response) {
            if (
              error.response.data.message ===
              'The passenger already exists(wallet address conflicts).'
            ) {
              checkVerification(false);
              return;
            }
          }
          displayErrors(error);
          setLoading(false);
        });
    }
  };

  const verificationEmail = async () => {
    setLoading(true);
    resendVerification(accountId)
      .then(response => {
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            checkVerification(false);
            return;
          }
          displayErrors(error);
        } else {
          displayErrors(error);
        }
      });
  };

  const loginAction = async () => {
    const {email, firstName, lastName} = getValues();

    const signatureResult = await getSignatureLogin(accountId);
    if (signatureResult.success !== true) {
      Alert.alert('Please grant access');
      return;
    }
    const userData = {
      username: firstName.trim() + ' ' + lastName.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneRef.current.getValue(),
    };
    const result = await getToken(accountId);
    if (result.success === true) {
      const token = result.data.token;
      await deviceStorage.setShouldShowOnboardingFlow('true');
      await deviceStorage.setAccountNumber(accountId);
      dispatch(setUserData({user: userData}));
      await dispatch(loginActions(token, accountId));
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
      });
      setLoading(false);
    } else {
      Alert.alert('Please verify email address');
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View>
              <Text textStyle="header24" style={styles.title}>
                Welcome
              </Text>
              <Text textStyle="body14Regular" style={styles.description}>
                You appear to be new, please fill the form so we can know you.
              </Text>
              <Controller
                name="firstName"
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
                    label="First name"
                    placeholder="Enter first name"
                    error={error?.message}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    onSubmitEditing={() => lastInputRef.current?.focus()}
                  />
                )}
              />
              <Controller
                name="lastName"
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
                    label="Last name"
                    ref={lastInputRef}
                    placeholder="Enter last name"
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
                  onSubmitEditing: () => {
                    phoneRef.current?.focus();
                  },
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
                  <View>
                    <Text style={styles.phoneNumberLabel}>Phone Number</Text>
                    <PhoneInput
                      ref={phoneRef}
                      initialCountry={'ng'}
                      style={styles.phoneInput}
                      textStyle={styles.phoneInputText}
                      onPressFlag={onPressFlag}
                      placeholder="Enter Phone Number"
                      textProps={{
                        returnKeyType: 'next',
                        placeholder: 'Enter Phone Number',
                        onChangeText: async data => {
                          value = data;
                          await phoneRef.current?.setValue(data);
                          phoneRef.current?.isValidNumber(data)
                            ? onChange(data)
                            : onChange('');
                        },
                        onSubmitEditing: () => referCodeRef.current?.focus(),
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
              <Controller
                name="referralBy"
                control={control}
                defaultValue=""
                rules={{}}
                render={({
                  field: {onChange, value, onBlur},
                  fieldState: {error},
                }) => (
                  <Input
                    label="Referral code"
                    ref={referCodeRef}
                    placeholder="Enter referral code"
                    error={error?.message}
                    value={value}
                    keyboardType="number-pad"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="done"
                  />
                )}
              />
            </View>

            <View>
              <Text textStyle="body10Regular" style={styles.terms}>
                By continuing, I agree to BloXmove’s{' '}
                <Text
                  textStyle="body10SemiBold"
                  style={styles.link}
                  onPress={async () =>
                    await Linking.openURL(
                      'https://bloxmove.ng/terms-for-passengers/',
                    )
                  }>
                  Terms and conditions
                </Text>
                ,{' '}
                <Text textStyle="body10SemiBold" style={styles.link}>
                  Payments Terms of Service
                </Text>{' '}
                and{' '}
                <Text textStyle="body10SemiBold" style={styles.link}>
                  Privacy Policy
                </Text>
              </Text>
              <Button
                onPress={handleSubmit(saveAction)}
                disabled={loading || !isFormValid}
                title="Continue"
                containerStyle={styles.btnContainer}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
