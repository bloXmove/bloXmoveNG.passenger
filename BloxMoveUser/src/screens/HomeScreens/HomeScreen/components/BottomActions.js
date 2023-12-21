import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Platform, Keyboard, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles';
import {COLORS, Text, Button} from '@components';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GoogleAPIKey} from '@app/src/lib/config';
import {Pin} from '../../BookedScreen/components/Pin/Pin';
import {checkPermission, openSetting} from '@app/src/helpers';
import FastImage from 'react-native-fast-image';

navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');

export const BottomActions = ({
  navigation,
  type,
  setType,
  setAddressesModalVisible,
  depRef,
  showCurrent,
  setCurrent,
  updateLocation,
  setDep,
  desRef,
  setDestination,
  searchVehicle,
  loading,
}) => {
  const [isFocused, setFocus] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setFocus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setFocus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const interstateBooking = () => {
    navigation.navigate('ComingSoon');
    // setType(1);
  };

  return (
    <View style={styles.bottomComponent}>
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          ref={depRef}
          placeholder={showCurrent ? 'Current Position' : 'Departure'}
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
                  setDep('');
                  depRef.current?.clear();
                  depRef.current?.setAddressText('');
                }}>
                <Icon
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
                <Icon name="location-outline" size={20} color={COLORS.black} />
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
                    <Text style={{color: COLORS.body}}>{data?.vicinity}</Text>
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
            setCurrent(false);
            if (details && details.address_components) {
              const country = details.address_components.find(component =>
                component.types.includes('country'),
              );
              const countryCode = country ? country.short_name : null;
              if (countryCode !== 'NG') {
                Alert.alert('Please enter a Nigeria location');
                return;
              }

              // countryCode now contains the country code of the selected location.
              console.log('Country Code:', countryCode);
            }
            const temp = {};
            temp.name = data.description ? data.description : data.vicinity;
            temp.latitude = details.geometry.location.lat;
            temp.longitude = details.geometry.location.lng;

            // updateLocation(
            //   details.geometry.location.lat - 0.05,
            //   details.geometry.location.lng,
            // );
            setDep(temp);
          }}
          renderLeftButton={() => (
            <View style={styles.placesLeftComponent}>
              {depRef.current?.isFocused() ? (
                <Icon name="search" size={18} color={COLORS.black} />
              ) : (
                <Pin color="blue" />
              )}
            </View>
          )}
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
      </View>
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          ref={desRef}
          placeholder={'Destination'}
          minLength={2}
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
            separator: styles.placesSeparator,
            description: styles.placesDescription,
            loader: styles.placesLoader,
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
                desRef.current?.blur();
                return;
              }
              setFocus(true);
            },
            onSubmitEditing: () => {
              setFocus(false);
            },
          }}
          renderRightButton={() =>
            desRef.current?.getAddressText() ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setDestination('');
                  desRef.current?.setAddressText('');
                }}>
                <Icon
                  name="close-circle-outline"
                  color={COLORS.body}
                  size={20}
                />
              </TouchableOpacity>
            ) : null
          }
          renderLeftButton={() => (
            <View style={styles.placesLeftComponent}>
              {desRef.current?.isFocused() ? (
                <Icon name="search" size={18} color={COLORS.black} />
              ) : (
                <Pin color="green" />
              )}
            </View>
          )}
          renderRow={data => {
            return (
              <View style={styles.placesRow}>
                <Icon name="location-outline" size={20} color={COLORS.black} />
                <View style={{marginLeft: 8}}>
                  <Text textStyle="body18Regular">
                    {data?.structured_formatting?.main_text}
                  </Text>
                  {!!data?.structured_formatting?.secondary_text && (
                    <Text style={{color: COLORS.body}}>
                      {data?.structured_formatting?.secondary_text}
                    </Text>
                  )}
                </View>
              </View>
            );
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

              // countryCode now contains the country code of the selected location.
              console.log('Country Code:', countryCode);
            }
            const temp = {};
            temp.name = data.description;
            temp.latitude = details.geometry.location.lat;
            temp.longitude = details.geometry.location.lng;
            // updateLocation(
            //   details.geometry.location.lat - 0.05,
            //   details.geometry.location.lng,
            // );
            setDestination(temp);
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
      </View>
      {!isFocused && (
        <Button
          title="Search"
          onPress={searchVehicle}
          containerStyle={styles.searchButton}
          disabled={loading}
        />
      )}
      {/* <TouchableOpacity
        onPress={() => {
          setAddressesModalVisible(true);
        }}
        style={styles.input}>
        <View style={styles.inputLeft}>
          <Icon
            style={styles.searchIcon}
            name="search"
            size={24}
            color={COLORS.black}
          />
          <Text style={{color: COLORS.body}} textStyle="body18Regular">
            Where to?
          </Text>
        </View>
        <View style={styles.inputRight}>
          <View style={styles.watchIcon}>
            <Icon name="time-outline" size={24} color={COLORS.white} />
          </View>
          <Text textStyle="body18Semibold">Now</Text>
        </View>
      </TouchableOpacity> */}
      {!isFocused && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.bottomComponentButton,
              {borderColor: type === 0 ? COLORS.primary : COLORS.white},
            ]}
            onPress={() => setType(0)}>
            <FastImage
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
              source={require('@app/assets/image/icons/taxi.png')}
              color="white"
            />
            <Text textStyle="body18Semibold">bloXride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomComponentButton,
              {borderColor: type === 1 ? COLORS.primary : COLORS.white},
            ]}
            onPress={interstateBooking}>
            <FastImage
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
              color="white"
              source={require('@app/assets/image/icons/bus.png')}
            />
            <Text textStyle="body18Semibold">bloXfleet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
