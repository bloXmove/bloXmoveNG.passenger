import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';

import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import Svgs from '../../../../assets/svg/svgs';
import MapViewDirections from 'react-native-maps-directions';
import * as Progress from 'react-native-progress';
import {Dash} from '../../../components';
import {GoogleAPIKey} from '../../../lib/config';
import {getJourneyCurrent, journeyRequestDetail} from '../utils/api/jonuney';
import {journeyAPI} from '../utils';
import {displayErrors} from '../../../helpers/displayErrors';
import {useSelector} from 'react-redux';

const width = Dimensions.get('window').width;

const NewRequestScreen = props => {
  const {route, navigation} = props;
  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;
  const item = route.params.item;
  const colorScheme = useColorScheme();
  let currentTheme = appStyles.navThemeConstants[colorScheme];
  const styles = dynamicStyles(appStyles, colorScheme);
  const [showCurrent, setCurrent] = useState(false);
  const [durtaion, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();
  const [position, setPosition] = useState({
    latitude: item.from.latitude,
    longitude: item.from.longitude,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0421,
  });
  let intervalId = useRef(null);
  const apiToken = useSelector(state => state.auth.token);

  const didFocusSubscription = useRef(
    navigation.addListener('focus', payload => {
      setAppState();
    }),
  );

  useEffect(() => {
    setAppState();
    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  const setAppState = () => {};

  useEffect(() => {
    getCurrent();
    return () => {
      clearInterval(intervalId.current);
    };
  }, [item]);

  const getCurrent = () => {
    intervalId.current = setInterval(() => {
      detailRequest();
    }, 1000);
  };
  const detailRequest = () => {
    journeyRequestDetail(item.id, apiToken)
      .then(response => {
        const requestStatus = response.data.data.status;
        if (requestStatus === 'ACCEPTED') {
          getAcceptedRequest();
        }
        if (requestStatus === 'CANCELED') {
          clearInterval(intervalId.current);
          Alert.alert('No one is available now. Please try again', '', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Home', {
                  appConfig: appConfig,
                  appStyles: appStyles,
                });
              },
            },
          ]);
        }
      })
      .catch(error => {
        console.log(
          'Error to get the detail of the journey request',
          error.response,
        );
      });
  };

  const getAcceptedRequest = () => {
    getJourneyCurrent(apiToken)
      .then(response => {
        clearInterval(intervalId.current);
        navigation.navigate('BookHail', {
          appStyles: appStyles,
          item: response.data.data,
          backFlag: false,
          currentFlag: false,
        });
      })
      .catch(error => {
        console.log('Error to get the current journey');
      });
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.btnToggle} onPress={openDrawer}>
          <Icon name="menu-outline" size={30} color={currentTheme.fontColor} />
        </TouchableOpacity>
      ),
      headerShown: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDrawer = () => {
    Keyboard.dismiss();
    props.navigation.openDrawer();
  };

  // Cancel Request Before Driver Arrives
  const cancelAction = async () => {
    setLoading(true);
    clearInterval(intervalId.current);
    journeyAPI
      .journeyRequestCancel(item.id, apiToken)
      .then(() => {
        setLoading(false);
        navigation.navigate('Home', {
          appConfig: appConfig,
          appStyles: appStyles,
        });
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialRegion={position}
        region={position}
        style={styles.mapContainer}
        showsUserLocation={showCurrent}
        userInterfaceStyle="light">
        <MapViewDirections
          origin={item.from}
          destination={item.to}
          apikey={GoogleAPIKey}
          mode={'DRIVING'}
          strokeWidth={3}
          strokeColor={appStyles.colorSet[colorScheme].mainThemeForegroundColor}
          onReady={result => {
            setDuration(result.duration);
          }}
        />
        <Marker
          coordinate={{
            latitude: item.from.latitude,
            longitude: item.from.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}>
          <Svgs.Current size={30} />
        </Marker>
        <Marker
          coordinate={{
            latitude: item.to.latitude,
            longitude: item.to.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}>
          <Svgs.Pin size={30} />
        </Marker>
      </MapView>
      <View style={[styles.boxContainer, styles.bottomContainer]}>
        <TouchableOpacity style={styles.track}>
          <Svgs.Track size={20} style={styles.track} />
        </TouchableOpacity>
        <View style={[styles.bodyContainer, styles.flexContainer]}>
          <View style={styles.leftContainer}>
            <Icon
              name="radio-button-on-outline"
              size={25}
              color={appStyles.colorSet[colorScheme].mainColor}
            />
            <Dash appStyles={appStyles} />
            <Icon name="location-outline" size={25} color={'red'} />
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.addressTopText} numberOfLines={1}>
              {item.from.name}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.addressBottomText} numberOfLines={1}>
              {item.to.name}
            </Text>
          </View>
        </View>
        <View style={styles.processingContainer}>
          <View style={styles.modalContainer}>
            <Progress.Bar
              progress={0.3}
              width={width * 0.8}
              height={10}
              indeterminate={true}
              color={appStyles.colorSet[colorScheme].mainThemeForegroundColor}
            />
          </View>
          <View style={styles.modalContainer}>
            <Text style={styles.text}>
              Waiting for driver to accept request
            </Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.btnPassengerCancelContainer}
            onPress={() => {
              cancelAction();
            }}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Cancel Ride</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

NewRequestScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default NewRequestScreen;
