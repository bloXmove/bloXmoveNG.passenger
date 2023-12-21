import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  useColorScheme,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import {journeyDetail, journeyCancel} from '../../utils/api/jonuney';
import {displayErrors} from '../../../../helpers/displayErrors';
import {useSelector} from 'react-redux';
import {getSignature} from '../../utils/api/nft';
import {getCurrentData, openSetting} from '../../../../helpers/getPermission';
import {COLORS, Button, Text} from '@components';

const CancelRideScreen = props => {
  const {route, navigation} = props;
  const appConfig = route.params.appConfig;
  const appStyles = route.params.appStyles;
  const item = route.params.item;
  const setDep = route.params.setDep;
  const setDestination = route.params.setDestination;
  const setBottomContentType = route.params.setBottomContentType;
  const backFlag = route.params.back ? true : false;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const [acc, setAcc] = useState('');
  const [loading, setLoading] = useState(false);
  const accountId = useSelector(state => state.auth.accountId);
  const apiToken = useSelector(state => state.auth.token);
  const reasonList = [
    'NO_REASON',
    'LONG_PICKUP_TIME',
    'THE_DRIVER_ARRIVED_AT_THE_WRONG_PICKUP_LOCATION',
    'THE_DRIVER_DOES_NOT_MATCH_THE_DESCRIPTION',
    'THE_CAR_DOES_NOT_MATCH_THE_DESCRIPTION',
    'THE_RIDE_CODE_DOES_NOT_MATCH',
    'THE_DRIVER_ASKED_ME_TO_CANCEL',
    'OTHER_REASON',
  ];

  const cancelRide = async () => {
    const curData = await getCurrentData();
    setLoading(true);
    if (curData === 'fail') {
      setLoading(false);
      openSetting('Please allow location permission to start ride');
      return;
    }
    const signature = await getSignature(accountId, curData);
    if (signature.success !== true) {
      setLoading(false);
      Alert.alert('Please approve cancellation', '');
      return;
    }
    const data = {
      cancellationReason: acc === '' ? 'NO_REASON' : acc,
    };
    journeyCancel(item.id, data, apiToken)
      .then(response => {
        getJourney(apiToken, item.id);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };
  const getJourney = async (token, id) => {
    journeyDetail(id, token)
      .then(async response => {
        await setBottomContentType('INITIAL');
        await setDep('');
        await setDestination('');
        navigation.navigate('Completed', {
          item: response.data.data,
          jourRequest: response.data.data.journeyRequest,
          appStyles: appStyles,
          appConfig: appConfig,
          backFlag: true,
        });
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text textStyle="body18Semibold">Cancelation Reason</Text>
        </View>
        <View style={styles.cancelBoxContainer}>
          <Text textStyle="body14Regular" style={styles.topText}>
            Please tell us the reason why you are canceling your ride .
          </Text>
          {reasonList.map(temp => {
            return (
              <TouchableOpacity
                onPress={() => setAcc(temp)}
                key={temp}
                style={styles.selectContainer}>
                <CheckBox
                  disabled={false}
                  value={acc === temp ? true : false}
                  style={styles.checkBox}
                  tintColors={{
                    true: appStyles.colorSet[colorScheme].mainColor,
                    false: appStyles.colorSet[colorScheme].grey0,
                  }}
                />
                <Text textStyle="body18Regular" style={styles.text}>
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
          containerStyle={styles.btnCancel}
        />
        {/* <View style={styles.cancelContainer}>
          <TouchableOpacity
            style={[styles.btnCancelContainer, styles.fullWidth]}
            disabled={loading}
            onPress={cancelRide}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Cancel Ride</Text>
            )}
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

CancelRideScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default CancelRideScreen;
