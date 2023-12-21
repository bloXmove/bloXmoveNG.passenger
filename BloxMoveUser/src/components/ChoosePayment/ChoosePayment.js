import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import dynamicStyles from './styles';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect, useSelector} from 'react-redux';
import deviceStorage from '../../screens/utils/AuthDeviceStorage';
import './../../../global.js';
import './../../../shim.js';
import CheckBox from '@react-native-community/checkbox';
import {CreditCardInput} from 'react-native-credit-card-input';
import {displayErrors} from '../../helpers/displayErrors';
import {journeyAPI, nftAPI, paymentAPI} from '../../screens/HomeScreens/utils';
import {detailTransaction} from '../../screens/HomeScreens/utils/api/payment';

const ChoosePayment = props => {
  const {
    appStyles,
    item,
    type,
    navigation,
    seat,
    passNameList,
    currentFlag,
    journey,
    nft,
    nftStatus,
    nftData,
    getNFT,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const blxmRate = useSelector(state => state.payment.blxm);
  const usdcRate = useSelector(state => state.payment.usdc);
  const currentUser = useSelector(state => state.auth.user);
  const accountId = useSelector(state => state.auth.accountId);
  const apiToken = useSelector(state => state.auth.token);
  let intervalId = useRef(null);

  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [payType, setPaymentType] = useState(0);
  const [pay, setPay] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [walletType, setType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardItem, setCard] = useState([]);
  const [topupId, setTopId] = useState('');
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    getCardData();
    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  // Card Payment
  const payOrder = () => {
    if (newCard === true && cardComplete === false) {
      Alert.alert('Please input valid card information');
      return;
    }
    if (newCard === false && !cardItem.number) {
      Alert.alert('Please add a new card');
      return;
    }
    setPay(true);
    setCardModalVisible(false);
    setNewCard(false);
    payTopUp();
  };
  const changeCard = newItem => {
    if (!newItem.valid) {
      setCardComplete(false);
      return;
    }
    setCard(newItem.values);
    setCardComplete(true);
  };
  const payToken = async () => {
    if (nftStatus !== '0') {
      Alert.alert(
        "You can't pay with NFTicket beacause you haven't completed your journey.",
      );
      return;
    }
    setPaymentType(2);
    setLoading(true);
    nftAPI
      .approveNFTicket(currentUser.ticketId, accountId)
      .then(response => {
        if (response.success === true) {
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

  const acceptCash = async paymentType => {
    setPaymentType(paymentType);
    setLoading(true);
    try {
      nftAPI
        .approveNFTicket(currentUser.ticketId, accountId)
        .then(response => {
          if (response.success === true) {
            creatingJourney(apiToken);
          } else {
            setLoading(false);
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  };
  // Top Up Payment
  const getTopUp = id => {
    intervalId.current = setInterval(() => {
      detailTransaction(apiToken, id)
        .then(async response => {
          const status = response.data.data.status;
          if (status === 'SUCCESS') {
            setPaid(true);
            clearInterval(intervalId.current);
            await nftAPI
              .approveNFTicket(currentUser.ticketId, accountId)
              .then(res => {
                if (res.success === true) {
                  creatingJourney(apiToken);
                } else {
                  setLoading(false);
                }
              })
              .catch(error => {
                console.log(error);
                setLoading(false);
              });
          }
          if (status === 'FAILURE') {
            clearInterval(intervalId.current);
            Alert.alert('Fail');
          }
        })
        .catch(error => {
          console.log(error.response?.data);
        });
    }, 1000);
  };
  const payTopUp = async () => {
    setPaymentType(0);
    setLoading(true);
    // If the passenger already paid, just approve signature
    if (paid) {
      nftAPI
        .approveNFTicket(currentUser.ticketId, accountId)
        .then(response => {
          if (response.success === true) {
            creatingJourney(apiToken);
          } else {
            setLoading(false);
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
      return;
    }
    const data = {
      ticketId: parseFloat(currentUser.ticketId),
      credit: Math.round(item.price),
      currency: 'NGN',
    };
    paymentAPI
      .createTopUp(data, apiToken)
      .then(async response => {
        const topId = response.data.data.id;
        setTopId(topId);
        await Linking.openURL(response.data.data.paymentCommand.value[0]);
        getTopUp(topId);
        complete(topId);
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
        displayErrors(error);
      });
  };
  const complete = id => {
    paymentAPI
      .completeTopUp(id, apiToken)
      .then(async response => {})
      .catch(error => {
        setLoading(false);
        console.log('Detail TopUp:', error.response);
        displayErrors(error);
      });
  };
  // End of Top up Payment

  // Create Journey
  const creatingJourney = () => {
    const data = {
      journeySearchId: journey.id,
      priceId: item.id,
    };
    journeyAPI
      .createJourney(data, apiToken)
      .then(response => {
        if (type === 0) {
          clearInterval(intervalId.current);
          navigation.navigate('NewRequest', {
            appStyles: appStyles,
            seat: seat,
            passNameList: passNameList,
            item: response.data.data,
            currentFlag,
          });
          // setLoading(false);
        } else {
          navigation.navigate(type === 0 ? 'BookHail' : 'BookInt', {
            appStyles: appStyles,
            seat: seat,
            passNameList: passNameList,
            item: response.data.data,
            currentFlag,
          });
        }
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };
  // Cards
  const getCardData = async () => {
    const cards = await deviceStorage.getCard();
    cards.map(value => {
      if (value.default && value.default === true) {
        setCard(value);
      }
    });
  };
  return (
    <View style={styles.cardBox}>
      {item.price > nft && (
        <View style={styles.boxContainer}>
          <View style={styles.boxBottomHeader}>
            <Text style={styles.title}>Pay with card</Text>
            <TouchableOpacity
              style={styles.btnContainer}
              disabled={loading && payType === 0 ? true : false}
              onPress={() => {
                payTopUp();
                // setCardModalVisible(true);
              }}>
              {loading && payType === 0 ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Book</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.boxBody}>
            <View style={styles.flexContainer}>
              <Text style={styles.text}>NGN {item.price}</Text>
            </View>
          </View>
        </View>
      )}
      {item.price > nft && (
        <View style={styles.boxContainer}>
          <View style={styles.boxBottomHeader}>
            <Text style={styles.title}>Pay with wallet</Text>
            <TouchableOpacity
              style={styles.btnDisableContainer}
              // disabled={loading && payType === 1 ? true : false}
              disabled={true}
              onPress={() => {
                acceptCash(1);
              }}>
              {loading && payType === 1 ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Book</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.boxBody}>
            <TouchableOpacity
              onPress={() => setType(true)}
              style={styles.reasonContainer}>
              <CheckBox
                disabled={false}
                value={walletType}
                boxType="square"
                style={styles.checkBox}
                tintColors={{
                  true: appStyles.colorSet[colorScheme].mainColor,
                  false: appStyles.colorSet[colorScheme].grey0,
                }}
                onChange={() => setType(true)}
              />
              <Text style={styles.text}>
                BLXM Balance: {(item.price * blxmRate).toFixed(2)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType(false)}
              style={styles.reasonContainer}>
              <CheckBox
                disabled={false}
                value={!walletType}
                boxType="square"
                style={styles.checkBox}
                tintColors={{
                  true: appStyles.colorSet[colorScheme].mainColor,
                  false: appStyles.colorSet[colorScheme].grey0,
                }}
                onChange={() => setType(false)}
              />
              <Text style={styles.text}>
                USDC Balance: {(item.price * usdcRate).toFixed(2)}
              </Text>
            </TouchableOpacity>
            <View style={styles.flexContainer}>
              <Text style={styles.text}>
                {'NGN ' +
                  item.price * (seat ? seat : 1) +
                  ' = ' +
                  (item.price * (seat ? seat : 1) * blxmRate).toFixed(2) +
                  ' BLXM'}
              </Text>
            </View>
          </View>
        </View>
      )}
      {item.price <= nft && (
        <View style={styles.boxContainer}>
          <View style={styles.boxBottomHeader}>
            <Text style={styles.title}>Pay with NFTicket</Text>
            <TouchableOpacity
              style={styles.btnContainer}
              disabled={loading && payType === 2 ? true : false}
              onPress={() => {
                payToken();
              }}>
              {loading && payType === 2 ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Book</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.boxBody}>
            <View style={styles.flexContainer}>
              <Text style={styles.text}>NGN {item.price}</Text>
            </View>
          </View>
        </View>
      )}
      <Modal
        swipeDirection={['down']}
        // style={styles.modalView}
        avoidKeyboard={true}
        isVisible={cardModalVisible}>
        <View style={styles.Modalcontent}>
          <View style={styles.centerContainer}>
            <Text style={styles.title}>
              {newCard === false ? 'Use Saved Card' : 'New Card'}
            </Text>
            <Icon
              name="close-outline"
              onPress={() => {
                setNewCard(false);
                setCardModalVisible(false);
              }}
              color={appStyles.colorSet[colorScheme].blackColor}
              size={30}
            />
          </View>
          {newCard === true ? (
            <CreditCardInput
              cardScale={0}
              labelStyle={styles.text}
              inputStyle={styles.cardInputBox}
              inputContainerStyle={styles.inputContainerStyle}
              onChange={cItem => changeCard(cItem)}
            />
          ) : (
            <View style={styles.inputContainer}>
              <Icon name="card-outline" style={styles.cardIcon} size={30} />
              <TextInput
                value={cardItem.number ? cardItem.number : ''}
                placeholder=""
                style={styles.inputBox}
                editable={false}
              />
            </View>
          )}
          <View style={styles.btnBoxContainer}>
            <TouchableOpacity
              style={[styles.btnContainer, styles.halfWidth]}
              onPress={() => payOrder()}>
              <Text style={styles.btnText}>Pay</Text>
            </TouchableOpacity>
            {newCard === false ? (
              <TouchableOpacity
                style={[styles.btnContainer, styles.halfWidth]}
                onPress={() => {
                  setNewCard(true);
                }}>
                <Text style={styles.btnText}>New Card</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {})(ChoosePayment);
