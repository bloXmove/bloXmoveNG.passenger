import React from 'react';
import {View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button, COLORS, Text} from '../../../../components';
import Moment from 'moment';
import {Addresses} from '../components/Addresses/Addresses';
import {Driver} from '../components/Driver/Driver';
import {styles} from './styles';
import {Map} from '../components/Map/Map';
import {useDispatch} from 'react-redux';
import {setCurrent} from '../../redux/actions';
import {calcuateDuration} from '@app/src/helpers';
import {currencyFormat} from '@app/src/helpers';

const CompletedScreen = props => {
  const {navigation, route} = props;
  const item = route.params.item;
  const jourRequest = route?.params?.jourRequest;
  const requestData = route.params.item?.journeyRequest;
  const driver = route.params.item?.driver;
  const backFlag = route.params.backFlag;

  const dispatch = useDispatch();

  const resetData = () => {
    dispatch(setCurrent({data: ''}));
    navigation.navigate('MyRides');
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (backFlag ? resetData() : navigation.goBack())}>
            <Icon name="arrowleft" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text textStyle="body18Semibold">Ride Details</Text>
        </View>
        <Addresses from={requestData?.from?.name} to={requestData?.to?.name} />
        <Map from={jourRequest?.from} to={jourRequest?.to} />
        <Driver driver={driver} />

        <View style={styles.content}>
          <Text textStyle="body14SemiBold">Payment</Text>
          <View style={styles.paymentInfo}>
            <Text textStyle="body18Regular">{item.paymentType}</Text>
            <Text style={styles.gray}>
              ₦{currencyFormat(requestData.price)}
            </Text>
          </View>

          <Text textStyle="body14SemiBold">Other Details</Text>
          <View style={styles.details}>
            <Text style={styles.detailsTitle}>Ride ID</Text>
            <Text style={styles.detailsDescription}>{item?.id}</Text>
          </View>

          {item.status !== 'PASSENGER_CANCELED' &&
            item.status !== 'DRIVER_CANCELED' && (
              <>
                <View style={styles.details}>
                  <Text style={styles.detailsTitle}>Arrival time:</Text>
                  <Text style={styles.detailsDescription}>
                    {Moment.unix(
                      (Number.parseInt(jourRequest.pickUpTime, 10) +
                        item.eta.toFixed(0) * 60000) /
                        1000,
                    ).format('h:mm a Do MMM, YYYY')}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailsTitle}>Departure time:</Text>
                  <Text style={styles.detailsDescription}>
                    {Moment.unix(jourRequest.pickUpTime / 1000).format(
                      'h:mm a Do MMM, YYYY',
                    )}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailsTitle}>Ride duration:</Text>
                  <Text style={styles.detailsDescription}>
                    {calcuateDuration(item.eta)}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailsTitle}>Distance:</Text>
                  <Text style={styles.detailsDescription}>
                    {(item.distance / 1000).toFixed(2)} km
                  </Text>
                </View>
              </>
            )}
          {(item.status === 'PASSENGER_CANCELED' ||
            item.status === 'DRIVER_CANCELED') && (
            <>
              <View style={styles.details}>
                <Text style={styles.detailsTitle}>Cancellation reason:</Text>
                <Text style={styles.detailsDescription}>
                  {item.cancelReason.replace(/_/g, ' ')}
                </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.detailsTitle}>Cancellation fee:</Text>
                <Text style={styles.detailsDescription}>
                  ₦{currencyFormat(item.cancellationFee)}
                </Text>
              </View>
            </>
          )}
          {item.reviewRemark === null && item.status === 'DRIVER_END' && (
            <Button
              title="Rate Driver"
              onPress={() =>
                props.navigation.navigate('Review', {
                  item: item,
                })
              }
              containerStyle={styles.btn}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompletedScreen;
