import React, {useRef, useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Image,
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
import Modal from 'react-native-modal';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import {Dash} from '../../../components';
import {GoogleAPIKey} from '../../../lib/config';
import {journeyDetail, journeyStart} from '../utils/api/jonuney';
import {getCurrentData, openSetting} from '../../../helpers/getPermission';
import {displayErrors} from '../../../helpers/displayErrors';
import {useSelector} from 'react-redux';
import Moment from 'moment';
import {nftAPI} from '../utils';

const BookedHailScreen = props => {
  const {route, navigation} = props;
  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;
  const item = route.params.item;
  const driver = item.driver;
  const jourRequest = item.journeyRequest;
  const colorScheme = useColorScheme();
  let currentTheme = appStyles.navThemeConstants[colorScheme];
  const styles = dynamicStyles(appStyles, colorScheme);
  const [status, setStatus] = useState(item.status);
  const [showCurrent, setCurrent] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQRModalVisible] = useState(false);
  const [accepted, setAccept] = useState(false);
  const [durtaion, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();
  const [position, setPosition] = useState({
    latitude: item.from ? item.from.latitude : jourRequest.from.latitude,
    longitude: item.from ? item.from.longitude : jourRequest.from.longitude,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0421,
  });
  let intervalId = useRef(null);
  const apiToken = useSelector(state => state.auth.token);
  const accountId = useSelector(state => state.auth.accountId);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
    return unsubscribe;
  }, [navigation]);

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
    journeyDetail(item.id, apiToken)
      .then(response => {
        // setItem(response.data.data);
        setStatus(response.data.data.status);
      })
      .catch(error => {
        console.log('Error to get the detail of the journey', error.response);
      });
  };

  const confirmActive = () => {
    startRide();
    setQRModalVisible(false);
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
  const trackCurrent = () => {
    Geolocation.getCurrentPosition(
      pos => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
        setCurrent(true);
      },
      error => {},
    );
  };
  const startRide = async () => {
    const data = await getCurrentData();
    if (data === 'fail') {
      openSetting('Please allow location permission to start ride');
      return;
    }
    const signature = await nftAPI.getSignature(accountId, data);
    if (signature.success !== true) {
      Alert.alert('Please authorize payment', '');
      setLoading(false);
      return;
    }
    data.signature = signature.signature;
    journeyStart(item.id, data, apiToken)
      .then(response => {
        setLoading(false);
        setAccept(true);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };
  const changeStatus = () => {
    if (status === 'DRIVER_ARRIVED') {
      setQRModalVisible(true);
      return;
    }
  };
  const review = async () => {
    navigation.navigate('Review', {
      item: item,
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
          origin={item.from ? item.from : jourRequest.from}
          destination={item.to ? item.to : jourRequest.to}
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
            latitude: item.from
              ? item.from.latitude
              : jourRequest.from.latitude,
            longitude: item.from
              ? item.from.longitude
              : jourRequest.from.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}>
          <Svgs.Current size={30} />
        </Marker>
        <Marker
          coordinate={{
            latitude: item.to ? item.to.latitude : jourRequest.to.latitude,
            longitude: item.to ? item.to.longitude : jourRequest.to.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}>
          <Svgs.Pin size={30} />
        </Marker>
      </MapView>
      {loading && (
        <View style={styles.emptyBookContainer}>
          <ActivityIndicator color="black" />
        </View>
      )}
      {!loading && (
        <View style={styles.bookContainer}>
          <TouchableOpacity onPress={() => trackCurrent()} style={styles.track}>
            <Svgs.Track size={20} style={styles.track} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              status !== 'WAIT_FOR_DRIVER_ARRIVAL' ? changeStatus() : ''
            }
            style={styles.headerContainer}>
            {status === 'WAIT_FOR_DRIVER_ARRIVAL' && (
              <Text style={styles.title}>
                Driver Arrives in {item.eta.toFixed(0)} minutes
              </Text>
            )}
            {status !== 'WAIT_FOR_DRIVER_ARRIVAL' && (
              <Text style={styles.title}>{status.replace(/_/g, ' ')}</Text>
            )}
            <Text style={styles.phoneText}>{driver?.phoneNumber}</Text>
            <Image
              style={styles.makerImg}
              source={
                jourRequest && jourRequest.vehicleType === 'CAR'
                  ? appStyles.iconSet.taxiIcon
                  : appStyles.iconSet.taxiIcon
              }
              size={200}
              color="white"
            />
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
                {item.from ? item.from.name : jourRequest.from.name}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.addressBottomText} numberOfLines={1}>
                {item.to ? item.to.name : jourRequest.to.name}
              </Text>
            </View>
          </View>
          <View>
            <View style={styles.divider} />
            <View style={styles.hailContainer}>
              <View style={styles.centerContainer}>
                <Text style={styles.subTitle}>Departure Time</Text>
                <Text style={styles.depTimeText}>
                  {item.pickUpTime
                    ? Moment(item.pickUpTime).format('HH:mm')
                    : Moment(
                        Number.parseInt(jourRequest.pickUpTime, 10),
                      ).format('HH:mm')}
                </Text>
              </View>
              <View style={styles.centerContainer}>
                <Text style={styles.subTitle}>Estimated Arrival Time</Text>
                <Text style={styles.depTimeText}>
                  {item.pickUpTime
                    ? Moment(item.pickUpTime).format('HH:mm')
                    : Moment(
                        Number.parseInt(jourRequest.pickUpTime, 10) +
                          item.eta.toFixed(0) * 60000,
                      ).format('HH:mm')}
                </Text>
              </View>
            </View>
            <View style={[styles.footerContainer, styles.flexContainer]}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.btnSmContainer}>
                <Text style={styles.btnText}>More Info</Text>
              </TouchableOpacity>
              {status === 'DRIVER_ARRIVED' && (
                <TouchableOpacity
                  style={styles.btnSmContainer}
                  onPress={() => changeStatus()}>
                  {loading && status === 'DRIVER_ARRIVED' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.btnText}>Start Ride</Text>
                  )}
                </TouchableOpacity>
              )}
              {(status === 'WAIT_FOR_DRIVER_ARRIVAL' ||
                status === 'DRIVER_ARRIVED') && (
                <TouchableOpacity
                  style={styles.btnSmCancelContainer}
                  onPress={() => {
                    props.navigation.navigate('CancelRide', {
                      appStyles: appStyles,
                      item: item,
                      back: true,
                    });
                  }}>
                  <Text style={styles.btnText}>Cancel Ride</Text>
                </TouchableOpacity>
              )}
              {status === 'DRIVER_END' && (
                <TouchableOpacity
                  style={styles.btnSmContainer}
                  disabled={loading && status === 'DRIVER_END' ? true : false}
                  onPress={() => review()}>
                  {loading && status === 'DRIVER_END' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.btnText}>Review</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      <Modal
        swipeDirection={['down']}
        style={styles.modalView}
        onSwipeComplete={() => setModalVisible(false)}
        isVisible={isModalVisible}>
        <View style={styles.Modalcontent}>
          <View style={styles.headerContainer}>
            {status === 'WAIT_FOR_DRIVER_ARRIVAL' && (
              <Text style={styles.title}>
                Driver Arrives in {item.eta.toFixed(0)} minutes
              </Text>
            )}
            {status !== 'WAIT_FOR_DRIVER_ARRIVAL' && (
              <Text style={styles.title}>{status.replace(/_/g, ' ')}</Text>
            )}
            <Text style={styles.phoneText}>{driver?.phoneNumber}</Text>
            <Image
              style={styles.makerImg}
              source={
                jourRequest && jourRequest.vehicleType === 'CAR'
                  ? appStyles.iconSet.taxiIcon
                  : appStyles.iconSet.taxiIcon
              }
              size={200}
              color="white"
            />
          </View>
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
              <Text style={styles.addressTopText}>
                {item.from ? item.from.name : jourRequest.from.name}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.addressBottomText}>
                {item.to ? item.to.name : jourRequest.to.name}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          {status !== 'WAIT' && (
            <View style={styles.bodyBottomContainer}>
              <Text style={styles.text}>Departure Time : </Text>
              <Text style={styles.text}>
                {item.pickUpTime
                  ? Moment(item.pickUpTime).format('HH:mm')
                  : Moment(Number.parseInt(jourRequest.pickUpTime, 10)).format(
                      'HH:mm',
                    )}
              </Text>
            </View>
          )}
          {status !== 'WAIT' && (
            <View style={styles.bodyBottomContainer}>
              <Text style={styles.text}>Estimated Arrival : </Text>
              <Text style={styles.text}>
                {item.pickUpTime
                  ? Moment(item.pickUpTime).format('HH:mm')
                  : Moment(
                      Number.parseInt(jourRequest.pickUpTime, 10) +
                        item.eta.toFixed(0) * 60000,
                    ).format('HH:mm')}
              </Text>
            </View>
          )}
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Duration : </Text>
            <Text style={styles.text}>{durtaion.toFixed(0)} min</Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Service provider : </Text>
            <Text style={styles.text}>
              {driver?.firstName} {driver?.lastName}
            </Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Driver's tel.. : </Text>
            <Text style={styles.text}>{driver?.phoneNumber}</Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Vehicle : </Text>
            <Text style={styles.text}>{driver?.vehicleManufacturer}</Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Vehicle license : </Text>
            <Text style={styles.text}>{driver?.vehicleRegistrationNo}</Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Vehicle color : </Text>
            <Text style={styles.text}>{driver?.vehicleColor}</Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.text}>Payment Type : </Text>
            <Text style={styles.text}>
              {item.paymentType ? item.paymentType : ''}
            </Text>
          </View>
          <View style={styles.bodyBottomContainer}>
            <Text style={styles.title}>Price: NGN {item.price} </Text>
          </View>
          <View style={[styles.footerContainer, styles.flexContainer]}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.btnFullContainer}>
              <Text style={styles.btnText}>Track Hide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* QR Modal */}
      <Modal
        swipeDirection={['down']}
        onSwipeComplete={() => setQRModalVisible(false)}
        style={styles.qrModelView}
        isVisible={qrModalVisible}>
        <View style={styles.QRModalContent}>
          <Text style={styles.depIntText}>Compare code with driver's code</Text>
          <Text style={styles.title}>{item.code}</Text>
          <View style={styles.qrFooter}>
            <TouchableOpacity
              onPress={() => setQRModalVisible(false)}
              style={styles.btnCancelContainer}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmActive()}
              style={styles.btnContainer}>
              <Text style={styles.btnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

BookedHailScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default BookedHailScreen;
