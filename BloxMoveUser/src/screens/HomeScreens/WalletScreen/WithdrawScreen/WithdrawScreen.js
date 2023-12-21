import React, {useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {displayErrors} from '../../../../helpers/displayErrors';
import {nftAPI, paymentAPI} from '../../utils';
import {Button, COLORS, Input, Text} from '@components';
import {Controller, useForm} from 'react-hook-form';
import {required, validateInteger} from '@app/src/utils/validation';
import {styles} from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';

const WithdrawScreen = props => {
  const {navigation} = props;
  // paymentType = ENGN | BLXM | USDC
  const [paymentType, setPaymentType] = useState('ENGN');
  const [loading, setLoading] = useState(false);

  const currentBank = useSelector(state => state.payment.bank);
  const currentUser = useSelector(state => state.auth.user);
  const accountId = useSelector(state => state.auth.accountId);
  const apiToken = useSelector(state => state.auth.token);

  const {
    control,
    handleSubmit,
    getValues,
    formState: {isValid: isFormValid},
  } = useForm({
    mode: 'onChange',
  });

  const confirmPayment = async ({amount}) => {
    setLoading(true);
    const amountRes = await nftAPI.getNFTBalance(currentUser.ticketId);
    if (
      currentBank.bankAccountName === null ||
      currentBank.bankAccountNumber === null
    ) {
      setLoading(false);
      Alert.alert('Please add bank account name');
      return;
    }
    if (parseFloat(amountRes.data[4]) < parseFloat(amount)) {
      setLoading(false);
      Alert.alert(
        'Insufficient funds',
        'You do not have enough money to make the withdrawal',
      );
      return;
    }
    const withdrawaStatus = await paymentAPI.checkWithdrawStatus(apiToken);
    if (withdrawaStatus !== false) {
      withdrawaStatus === true
        ? Alert.alert(
            '',
            'Please wait for a while, there has already a processing withdraw order there.',
          )
        : '';
      setLoading(false);
      return;
    }
    const data = {
      currency: paymentType,
      amount: parseFloat(amount, 2).toFixed(2),
    };
    const allowStatus = await paymentAPI.checkAllowance(data, apiToken);
    if (allowStatus === false) {
      Alert.alert(
        '',
        "Can't be refunded now, first ride reward is smaller than total ride spending",
      );
      setLoading(false);
      return;
    }
    if (amountRes.data[1] !== 0) {
      navigation.navigate('ErrorScreen', {
        title: 'NFTicket not available',
        subTitle:
          'You currently can’t withdraw because your NFTicket is being used. Kindly withdraw after ride is completed.',
        buttonTitle: 'Ok',
      });
      setLoading(false);
      return;
    }
    const refundRes = await nftAPI.refund(
      amount,
      currentUser.ticketId,
      accountId,
    );
    if (refundRes.success !== true) {
      setLoading(false);
      return;
    }
    const refundResult = await nftAPI.doRefund(
      currentUser.ticketId,
      refundRes.data[1], // withdrawnAmount
    );
    if (refundResult.success !== true) {
      setLoading(false);
      return;
    }
    paymentAPI
      .createWithdraw(data, apiToken)
      .then(async response => {
        const command = response.data.data.paymentCommand;
        retryWithdrawal(command, amount);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  const retryWithdrawal = async (data, amount) => {
    const signature = await nftAPI.approveERC(
      amount,
      accountId,
      data.value[0],
      data.value[1],
    );
    if (signature.success !== true) {
      Alert.alert('Please authorize payment', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => retryWithdrawal(data)},
      ]);
      setLoading(false);
      return;
    }
    navigation.navigate('Transaction');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.inner}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <AntDesignIcon name="arrowleft" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Withdraw</Text>
          </View>
          <Controller
            name="amount"
            control={control}
            defaultValue="251"
            rules={{
              required,
              pattern: validateInteger(),
              min: {
                value: 251,
                message:
                  'The amount must be greater than 250. Please enter a valid value',
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
                // changeAmount(value);
              />
            )}
          />

          <View>
            <Text textStyle="body18Semibold">Destination</Text>
            <TouchableOpacity
              style={styles.bankButton}
              onPress={() => setPaymentType('ENGN')}>
              <Icon
                name={
                  paymentType === 'ENGN'
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                color={paymentType === 'ENGN' ? COLORS.primary : COLORS.form}
                size={20}
              />
              <View style={[styles.info, styles.flexOne]}>
                <Text textStyle="body14SemiBold">Bank account</Text>
                <View style={styles.row}>
                  <Text style={styles.flexOne}>Bank Name: </Text>
                  <Text style={[styles.flexOne, {color: COLORS.body}]}>
                    {currentBank.bankName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.flexOne}>Bank No:</Text>
                  <Text style={[styles.flexOne, {color: COLORS.body}]}>
                    {currentBank.bankAccountNumber}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.flexOne}>Account Holder:</Text>
                  <Text style={[styles.flexOne, {color: COLORS.body}]}>
                    {currentBank.firstName} {currentBank.lastName}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChangeBank');
                }}>
                <Icon name="pencil" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.divider} />
            {/* <TouchableOpacity
              style={styles.row}
              onPress={() => setPaymentType('BLXM')}>
              <Icon
                name={
                  paymentType === 'BLXM' || paymentType === 'USDC'
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                color={
                  paymentType === 'BLXM' || paymentType === 'USDC'
                    ? COLORS.primary
                    : COLORS.form
                }
                size={20}
              />
              <View style={[styles.info, styles.flexOne]}>
                <Text>Wallet</Text>
                <View style={styles.row}>
                  <Text style={styles.flexOne}>Address:</Text>
                  <Text style={[styles.flexOne, {color: COLORS.body}]}>
                    {accountId}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.row, styles.center]}
                  onPress={() => setPaymentType('BLXM')}>
                  <Icon
                    name={
                      paymentType === 'BLXM'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    color={paymentType === 'BLXM' ? COLORS.primary : COLORS.form}
                    size={20}
                  />
                  <Text style={styles.info}>BLXM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.row, styles.center]}
                  onPress={() => setPaymentType('USDC')}>
                  <Icon
                    name={
                      paymentType === 'USDC'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    color={paymentType === 'USDC' ? COLORS.primary : COLORS.form}
                    size={20}
                  />
                  <Text style={styles.info}>USDC</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <Text style={styles.description}>
              The equivalent of your amount in tokens will be sent to our wallet.
            </Text>
            <Text>
              ₦{getValues('amount')} ={' '}
              {((blxmRate / ngnRate) * getValues('amount')).toFixed(2)} BLXM and{' '}
              {((usdcRate / ngnRate) * getValues('amount')).toFixed(2)} USDC
            </Text> */}
          </View>
          <View>
            <Text textStyle="body14Regular" style={{color: COLORS.body}}>
              A sum of{' '}
              <Text
                textStyle="body14Semibold"
                style={{color: COLORS.body, fontWeight: 'bold'}}>
                NGN 150
              </Text>{' '}
              will be deducted from every withdrawal by our Payment provider.
            </Text>
          </View>
        </View>

        <Button
          disabled={!isFormValid || loading}
          title="Withdraw"
          onPress={handleSubmit(confirmPayment)}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default WithdrawScreen;
