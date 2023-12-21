import {TouchableOpacity, View} from 'react-native';
import {styles} from '../../styles';
import {styles as connectingStyles} from './styles';
import React, {useEffect, useState} from 'react';
import {Button, COLORS, Text} from '@components';
import {journeyAPI} from '@app/src/screens/HomeScreens/utils';
import {getJourneyCurrent} from '@app/src/screens/HomeScreens/utils/api/jonuney';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import messaging from '@react-native-firebase/messaging';

export const ConnectingSection = ({
  setBottomContentType,
  journeyData,
  setJourneyData,
  setDep,
  setDestination,
}) => {
  const apiToken = useSelector(state => state.auth.token);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoadng] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    messaging().onNotificationOpenedApp(notification => {
      handleNotification(notification);
    });
    messaging().onMessage(async notification => {
      handleNotification(notification);
    });
  }, []);
  const handleNotification = async notification => {
    if (notification.data.data) {
      const data = JSON.parse(notification.data.data);
      const notiType = notification.data.type;
      if (
        notiType === 'JOURNEY_REQUEST_TIMEOUT' &&
        data.id === journeyData.id
      ) {
        await setDep('');
        await setDestination('');
        await setBottomContentType('INITIAL');
        return;
      }
      getAcceptedRequest();
    }
  };
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    handleNotification(remoteMessage);
  });
  // Cancel Request Before Driver Arrives
  const cancelAction = async () => {
    setLoadng(true);
    journeyAPI
      .journeyRequestCancel(journeyData?.id, apiToken)
      .then(async () => {
        await setDep('');
        await setDestination('');
        await setBottomContentType('INITIAL');
        setLoadng(false);
      })
      .catch(async error => {
        await setDep('');
        await setDestination('');
        await setBottomContentType('INITIAL');
        setLoadng(false);
        // displayErrors(error);
      });
  };
  const getAcceptedRequest = () => {
    getJourneyCurrent(apiToken)
      .then(response => {
        // setJourneyData(response?.data?.data);
        // dispatch(journeyAPI.getCurrentJourney(apiToken));
        setBottomContentType('CURRENT');
      })
      .catch(error => {
        console.log('Journey has been changed');
      });
  };

  return (
    <View style={styles.bottomComponent}>
      <Text textStyle="body18Semibold">Connecting to nearby drivers</Text>
      <Text style={connectingStyles.description}>
        Once accepted, a driver will be on the way to you. This may take some
        minutes
      </Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={connectingStyles.cancel}>
        <Text textStyle="body14SemiBold" style={connectingStyles.cancelText}>
          Cancel Ride
        </Text>
      </TouchableOpacity>
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        avoidKeyboard={true}
        style={connectingStyles.modal}
        isVisible={modalVisible}>
        <View style={connectingStyles.modalContent}>
          <Text textStyle="body18Semibold" style={connectingStyles.centered}>
            Cancel Ride?
          </Text>
          <Text style={connectingStyles.centered}>
            You are about to cancel your ride. You might wait longer for another
            if you cancel.
            {/* You are about to cancel your ride. you might wait longer for another
            if you cancel. A cancelation fee of ₦0 will be deducted from your */}
            {/* balance. */}
          </Text>
          <Button
            containerStyle={{
              backgroundColor: loading ? COLORS.disabled : COLORS.error,
            }}
            title="Yes, Cancel"
            disabled={loading}
            onPress={() => cancelAction()}
          />
          <Button
            type="outlined"
            title="No"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};
