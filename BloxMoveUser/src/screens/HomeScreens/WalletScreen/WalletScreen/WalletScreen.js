import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector, useDispatch} from 'react-redux';
import {changeNFTBalance} from '../../utils/api/nft';
import authDeviceStorage from '@app/src/screens/utils/AuthDeviceStorage';
import {CreditCardInput} from 'react-native-credit-card-input';
import {Button, COLORS, Input, Text} from '@components';
import {styles} from './styles';
import {currencyFormat} from '@app/src/helpers';

const WalletScreen = props => {
  const {navigation} = props;
  const currentUser = useSelector(state => state.auth.user);
  const accountId = useSelector(state => state.auth.accountId);
  const nft = useSelector(state => state.payment.nft);
  const [loading, setLoading] = useState(false);

  const [cardList, setCardList] = useState([]);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardComplete, setComplete] = useState(false);
  const [cardData, setCard] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    const cards = await authDeviceStorage.getCard();
    setCardList(cards);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNFT();
    });
    return unsubscribe;
  }, [navigation]);

  const getNFT = async () => {
    setLoading(true);
    await dispatch(changeNFTBalance(currentUser.ticketId));
    setLoading(false);
  };

  // const selectCard = async (_item, index) => {
  //   cardList.map((_value, key) => {
  //     cardList[key].default = false;
  //   });
  //   cardList[index].default = true;
  //   setCardList(cardList);
  //   await authDeviceStorage.setCard(cardList);
  // };

  const changeCard = item => {
    if (!item.valid) {
      setComplete(false);
      return;
    }
    setComplete(true);
    setCard(item.values);
  };

  const addCard = async () => {
    if (!cardComplete) {
      Alert.alert('', 'Please input valid card information');
      return;
    }
    let exist = false;
    cardList.map(item => {
      if (
        cardData.number === item.number &&
        item.walletAddress &&
        item.walletAddress.toUpperCase() === accountId.toUpperCase()
      ) {
        exist = true;
      }
    });
    if (exist) {
      Alert.alert(
        'This card number is duplicated!',
        'Please input another card number',
      );
      return;
    }
    cardData.default = false;
    cardData.walletAddress = accountId;
    setLoading(true);
    setCardModalVisible(false);
    setCardList([...cardList, cardData]);
    await authDeviceStorage.setCard([...cardList, cardData]);
    setLoading(false);
  };

  const deleteCard = (item, index) => {
    Alert.alert('Do you want to remove this card?', '', [
      {text: 'Yes', onPress: () => confirmDelete(item, index)},
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  const confirmDelete = async (_item, index) => {
    setLoading(true);
    cardList.splice(index, 1);
    // if (activedIndex === index) {
    //   setIndex(0);
    // }
    setCardList(cardList);
    await authDeviceStorage.setCard(cardList);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrowleft" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Wallet</Text>
          </View>
          {loading ? (
            <ActivityIndicator style={{height: 200}} color="black" />
          ) : (
            <View style={styles.balance}>
              <Text textStyle="body18Regular">NFTicket Balance</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Transaction');
                }}
                style={styles.balanceActions}>
                <Text textStyle="header24">
                  NGN(₦) {nft[4] ? currencyFormat(nft[4]) : 0}
                  {/* NGN(₦) {props.nft[4] ? props.nft[4] : 0} */}
                </Text>
                <Icon name="right" size={20} color={COLORS.black} />
              </TouchableOpacity>
              <View style={styles.balanceActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('TopUp')}
                  activeOpacity={0.9}
                  style={[styles.button, {backgroundColor: COLORS.primary}]}>
                  <Icon name="plus" size={20} color={COLORS.white} />
                  <Text
                    textStyle="body14SemiBold"
                    style={{color: COLORS.white}}>
                    {' '}
                    Top Up
                  </Text>
                </TouchableOpacity>
                <Text>{'     '}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Withdraw')}
                  style={[styles.button, {backgroundColor: COLORS.error}]}
                  activeOpacity={0.9}>
                  <Icon name="minus" size={20} color={COLORS.white} />
                  <Text
                    textStyle="body14SemiBold"
                    style={{color: COLORS.white}}>
                    {' '}
                    Withdraw
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {/* <View style={styles.cards}>
          <Text textStyle="body14SemiBold">Saved Payment Method</Text>
          {cardList.map(
            (item, index) =>
              item.walletAddress === accountId && (
                <View style={styles.card} key={index}>
                  <Text textStyle="body18Regular">
                    ···· ···· ···· {item.number.substring(14)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => deleteCard(item, index)}>
                    <Icon name="close" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ),
          )}
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={() => setCardModalVisible(!cardModalVisible)}>
            <Icon name="plus" size={20} color={COLORS.primary} />
            <Text style={styles.addCardText} textStyle="body14SemiBold">
              Add new card
            </Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.divider} />
        <View style={styles.cards}>
          <Text style={styles.promotions} textStyle="body14SemiBold">
            Promotions
          </Text>

          <Input
            label="Promo code"
            placeholder="Enter promo code"
            leftComponent={
              <Icon
                name="tago"
                color={COLORS.form}
                size={24}
                style={styles.proIcon}
              />
            }
          />
        </View>

        <Modal
          onSwipeComplete={() => setCardModalVisible(false)}
          style={styles.modal}
          avoidKeyboard={true}
          isVisible={cardModalVisible}>
          <View>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setCardModalVisible(false);
                }}>
                <Icon name="arrowleft" size={24} color={COLORS.black} />
              </TouchableOpacity>
              <Text textStyle="body18Semibold">New card</Text>
            </View>
            <CreditCardInput
              labels={{
                number: 'Card Number123',
                expiry: 'Expiry Date',
                cvc: 'CCV',
              }}
              labelStyle={styles.cardInputLabel}
              inputStyle={styles.cardInput}
              inputContainerStyle={styles.cardInputContainer}
              onChange={item => changeCard(item)}
              cardScale={0}
              additionalInputsProps={{
                cvc: {
                  secureTextEntry: true,
                },
              }}
            />
          </View>

          <Button
            disabled={!cardComplete}
            title="Add Card"
            onPress={() => addCard()}
          />
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;
