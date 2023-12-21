import {
  ActivityIndicator,
  Alert,
  Linking,
  View,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../styles';
import React, {useEffect, useState} from 'react';
import {Button, COLORS, Text} from '@components';
import {getNFTBalance} from '../../../utils/api/nft';
import {
  journeyAPI,
  nftAPI,
  paymentAPI,
} from '../../../../../screens/HomeScreens/utils';
import {useSelector} from 'react-redux';
import {styles as paymentStyles} from './styles';
import {displayErrors} from '@app/src/helpers';
import {detailTransaction} from '@app/src/screens/HomeScreens/utils/api/payment';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import svgs from '@app/assets/svg/svgs';
import Icon from 'react-native-vector-icons/AntDesign';
import {currencyFormat} from '@app/src/helpers';

export const PaymentSection = ({
  navigation,
  duration,
  rideRequestData,
  setBottomContentType,
  setJourneyData,
}) => {
  const [nft, setNFT] = useState(0);
  const [nftStatus, setStatus] = useState('0');
  const [nftData, setNFTData] = useState('');
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topId, setTopUpId] = useState('');
  const [topPaid, setTopPaid] = useState(false);
  const [discount, setDiscount] = useState('');
  const [focus, setFocus] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [price, setPrice] = useState(rideRequestData?.prices?.[0].price);

  const accountId = useSelector(state => state.auth.accountId);
  const apiToken = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.auth.user);

  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    if (!link) {
      return;
    }
    if (link.url === 'https://bloxmoveuser.page.link/complete-topup') {
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => {
      unsubscribe();
    };
  }, [topId]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async notification => {
      handleNotification(notification);
    });

    return () => {
      unsubscribe();
    };
  }, [topId]);
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(notification => {
      handleNotification(notification);
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
  const handleNotification = async notification => {
    if (notification.data.data) {
      const notiType = notification.data.type;
      if (notiType === 'TOP_UP_COMPLETED') {
        console.log(topId, 'notification');
        getTopUp(topId);
      } else if (notiType === 'TOP_UP_FAILED') {
        Alert.alert('Fail');
      }
    }
  };

  useEffect(() => {
    getNFT();
  }, [getNFT]);

  const getNFT = React.useCallback(() => {
    setLoading(true);
    getNFTBalance(currentUser.ticketId)
      .then(response => {
        if (response.success === true) {
          setNFT(response.data[4]);
          setStatus(response.data[1]);
          setNFTData(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [currentUser.ticketId]);

  const payToken = async () => {
    Keyboard.dismiss();
    if (nftStatus !== 0) {
      navigation.navigate('ErrorScreen', {
        title: 'Ride not ended',
        subTitle:
          'You currently can’t make payment for a ride because your pervious ride was not ended successfully. Either contact driver to do that or contact our support service ',
        buttonTitle: 'Ok',
      });
      return;
    }
    setLoading(true);
    approveTicket();
  };

  const payTopUp = async () => {
    Keyboard.dismiss();
    if (paid) {
      setLoading(true);
      approveTicket();
      return;
    }
    const data = {
      ticketId: parseFloat(currentUser.ticketId),
      credit:
        Math.round(price) - parseInt(nft, 10) > 650
          ? Math.round(price) - parseInt(nft, 10)
          : Math.round(price),
      currency: 'NGN',
    };
    setLoading(true);
    paymentAPI
      .createTopUp(data, apiToken)
      .then(async response => {
        console.log(response.data.data.id, 'setTopUpId');
        setTopPaid(true);
        setTopUpId(response.data.data.id);
        await Linking.openURL(response.data.data.paymentCommand.value[0]);
      })
      .catch(error => {
        setLoading(false);
        if (error.response) {
          if (
            error.response.data.message === 'Please add your bank information.'
          ) {
            Alert.alert(error.response.data.message, '', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => navigation.navigate('ChangeBank'),
              },
            ]);
            return;
          }
        }
        console.log('topupError');
        displayErrors(error);
      });
  };

  const getTopUp = id => {
    detailTransaction(apiToken, id)
      .then(async response => {
        const status = response.data.data.status;
        console.log('getTopUp', id);
        if (status === 'SUCCESS') {
          setPaid(true);
          approveTicket();
        }
        if (status === 'FAILURE') {
          // clearInterval(intervalId.current);
          Alert.alert('Fail');
        }
      })
      .catch(error => {
        console.log(error.response?.data);
      });
  };

  const approveTicket = () => {
    nftAPI
      .approveNFTicket(currentUser.ticketId, accountId)
      .then(response => {
        if (response.success === true) {
          console.log('approved Ticket');
          creatingJourney(apiToken);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const creatingJourney = () => {
    const data = {
      journeySearchId: rideRequestData.id,
      priceId: rideRequestData?.prices?.[0].id,
    };
    journeyAPI
      .createJourney(data, apiToken)
      .then(response => {
        // dispatch(journeyAPI.getCurrentJourney(apiToken));
        setJourneyData(response?.data?.data);
        setBottomContentType('CONNECTING');
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  // Coupon
  const applyCoupon = () => {
    setLoading(true);
    Keyboard.dismiss();
    const data = {
      codeName: discount,
    };
    journeyAPI
      .applyCoupon(apiToken, data, rideRequestData.id)
      .then(response => {
        setLoading(false);
        const res = response.data;
        if (res.falseDesc) {
          Alert.alert('', res.falseDesc);
        } else {
          setNewPrice(res.passengerPrice);
          setPrice(res.passengerPrice);
        }
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  return (
    <>
      <View style={styles.bottomComponent}>
        {(!topPaid || (topPaid && !loading)) && (
          <>
            <View style={paymentStyles.content}>
              <View style={paymentStyles.flexContainer}>
                <FastImage
                  style={paymentStyles.image}
                  resizeMode="contain"
                  source={require('@app/assets/image/icons/taxi.png')}
                />
                <View>
                  <Text textStyle="body18Regular">bloXride</Text>
                  <Text>Trip duration: {duration}</Text>
                </View>
              </View>
              <View style={paymentStyles.priceContainer}>
                {newPrice !== '' && (
                  <Text textStyle="body18Regular">
                    ₦ {currencyFormat(newPrice)}
                  </Text>
                )}
                <Text
                  style={newPrice !== '' ? paymentStyles.oldPrice : ''}
                  textStyle={
                    newPrice === '' ? 'body18Regular' : 'body14Regular'
                  }>
                  ₦ {currencyFormat(rideRequestData?.prices?.[0]?.price)}
                </Text>
              </View>
            </View>
            {/* Discount */}
            <View
              style={
                focus
                  ? paymentStyles.activePaymentInput
                  : paymentStyles.selectPaymentInput
              }>
              <svgs.Discount />
              <TextInput
                style={
                  newPrice === ''
                    ? paymentStyles.inputContainer
                    : paymentStyles.inputGreyContainer
                }
                placeholder="Enter discount code"
                placeholderTextColor={COLORS.body}
                value={discount}
                onChangeText={e => setDiscount(e)}
                editable={newPrice !== '' || loading ? false : true}
              />
              {newPrice === '' && (
                <TouchableOpacity
                  style={paymentStyles.rightArrow}
                  disabled={loading || newPrice}
                  onPress={applyCoupon}>
                  <Icon name="arrowright" size={24} color={COLORS.black} />
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={loading ? paymentStyles.lgGreyText : paymentStyles.lgText}
              textStyle="body18Regular">
              {price <= nft ? 'NFTicket' : 'Card payment'}
            </Text>
            {price > nft && (
              <Text textStyle="body10Regular" style={{color: COLORS.body}}>
                You don't have enough in your NFTicket
              </Text>
            )}
            {price <= nft && (
              <Text textStyle="body10Regular" style={{color: COLORS.body}}>
                By confirming, a sum of ₦{currencyFormat(price)} will be deducted from your
                NFTicket.
              </Text>
            )}
            <Text />
            {loading && <ActivityIndicator />}
            {price <= nft ? (
              <Button
                onPress={payToken}
                disabled={price > nft || loading}
                // onPress={() => setBottomContentType('CONNECTING')}
                title="Confirm order"
              />
            ) : (
              <Button
                disabled={loading}
                onPress={payTopUp}
                title={`Pay ₦${
                  Math.round(price) - parseInt(nft, 10) > 650
                    ? Math.round(price) - parseInt(nft, 10)
                    : Math.round(price)
                }`}
              />
            )}
          </>
        )}
        {topPaid && loading && (
          <>
            <Text textStyle="body18Semibold">Processing payment</Text>
            <Text style={paymentStyles.description}>
              Payment is being sent to Your NFTicket.
            </Text>
            <Progress.Circle
              size={90}
              endAngle={0.7}
              thickness={3}
              indeterminate={true}
              color={COLORS.primary}
              borderWidth={4}
              style={paymentStyles.progress}
            />
          </>
        )}
      </View>
    </>
  );
};
