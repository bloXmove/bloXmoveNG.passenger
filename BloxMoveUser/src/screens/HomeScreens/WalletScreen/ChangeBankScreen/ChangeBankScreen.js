import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, COLORS, Input, Text} from '../../../../components';
import {updateBank} from '../../utils/api/bank';
import {useSelector, connect, useDispatch} from 'react-redux';
import {setUserBank} from '../../redux/actions';
import {displayErrors} from '../../../../helpers/displayErrors';
import {getNamePattern, required} from '@app/src/utils/validation';
import {Controller, useForm} from 'react-hook-form';
import {InputSelect} from '@app/src/components/Input/InputSelect';
import Icon from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';

const ChangeBankScreen = props => {
  const {navigation} = props;
  const currentBank = useSelector(state => state.payment.bank);
  const listBanks = useSelector(state => state.payment.bankList);
  const mappedBanks = listBanks.map(item => ({
    label: item?.name ?? item?.code,
    value: item?.code,
  }));
  const apiToken = useSelector(state => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [bank, setBank] = useState(currentBank?.bankCode);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const bankNameRef = useRef();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: {isValid: isFormValid},
  } = useForm({
    mode: 'onChange',
  });

  const saveCard = async ({firstName, lastName, accountNumber, bankCode}) => {
    setLoading(true);
    const data = {
      bankCode: bankCode,
      bankName: mappedBanks.find(item => item.value === bankCode)?.label,
      bankAccountNumber: accountNumber,
      bankAccountName: 'string',
      firstName,
      lastName,
    };
    updateBank(apiToken, data)
      .then(response => {
        dispatch(setUserBank({data: data}));
        setLoading(false);
        navigation.goBack();
      })
      .catch(error => {
        setLoading(false);
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
              <Icon name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text textStyle="body18Semibold">Edit bank account</Text>
          </View>
          <Controller
            name="accountNumber"
            control={control}
            defaultValue={currentBank.bankAccountNumber ?? ''}
            rules={{
              required,
            }}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Input
                label="Account Number"
                placeholder="Account Number"
                error={error?.message}
                keyboardType="decimal-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => firstNameRef.current?.focus()}
              />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue={currentBank.firstName ? currentBank.firstName : ''}
            rules={{
              required,
              pattern: getNamePattern(),
            }}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Input
                label="First name"
                ref={firstNameRef}
                placeholder="Enter first name"
                error={error?.message}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue={currentBank?.lastName ?? ''}
            rules={{
              required,
              pattern: getNamePattern(),
            }}
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <Input
                label="Last name"
                ref={lastNameRef}
                placeholder="Enter last name"
                error={error?.message}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => {
                  Platform.OS === 'android'
                    ? bankNameRef.current?.focus()
                    : bankNameRef.current?.togglePicker(true);
                }}
              />
            )}
          />
          <Controller
            name="bankCode"
            control={control}
            rules={{required}}
            defaultValue={currentBank?.bankCode}
            // defaultValue={
            //   mappedBanks.find(item => item.value === currentBank?.bankCode)
            //     .value ?? mappedBanks?.[0]?.value
            // }
            render={({field: {onChange, value, ...field}}) => (
              <InputSelect
                items={mappedBanks}
                onClose={() => {
                  if (!value && mappedBanks.length !== 0) {
                    onChange(mappedBanks[0].value);
                  }
                }}
                ref={Platform.OS === 'ios' ? bankNameRef : null}
                pickerProps={{
                  ref: Platform.OS === 'android' ? bankNameRef : null,
                }}
                value={bank}
                // value={currentBank?.bankCode}
                onValueChange={temp => {
                  setBank(temp);
                  onChange(temp);
                }}
                inputProps={{
                  ...field,
                  label: 'Bank Name',
                  value,
                  onChangeText: onChange,
                }}
              />
            )}
          />
        </View>
        <Button
          onPress={handleSubmit(saveCard)}
          disabled={!isFormValid || loading}
          title="Save Changes"
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {})(ChangeBankScreen);
