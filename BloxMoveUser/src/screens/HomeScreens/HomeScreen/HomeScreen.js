import React, {useState, useEffect, useRef} from 'react';
import {
  Platform,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import {GoogleAPIKey} from '../../../lib/config';
import {
  checkPermission,
  openSetting,
  displayErrors,
  getAddressFromCoordinates,
} from '../../../helpers';
import {COLORS, Text} from '../../../components';
import {journeyAPI} from '../utils';
import Geocoder from 'react-native-geocoding';
import {useSelector, useDispatch, connect} from 'react-redux';
import {BottomActions} from './components/BottomActions';
import {styles} from './styles';
import {DotBlue, DotGreen} from '@app/assets/image/icons';
import {PaymentSection} from './components/PaymentSection/PaymentSection';
import {ConnectingSection} from './components/ConnectingSection/ConnectingSection';
import {RideSection} from './components/RideSection/RideSection';
import {useNetInfo} from '@react-native-community/netinfo';
import {getCurrentLocation} from '@app/src/helpers/getPermission';
import {changeNFTBalance, getNFTBalance} from '../utils/api/nft';
import FastImage from 'react-native-fast-image';
import {calcuateDuration} from '@app/src/helpers';
import {cancelList} from '@app/src/lib/contants';

const {width, height} = Dimensions.get('window');

const HomeScreen = props => {
  const {navigation} = props;
  const currentJourney = useSelector(state => state.journey.currentJourney);
  const apiToken = useSelector(state => state.auth.token);
  const currnetUser = useSelector(state => state.auth.user);
  const netInfo = useNetInfo();

  const dispatch = useDispatch();
  // types : INITIAL, PAYMENT, CONNECTING, CURRENT
  const [bottomContentType, setBottomContentType] = useState('INITIAL');
  const [journeyData, setJourneyData] = useState(null);

  const [type, setType] = useState(0);
  const [flag, setFlag] = useState(false);
  const [rideRequestData, setRideRequestData] = useState({});
  const [showCurrent, setCurrent] = useState(false);
  const [depature, setDep] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressesModalVisible, setAddressesModalVisible] = useState(false);
  const [isReady, setReady] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [bookDate, setDate] = useState(
    new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  );
  const [bookTime, setTime] = useState();
  // eslint-disable-next-line no-unused-vars
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [formatedDuration, setCalDuration] = useState('');
  const mapRef = useRef();
  const depRef = useRef();
  const desRef = useRef();
  let intervalId = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [position, setPosition] = useState({
    latitude: 6.564876,
    longitude: 3.367143,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.1921,
  });
  // Update Driver's location real time
  const [driverLocation, setDriver] = useState({});
  const [directionFlag, setDirectionFlag] = useState(true);

  useEffect(() => {
    let isMounted = true;
    isMounted === true ? getCurrent() : '';
    return () => {
      isMounted = false;
    };
  }, []);
  // }, [currentJourney]);

  useEffect(() => {
    if (currentJourney?.status) {
      updateLocation(
        currentJourney.journeyRequest.from?.latitude - 0.05,
        currentJourney.journeyRequest.from?.longitude,
      );
      setDep(currentJourney.journeyRequest?.from);
      setDestination(currentJourney.journeyRequest?.to);
      setBottomContentType('CURRENT');
      cancelList.indexOf(currentJourney?.status) === -1
        ? setDirectionFlag(true)
        : setDirectionFlag(false);
    } else {
      setDep('');
      setDestination('');
      setDirectionFlag(true);
    }
  }, [currentJourney]);

  const getCurrent = async () => {
    dispatch(journeyAPI.getCurrentJourney(apiToken));
  };
  useEffect(() => {
    // checkPermission();
    Geocoder.init(GoogleAPIKey);
    changeTime();
    return () => {
      clearInterval(intervalId.current);
    };
  }, []);
  useEffect(() => {}, [bottomContentType, driverLocation]);
  // Change map after enterred departure and destination
  useEffect(() => {
    updateMapView();
  }, [depature, destination, bottomContentType]);

  const updateMapView = () => {
    if (!depature.latitude && !destination.latitude) {
      getCurrentLocation()
        .then(response => {
          if (response.coords) {
            mapRef.current.animateToRegion(
              {
                latitude: response.coords.latitude - 0.05,
                longitude: response.coords.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: 0.1921,
              },
              0,
            );
            setCurrent(true);
          }
        })
        .catch(error => {});
      return;
    }
    setCurrent(false);
    let latArr = [];
    depature ? latArr.push(depature) : '';
    destination ? latArr.push(destination) : '';
    mapRef?.current.fitToCoordinates(latArr, {
      edgePadding: {
        top: 100,
        right: Platform.OS === 'android' ? 0 : 50,
        bottom: height / 1.5,
        left: Platform.OS === 'android' ? 0 : 50,
      },
      animated: Platform.OS === 'android' ? false : true,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const changeTime = () => {
    intervalId.current = setInterval(() => {
      let date = new Date();
      let hours = date.getHours();
      let minutes = ('0' + date.getMinutes()).slice(-2);
      setTime(hours + ':' + minutes);
    }, 1000);
  };

  const openDrawer = () => {
    Keyboard.dismiss();
    navigation?.openDrawer();
  };
  const initScreen = () => {
    setDep('');
    setDestination('');
    setLoading(true);
    setBottomContentType('INITIAL');
  };
  // Change Current Position
  const updateLocation = (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.1921,
      },
      2000,
    );
  };
  const searchVehicle = async () => {
    setLoading(true);
    console.log('netInfo.isConnected', netInfo.isConnected);
    if (!netInfo.isConnected) {
      // Alert.alert('Please check your network connection');
      navigation.navigate('ErrorScreen', {
        title: 'You’re offline',
        subTitle: 'No internet. Connect to wi-fi or cellular network. ',
        buttonTitle: 'Try again',
      });
      setLoading(false);
      return;
    }
    var permissionStatus = await checkPermission();
    if (permissionStatus === 'granted') {
      continueSearch();
    } else {
      setLoading(false);
      openSetting('Please allow location permission to search vehicle');
    }
  };

  const continueSearch = async () => {
    if (depature === '' && destination === '') {
      setLoading(false);
      Alert.alert('Please enter destination and departure', '');
      return;
    }
    if (depature === '') {
      setLoading(false);
      Alert.alert('Please enter departure', '');
      return;
    }
    if (destination === '') {
      setLoading(false);
      Alert.alert('Please enter destination', '');
      return;
    }
    if (duration === '') {
      setLoading(false);
      Alert.alert('Please enter valid departure and destination', '');
      return;
    }
    const nftStatus = await getNFTBalance(currnetUser.ticketId);
    if (
      nftStatus.success === false ||
      (nftStatus.success === true && nftStatus.data[1] !== 0)
    ) {
      navigation.navigate('ErrorScreen', {
        title: 'NFTicket not available',
        subTitle:
          'You currently can’t make payment for a ride because your NFTicket is not available. Try making payment later.',
        buttonTitle: 'Ok',
      });
      setLoading(false);
      return;
    }
    const data = {
      from: depature,
      to: destination,
      pickDate: bookDate,
      pickUpTime: new Date().getTime(),
      rideType: type === 0 ? 'TAXI_HAILING' : 'INTERSTATE_TRIP',
    };
    journeyAPI
      .journeySearch(data, apiToken)
      .then(response => {
        setLoading(false);
        if (type === 1) {
          navigation.navigate('Interstate', {
            ride: response?.data?.data,
          });
          return;
        }
        setRideRequestData(response?.data?.data);
        setBottomContentType('PAYMENT');
        setAddressesModalVisible(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.response) {
          if (error.response.data.message === 'Journey not found.') {
            navigation.navigate('ErrorScreen', {
              title: 'Route too short',
              subTitle:
                'Kindly change your departure or destination. Minimum ride fare is NGN 650.',
              buttonTitle: 'Try again',
            });
            return;
          }
        }
        displayErrors(error);
      });
  };
  // Rotate map view
  const calculateRotationAngle = (pointA, pointB) => {
    const lat1 = pointA.latitude;
    const lon1 = pointA.longitude;
    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;

    const angle = (Math.atan2(lon2 - lon1, lat2 - lat1) * 180) / Math.PI;

    return angle;
  };
  const renderComponent = () => {
    return (
      <View style={styles.innerContainer}>
        <TouchableOpacity
          onPress={() =>
            bottomContentType === 'PAYMENT' ? initScreen() : openDrawer()
          }
          style={styles.topToggle}>
          <Icon
            name={bottomContentType === 'PAYMENT' ? 'arrow-back' : 'menu'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <MapView
          ref={mapRef}
          initialRegion={position}
          // region={position}
          style={styles.map}
          showsUserLocation={Platform.OS === 'ios' ? showCurrent : false}
          onMapReady={() => {
            setReady(true);
            if (depature && destination) {
              const angle = calculateRotationAngle(depature, destination);
              setRotationAngle(angle);
              mapRef.current.animateCamera({
                heading: angle,
                duration: 0,
              });
            }
          }}
          onLongPress={async region => {
            if (bottomContentType !== 'INITIAL') {
              return;
            }
            const cord = region.nativeEvent.coordinate;
            const res = await getAddressFromCoordinates(
              cord.latitude,
              cord.longitude,
            );
            if (res.long_name) {
              var temp = {};
              temp.name = res.long_name;
              temp.latitude = cord.latitude;
              temp.longitude = cord.longitude;
              flag || depature !== '' ? setDestination(temp) : setDep(temp);
              flag || depature !== ''
                ? desRef.current?.setAddressText(res.long_name)
                : depRef.current?.setAddressText(res.long_name);
              setFlag(!flag);
            }
          }}
          userInterfaceStyle={'light'}>
          {depature.latitude && bottomContentType !== 'CURRENT' && (
            <Marker
              onPress={() => {
                // setAddressesModalVisible(true);
              }}
              tracksViewChanges={Platform.OS === 'ios' ? true : false}
              style={styles.marker}
              coordinate={{
                latitude: depature.latitude,
                longitude: depature.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: 0.1921,
              }}>
              <View style={styles.markerDescriptionContainer}>
                {depature.name && destination.name ? (
                  <View style={styles.markerLeftDep}>
                    <Text style={{color: COLORS.white}}>
                      {Math.round(duration)}
                    </Text>
                    <Text
                      style={{color: COLORS.white}}
                      textStyle="body10Regular">
                      mins
                    </Text>
                  </View>
                ) : (
                  <View style={styles.markerLeftDep} />
                )}
                <Text>
                  {depature?.name?.substr(
                    0,
                    Platform.OS === 'android' ? 30 : 20,
                  ) + '...'}
                </Text>
                <Icon
                  name="chevron-forward-outline"
                  size={16}
                  color={COLORS.black}
                />
              </View>
              <DotBlue />
            </Marker>
          )}
          {destination.latitude && (
            <Marker
              // onPress={() => setAddressesModalVisible(true)}
              tracksViewChanges={Platform.OS === 'ios' ? true : false}
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: 0.1921,
              }}
              style={styles.marker}>
              <View style={styles.markerDescriptionContainer}>
                <View
                  style={[styles.markerLeft, {backgroundColor: COLORS.primary}]}
                />
                <Text>
                  {destination?.name?.substr(
                    0,
                    Platform.OS === 'android' ? 30 : 20,
                  ) + '...'}
                </Text>
                <Icon
                  name="chevron-forward-outline"
                  size={16}
                  color={COLORS.black}
                />
              </View>
              <DotGreen />
            </Marker>
          )}
          {/* Drirver's location */}
          {driverLocation &&
            driverLocation.latitude &&
            bottomContentType === 'CURRENT' && (
              <Marker
                anchor={{x: 0.5, y: 0.5}}
                // tracksViewChanges={Platform.OS === 'ios' ? true : false}
                coordinate={{
                  latitude: driverLocation.latitude,
                  longitude: driverLocation.longitude,
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.1921,
                }}>
                <FastImage
                  style={[
                    styles.taxiMapIcon,
                    // {
                    //   transform: [{rotateZ: rotateZ + 'deg'}],
                    // },
                  ]}
                  source={require('../../../../assets/image/taxi1.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </Marker>
            )}
          {depature.latitude &&
            destination.latitude &&
            isReady &&
            directionFlag && (
              <MapViewDirections
                origin={depature}
                destination={destination}
                apikey={GoogleAPIKey}
                mode={'DRIVING'}
                strokeWidth={3}
                strokeColor={COLORS.primary}
                onStart={params => {
                  setLoading(true);
                }}
                onReady={result => {
                  setDistance(result.distance);
                  setDuration(result.duration);
                  setCalDuration(calcuateDuration(result.duration));
                  setLoading(false);
                }}
                onError={errorMessage => {
                  setLoading(false);
                  setDuration('');
                }}
              />
            )}
        </MapView>
        {bottomContentType === 'INITIAL' && (
          <BottomActions
            navigation={navigation}
            type={type}
            setType={setType}
            setAddressesModalVisible={setAddressesModalVisible}
            depRef={depRef}
            showCurrent={showCurrent}
            setCurrent={setCurrent}
            updateLocation={updateLocation}
            setDep={setDep}
            desRef={desRef}
            setDestination={setDestination}
            searchVehicle={searchVehicle}
            loading={loading}
          />
        )}
        {bottomContentType === 'PAYMENT' && (
          <PaymentSection
            duration={formatedDuration}
            rideRequestData={rideRequestData}
            setBottomContentType={setBottomContentType}
            setJourneyData={setJourneyData}
          />
        )}
        {bottomContentType === 'CONNECTING' && (
          <ConnectingSection
            setAddressesModalVisible={setBottomContentType}
            setBottomContentType={setBottomContentType}
            setJourneyData={setJourneyData}
            setDep={setDep}
            setDestination={setDestination}
            journeyData={journeyData}
          />
        )}
        {bottomContentType === 'CURRENT' && (
          <RideSection
            setDep={setDep}
            setDestination={setDestination}
            setBottomContentType={setBottomContentType}
            journeyData={journeyData ?? currentJourney}
            setDriver={setDriver}
            setDirectionFlag={setDirectionFlag}
          />
        )}
        <Modal
          style={styles.fullScreenModal}
          swipeDirection={['down']}
          isVisible={addressesModalVisible}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setAddressesModalVisible(false)}>
              <Icon name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Your route</Text>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.scrollContainer}>
        {renderComponent()}
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
    accountId: auth.accountId,
    token: auth.token,
  };
};

export default connect(mapStateToProps, {})(HomeScreen);
