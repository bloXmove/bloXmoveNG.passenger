import {Button, COLORS, Input, Text} from '@components';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import authDeviceStorage from '@app/src/screens/utils/AuthDeviceStorage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Controller, useForm} from 'react-hook-form';
import {required, validateInteger} from '@app/src/utils/validation';
import {useSelector} from 'react-redux';
import {createTopUp} from '../../utils/api/payment';
import {displayErrors} from '@app/src/helpers';
import {styles} from './styles';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export const TopUp = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiToken = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.auth.user);
  const accountId = useSelector(state => state.auth.accountId);
  const currentBank = useSelector(state => state.payment.bank);

  const getCardData = async () => {
    const cards = await authDeviceStorage.getCard();
    setCardList(cards);
  };

  useEffect(() => {
    getCardData();
  }, []);
  const handleDynamicLink = link => {
    if (!link) {
      return;
    }
    if (link.url === 'https://bloxmoveuser.page.link/complete-topup') {
      navigation.navigate('Transaction');
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  const {
    control,
    handleSubmit,
    formState: {isValid: isFormValid},
  } = useForm({
    mode: 'onChange',
  });

  const payWithCard = async ({amount}) => {
    setLoading(true);
    const data = {
      ticketId: parseFloat(currentUser.ticketId),
      credit: parseInt(amount, 10),
      currency: 'NGN',
    };
    createTopUp(data, apiToken)
      .then(async response => {
        if (response.data.data.id) {
          await Linking.openURL(response.data.data.paymentCommand.value[0]);
        } else {
          setLoading(false);
        }
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <AntDesignIcon name="arrowleft" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Balance Top up</Text>
          </View>
          <View style={styles.input}>
            <Controller
              name="amount"
              control={control}
              defaultValue="0"
              rules={{
                required,
                pattern: validateInteger(),
                min: {
                  value: 1000,
                  message: 'Must be greater than 1000',
                },
              }}
              render={({
                field: {onChange, value, onBlur},
                fieldState: {error},
              }) => (
                <Input
                  label="NGN"
                  placeholder="Enter Amount"
                  error={error?.message}
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="done"
                />
              )}
            />
          </View>

          {/* <Text textStyle="body14SemiBold">Saved Payment Method</Text> */}
          <View>
            {/* {cardList.map(
              (item, index) =>
                item.walletAddress === accountId && (
                  <TouchableOpacity
                    onPress={() => setSelectedItem(index)}
                    style={[styles.card, styles.row]}
                    key={index}>
                    <View style={styles.row}>
                      <Image
                        style={styles.icon}
                        resizeMode="contain"
                        source={require('@app/assets/image/icons/visa.png')}
                      />
                      <Text textStyle="body18Regular">
                        ···· {item.number.substring(14)}
                      </Text>
                    </View>
                    <Icon
                      name={
                        selectedItem === index
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      color={
                        selectedItem === index ? COLORS.primary : COLORS.form
                      }
                      size={20}
                    />
                  </TouchableOpacity>
                ),
            )} */}
            {/* <TouchableOpacity
              style={[styles.card, styles.row]}
              onPress={() => setSelectedItem(cardList.length)}>
              <View style={styles.row}>
                <Image
                  style={styles.icon}
                  resizeMode="contain"
                  source={require('@app/assets/image/icons/valora.png')}
                />
                <Text textStyle="body18Regular">Valora Wallet</Text>
              </View>
              <Icon
                name={
                  selectedItem === cardList.length
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                color={
                  selectedItem === cardList.length ? COLORS.primary : COLORS.form
                }
                size={20}
              />
            </TouchableOpacity> */}
          </View>
        </View>
        {loading && <ActivityIndicator color="green" />}
        <Button
          onPress={handleSubmit(
            selectedItem === cardList.length ? payWithCard : payWithCard,
          )}
          disabled={!isFormValid || loading}
          title="Top Up"
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
