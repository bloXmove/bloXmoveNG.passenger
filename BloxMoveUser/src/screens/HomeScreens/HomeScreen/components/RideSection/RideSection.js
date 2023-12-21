import {Alert, TouchableOpacity, View, Animated} from 'react-native';
import {styles} from '../../styles';
// import {styles as connectingStyles} from './styles';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, COLORS, Text} from '@components';
import {
  journeyStart,
  journeyDetail,
} from '@app/src/screens/HomeScreens/utils/api/jonuney';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import {styles as connectingStyles} from '../ConnectingSection/styles';
import {
  Driver,
  Pin,
} from '@app/src/screens/HomeScreens/BookedScreen/components';
import moment from 'moment';
import {
  displayErrors,
  openSetting,
  getCurrentData,
  calcuateDuration,
} from '@app/src/helpers';
import {nftAPI} from '@app/src/screens/HomeScreens/utils';
import {styles as rideStyles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {setCurrent} from '@app/src/screens/HomeScreens/redux/actions';
import {useSharedValue} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  journeyCancel,
  getCurrentJourneyData,
} from '@app/src/screens/HomeScreens/utils/api/jonuney';
import Icon from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-radio-buttons-group';
import {reasonList} from '@app/src/lib/contants';
import {currencyFormat} from '@app/src/helpers';

export const RideSection = ({
  setDep,
  setDestination,
  setBottomContentType,
  setDriver,
  // journeyData,
}) => {
  const {navigate} = useNavigation();
  const journeyData = useSelector(state => state.journey.currentJourney);
  const journeyRequest = journeyData?.journeyRequest;
  const driver = journeyData?.driver;

  const dispatch = useDispatch();

  const apiToken = useSelector(state => state.auth.token);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  // const [status, setStatus] = useState(journeyData?.status);
  let status = journeyData?.status;
  const [loading, setLoading] = useState(false);
  const accountId = useSelector(state => state.auth.accountId);
  const [acc, setAcc] = useState('');
  // Gesture
  const marginBottom = useRef(new Animated.Value(-150)).current;
  const startPos = useSharedValue(0);
  // Update Driver's location
  let intervalId = useRef(null);

  // Need to integreate firebase to update the location real time
  // useEffect(() => {
  //   intervalId.current = setInterval(() => {
  //     getCurrentJourneyData(apiToken)
  //       .then(response => {
  //         if (response.success === true) {
  //           setDriver(response.data.driver.location);
  //         }
  //       })
  //       .catch(error => {
  //         console.log('Error to get the detail of the journey', error.response);
  //       });
  //   }, 5000);
  //   return () => {
  //     clearInterval(intervalId.current);
  //   };
  // }, []);
  useEffect(() => {
    console.log('status in Ride', status);
    changeStatus();
  }, [journeyData]);

  const changeStatus = async () => {
    if (!status) {
      return;
    }
    if (
      status !== 'STARTED' &&
      status !== 'WAIT_FOR_DRIVER_ARRIVAL' &&
      status !== 'DRIVER_ARRIVED'
    ) {
      clearInterval(intervalId.current);
      setCancelModalVisible(false);
      await setDep('');
      await setDestination('');
      await setBottomContentType('INITIAL');
      navigate('Completed', {
        item: journeyData,
        jourRequest: journeyRequest,
        requestData: journeyRequest,
        backFlag: true,
      });
      dispatch(
        setCurrent({
          data: '',
        }),
      );
    }
  };

  const detailRequest = id => {
    journeyDetail(id, apiToken)
      .then(response => {
        dispatch(
          setCurrent({
            data: response.data.data,
          }),
        );
        setDriver(response.data.data.driver.location);
      })
      .catch(error => {
        console.log('Error to get the detail of the journey', error.response);
      });
  };

  // Cancel Request Before Driver Arrives
  const cancelAction = async () => {
    setCancelModalVisible(true);
  };
  const cancelRide = async () => {
    setLoading(true);
    const curData = await getCurrentData();
    if (curData === 'fail') {
      setLoading(false);
      openSetting('Please allow location permission to start ride');
      return;
    }
    const signature = await nftAPI.getSignature(accountId, curData);
    if (signature.success !== true) {
      setLoading(false);
      Alert.alert('Please approve cancellation', '');
      return;
    }
    const data = {
      cancellationReason: acc === '' ? 'NO_REASON' : acc,
    };
    journeyCancel(journeyData.id, data, apiToken)
      .then(response => {
        detailRequest(journeyData.id);
        setCancelModalVisible(false);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };
  // End of cancel

  const startRide = async () => {
    setLoading(true);
    const data = await getCurrentData();
    if (data === 'fail') {
      setLoading(false);
      openSetting('Please allow location permission to start ride');
      return;
    }
    if (data === 'false') {
      setLoading(false);
      Alert.alert('', "We can't get your location.");
      return;
    }
    const signature = await nftAPI.getSignature(accountId, data);
    if (signature.success !== true) {
      Alert.alert('Please authorize payment', '');
      setLoading(false);
      return;
    }
    data.signature = signature.signature;
    journeyStart(journeyData.id, data, apiToken)
      .then(response => {
        detailRequest(journeyData.id);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  const tap = Gesture.Pan()
    .runOnJS(true)
    .onStart(event => {
      startPos.value = event.y;
    })
    .onEnd(e => {
      if (startPos.value < e.y) {
        Animated.timing(marginBottom, {
          toValue: -150,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(marginBottom, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    });

  return (
    <Animated.View
      style={[
        styles.bottomSmComponent,
        {
          marginBottom: marginBottom,
        },
      ]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={tap}>
          <View>
            <View style={rideStyles.handle} />
            <View>
              <Text textStyle="body18Semibold">
                {status === 'WAIT_FOR_DRIVER_ARRIVAL'
                  ? 'Driver on the way to you'
                  : status === 'DRIVER_ARRIVED'
                  ? 'Driver has arrived'
                  : 'Ride has started. Enjoy'}
              </Text>
              <Text style={{color: COLORS.body}}>
                {status === 'WAIT_FOR_DRIVER_ARRIVAL'
                  ? `${calcuateDuration(journeyData?.eta)} away. will arrive `
                  : status === 'DRIVER_ARRIVED'
                  ? 'Your Ride Code is: '
                  : 'Estimated time of arrival '}
                <Text textStyle="body14SemiBold">
                  {status === 'WAIT_FOR_DRIVER_ARRIVAL'
                    ? moment(Date.now())
                        .add(journeyData.eta.toFixed(0), 'minutes')
                        .format('hh:mm a')
                    : status === 'DRIVER_ARRIVED'
                    ? journeyData?.code
                    : journeyData?.pickUpTime
                    ? moment(journeyData?.pickUpTime).format('hh:mm a')
                    : moment(
                        Number.parseInt(journeyRequest?.pickUpTime, 10) +
                          journeyData?.eta?.toFixed(0) * 60000,
                      ).format('hh:mm a')}
                </Text>
              </Text>
              <View style={rideStyles.divider} />
              {status === 'DRIVER_ARRIVED' && (
                <Button
                  onPress={() => startRide()}
                  disabled={loading}
                  containerStyle={rideStyles.button}
                  title="Start Ride"
                />
              )}
              <Text style={rideStyles.subHeader} textStyle="body14SemiBold">
                Driver Details
              </Text>
              <Driver
                driver={driver}
                containerStyles={{justifyContent: 'space-between', padding: 0}}
              />
              <Text style={rideStyles.subHeader} textStyle="body14SemiBold">
                Destination
              </Text>
              <View style={rideStyles.row}>
                <Pin color="green" />
                <Text
                  textStyle="body18Regular"
                  style={rideStyles.addressBottomText}
                  numberOfLines={1}>
                  {'  '}
                  {journeyData?.to
                    ? journeyData?.to?.name
                    : journeyRequest?.to?.name}
                </Text>
              </View>
              <Text style={rideStyles.subHeader} textStyle="body14SemiBold">
                Payment
              </Text>
              {journeyData?.paymentType && (
                <Text style={styles.text}>{journeyData.paymentType}</Text>
              )}
              <Text style={{color: COLORS.body}}>
                ₦{currencyFormat(journeyData?.price)}
              </Text>
              {(status === 'WAIT_FOR_DRIVER_ARRIVAL' ||
                status === 'DRIVER_ARRIVED') && (
                <TouchableOpacity
                  onPress={cancelAction}
                  disabled={loading}
                  style={connectingStyles.cancel}>
                  <Text
                    textStyle="body18Semibold"
                    style={connectingStyles.cancelText}>
                    Cancel Ride
                  </Text>
                </TouchableOpacity>
              )}
              <Modal
                avoidKeyboard={true}
                style={connectingStyles.cancelModal}
                isVisible={cancelModalVisible}>
                <View style={connectingStyles.cancelModalContent}>
                  <View style={styles.header}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() =>
                        setCancelModalVisible(!cancelModalVisible)
                      }>
                      <Icon
                        name="arrow-back-outline"
                        size={24}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                    <Text textStyle="body18Semibold">Cancelation Reason</Text>
                  </View>
                  <View style={styles.cancelBoxContainer}>
                    <Text textStyle="body14Regular" style={rideStyles.topText}>
                      Please tell us the reason why you are canceling your ride
                      .
                    </Text>
                    {reasonList.map(temp => {
                      return (
                        <TouchableOpacity
                          onPress={() => setAcc(temp)}
                          key={temp}
                          style={rideStyles.selectContainer}>
                          <RadioButton
                            selected={acc === temp ? true : false}
                            color={COLORS.primary}
                            borderColor={COLORS.form}
                            size={20}
                          />
                          {/* <CheckBox
                            disabled={false}
                            value={acc === temp ? true : false}
                            style={rideStyles.checkBox}
                            boxType="circle"
                            tintColors={{
                              true: COLORS.primary,
                              false: COLORS.body,
                            }}
                          /> */}
                          <Text
                            textStyle="body18Regular"
                            style={rideStyles.text}>
                            {temp.replace(/_/g, ' ')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <Button
                    title="Submit"
                    disabled={loading}
                    onPress={cancelRide}
                    containerStyle={rideStyles.btnCancel}
                  />
                </View>
              </Modal>
              <Modal
                onSwipeComplete={() => setModalVisible(false)}
                avoidKeyboard={true}
                style={connectingStyles.modal}
                isVisible={modalVisible}>
                <View style={connectingStyles.modalContent}>
                  <Text
                    textStyle="body18Semibold"
                    style={connectingStyles.centered}>
                    Cancel Ride?
                  </Text>
                  <Text style={connectingStyles.centered}>
                    You are about to cancel your ride. you might wait longer for
                    another if you cancel. A cancelation fee of ₦
                    {currencyFormat(200)} will be deducted from your balance.
                  </Text>
                  <Button
                    containerStyle={{backgroundColor: COLORS.error}}
                    title="Yes, Cancel"
                    onPress={() => cancelAction()}
                    disabled={loading}
                  />
                  <Button
                    type="outlined"
                    title="No"
                    disabled={loading}
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </Modal>
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
};
