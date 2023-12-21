import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import {styles} from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {checkPermission, displayErrors, openSetting} from '../../../helpers';
import {TNActivityIndicator, Text, Button, COLORS, Input} from '@components';
import FastImage from 'react-native-fast-image';
import {getNamePattern, required} from '@app/src/utils/validation';
import {Controller, useForm} from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GoogleAPIKey} from '@app/src/lib/config';
import {getNFTBalance} from '../utils/api/nft';

const InterstateBookingScreen = props => {
  const {route, navigation} = props;
  const apiToken = useSelector(state => state.auth.token);
  const ride = route.params.ride;
  console.log(ride);

  const userData = useSelector(state => state.auth.user);

  const [isLoading, setLoading] = useState(false);
  const [loading, setBtnLoading] = useState(false);
  const [carModalVisible, setCarModalVisible] = useState(false);

  // Date Time Picker
  const depRef = useRef();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [car, setCar] = useState('');
  const [dep, setDep] = useState('');
  const [valid, setValid] = useState(false);

  // End of Date Time Picker
  const carRef = useRef();
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

  useEffect(() => {
    var available = true;
    var values = getValues();
    Object.entries(values).map(([item, value]) => {
      if (value === '') {
        available = false;
      }
    });
    setValid(available);
  }, [date, time, dep, car]);

  const handleConfirm = curDate => {
    setDatePickerVisible(!isDatePickerVisible);
    mode === 'date' ? setDate(curDate) : setTime(curDate);
    mode === 'date' ? setValue('date', curDate) : setValue('time', curDate);
  };
  const selectCar = item => {
    setCarModalVisible(false);
    setCar(item);
    setValue('car', item);
  };

  const saveAction = async () => {
    setBtnLoading(true);
    const balance = await getNFTBalance(userData.ticketId);
    setBtnLoading(false);
    console.log(balance);
    console.log('123');
  };

  if (isLoading) {
    return <TNActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrowleft" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold" numberOfLines={1}>
              {ride.from.name} - {ride.to.name}
            </Text>
          </View>
          <Text textStyle="body18Semibold" numberOfLines={1}>
            ₦ {car.price ? car.price : 0}
          </Text>
        </View>
        <View style={styles.profileImageContainer}>
          <View style={styles.halfContainer}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                setMode('date');
                setDatePickerVisible(true);
              }}>
              <Text
                placeholder="Date"
                value={
                  date === '' ? '' : moment(new Date(date)).format('DD.MM.YYYY')
                }
                style={[
                  styles.inputBox,
                  {
                    color: date === '' ? COLORS.body : COLORS.black,
                  },
                ]}
                placeholderTextColor={COLORS.body}>
                {date === ''
                  ? 'Date'
                  : moment(new Date(date)).format('DD.MM.YY')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.halfContainer}>
            <Controller
              name="time"
              control={control}
              defaultValue=""
              rules={{
                required,
              }}
              render={({
                field: {onChange, value, onBlur},
                fieldState: {error},
              }) => (
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => {
                    setMode('time');
                    setDatePickerVisible(true);
                  }}>
                  <Text
                    placeholder="Time"
                    style={[
                      styles.inputBox,
                      {
                        color: time === '' ? COLORS.body : COLORS.black,
                      },
                    ]}
                    placeholderTextColor={COLORS.body}
                    editable={false}>
                    {time === ''
                      ? 'Time'
                      : moment(new Date(time)).format('HH:mm')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <Text style={styles.sectionTitle} textStyle="body14SemiBold">
            Ride Info
          </Text>
          <Controller
            name="car"
            control={control}
            defaultValue=""
            rules={{
              required,
            }}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setCarModalVisible(true);
                }}>
                <Text
                  placeholder="Select Car"
                  style={[
                    styles.inputBox,
                    {
                      color: car === '' ? COLORS.body : COLORS.black,
                    },
                  ]}
                  placeholderTextColor={COLORS.body}
                  editable={false}>
                  {car === '' ? 'Select Car' : car.id}
                </Text>
                {car === '' ? (
                  <Icon
                    name="down"
                    size={20}
                    color={COLORS.black}
                    style={styles.iconDown}
                  />
                ) : (
                  <Text textStyle="body18Semibold" style={styles.rightPrice}>
                    + ₦{car.price}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
          <Controller
            name="location"
            control={control}
            defaultValue=""
            rules={{
              required,
            }}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <GooglePlacesAutocomplete
                ref={depRef}
                placeholder={'Enter pick up location'}
                minLength={2}
                currentLocation={true}
                // currentLocationLabel="Current location"
                enablePoweredByContainer={false}
                styles={{
                  listView: {
                    maxHeight: 200,
                  },
                  container: [
                    styles.placesInputContainer,
                    {borderColor: COLORS.form},
                  ],
                  textInput: styles.placesInput,
                  row: styles.placesRow,
                  separator: styles.placesSeparator,
                  description: styles.placesDescription,
                  loader: styles.placesLoader,
                }}
                listViewDisplayed={false}
                renderRightButton={() =>
                  depRef.current?.getAddressText() ? (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        depRef.current?.clear();
                        depRef.current?.setAddressText('');
                        setDep('');
                        setValue('location', '');
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        color={COLORS.body}
                        size={20}
                      />
                    </TouchableOpacity>
                  ) : null
                }
                renderRow={data => {
                  return (
                    <View style={styles.placesRow}>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color={COLORS.black}
                      />
                      <View style={{marginLeft: 8}}>
                        {(data.isCurrentLocation === true ||
                          data.structured_formatting) && (
                          <Text textStyle="body18Regular">
                            {data.isCurrentLocation === true
                              ? data.description
                              : data?.structured_formatting?.main_text}
                          </Text>
                        )}
                        {!!data?.structured_formatting?.secondary_text && (
                          <Text style={{color: COLORS.body}}>
                            {data?.structured_formatting?.secondary_text}
                          </Text>
                        )}
                        {!!data?.name && (
                          <Text textStyle="body18Regular">{data?.name}</Text>
                        )}
                        {!!data?.vicinity && (
                          <Text style={{color: COLORS.body}}>
                            {data?.vicinity}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }}
                textInputProps={{
                  placeholderTextColor: COLORS.body,
                  clearButtonMode: 'never',
                  onFocus: async () => {
                    var permissionStatus = await checkPermission();
                    if (permissionStatus !== 'granted') {
                      openSetting(
                        'Please allow location permission to get your location',
                      );
                      depRef.current?.blur();
                      return;
                    }
                    setFocus(true);
                  },
                  onSubmitEditing: () => {
                    setFocus(false);
                  },
                }}
                onPress={(data, details = null) => {
                  setFocus(false);
                  if (details && details.address_components) {
                    const country = details.address_components.find(component =>
                      component.types.includes('country'),
                    );
                    const countryCode = country ? country.short_name : null;
                    if (countryCode !== 'NG') {
                      Alert.alert('Please enter a Nigeria location');
                      return;
                    }
                  }
                  const temp = {};
                  temp.name = data.description
                    ? data.description
                    : data.vicinity;
                  temp.latitude = details.geometry.location.lat;
                  temp.longitude = details.geometry.location.lng;

                  setValue('location', temp);
                  setDep(temp);
                }}
                GooglePlacesDetailsQuery={{
                  fields: ['formatted_address', 'geometry'],
                }}
                fetchDetails={true}
                query={{
                  key: GoogleAPIKey,
                  language: 'en',
                  components: 'country:ng',
                }}
              />
            )}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <Text style={styles.sectionTitle} textStyle="body14SemiBold">
            Passenger Info
          </Text>
          <Controller
            name="username"
            control={control}
            defaultValue={userData?.username ?? ''}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Input
                label="Name"
                placeholder="Enter name"
                error={error?.message}
                value={userData?.username ?? ''}
                disabled={true}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => setFocus('email')}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue={userData?.phoneNumber ?? ''}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Input
                label="Phone number"
                placeholder="Enter phone number"
                error={error?.message}
                value={userData?.phoneNumber ?? ''}
                disabled={true}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => setFocus('email')}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue={userData?.email ?? ''}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Input
                label="Email"
                placeholder="Enter email"
                error={error?.message}
                value={userData?.email ?? ''}
                disabled={true}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => setFocus('email')}
              />
            )}
          />
          <View>
            <Text textStyle="body10Regular" style={styles.terms}>
              By continuing, I agree to Metrocabs’s&nbsp;
              <Text
                textStyle="body10SemiBold"
                style={styles.link}
                onPress={async () =>
                  await Linking.openURL(
                    'https://bloxmove.ng/terms-for-passengers/',
                  )
                }>
                Cancellation Policy.
              </Text>
            </Text>
            <Button
              onPress={saveAction}
              disabled={!valid || loading}
              title={'Pay ' + (car.price ? car.price : '')}
            />
          </View>
        </View>

        <Modal
          onSwipeComplete={() => {
            carRef.current?.blur();
            setCarModalVisible(false);
          }}
          avoidKeyboard={true}
          style={styles.modal}
          swipeDirection={['down']}
          isVisible={carModalVisible}>
          <View style={styles.modalContent}>
            {ride.prices.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => selectCar(item)}
                  style={styles.carContainer}>
                  <View style={styles.flexContainer}>
                    <FastImage
                      style={styles.image}
                      resizeMode={FastImage.resizeMode.contain}
                      color="white"
                      source={require('@app/assets/image/icons/interstate.png')}
                    />
                    <View>
                      <Text textStyle="body18Semibold">Name</Text>
                    </View>
                  </View>
                  <Text textStyle="body18Semibold">₦ {item.price} / seat</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Modal>
        <DatePicker
          modal
          open={isDatePickerVisible}
          date={
            mode === 'date'
              ? date === ''
                ? new Date()
                : date
              : time === ''
              ? new Date()
              : time
          }
          onConfirm={handleConfirm}
          onCancel={() => {
            setDatePickerVisible(false);
          }}
          minimumDate={mode === 'date' ? new Date() : undefined}
          // maximumDate={maximumDate === '' ? undefined : maximumDate}
          mode={mode}
          theme="light"
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default InterstateBookingScreen;
