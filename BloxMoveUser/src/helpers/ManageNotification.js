import {useEffect, useCallback} from 'react';
import messaging from '@react-native-firebase/messaging';
import {useSelector, useDispatch} from 'react-redux';
import {journeyAPI} from '@app/src/screens/HomeScreens/utils';
import {setCurrent} from '@app/src/screens/HomeScreens/redux/actions';
import {changeNFTBalance} from '@app/src/screens/HomeScreens/utils/api/nft';
import {updateTransactionList} from '@app/src/screens/HomeScreens/redux/actions';

const ManageNotification = () => {
  const dispatch = useDispatch();
  const apiToken = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.auth.user);
  const listTransactions = useSelector(state => state.payment.transactionList);
  const journeyData = useSelector(state => state.journey.currentJourney);

  const handNotification = useCallback(async notification => {
    if (notification.data.data) {
      // console.log(notification);
      const data = JSON.parse(notification.data.data);
      const notiType = notification.data.type;
      if (
        data.journeyId &&
        (notiType === 'JOURNEY_CANCELLED' ||
          notiType === 'JOURNEY_DRIVER_CANCELLED' ||
          notiType === 'JOURNEY_DRIVER_ENDED' ||
          notiType === 'JOURNEY_DRIVER_END_FAILED')
      ) {
        journeyAPI
          .journeyDetail(data.journeyId, apiToken)
          .then(response => {
            dispatch(
              setCurrent({
                data: response.data.data,
              }),
            );
          })
          .catch(error => {
            console.log(
              'Error to get the detail of the journey',
              error.response,
            );
          });
      } else {
        dispatch(journeyAPI.getCurrentJourney(apiToken));
      }
      if (notiType === 'TOP_UP_COMPLETED' || notiType === 'REFUND_COMPLETED') {
        dispatch(changeNFTBalance(currentUser.ticketId));
      }
      // Manage Top Up and Withdraw
      if (
        notiType === 'WITHDRAW_COMPLETED' ||
        notiType === 'WITHDRAW_FAILED' ||
        notiType === 'TOP_UP_COMPLETED' ||
        notiType === 'TOP_UP_FAILED'
      ) {
        const updatedData = listTransactions.map(item => {
          if (item.id === data.order_id) {
            return {...item, status: data.status};
          }
          return item;
        });
        dispatch(updateTransactionList({data: updatedData, loading: false}));
      }
      console.log('notification', journeyData?.status);
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    handNotification(remoteMessage);
  });
  useEffect(() => {
    // When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(notification => {
      // Handle the click event for the push notification
      handNotification(notification);
    });

    return () => {
      // Unsubscribe the event listener when the component is unmounted
      unsubscribe();
    };
  }, [currentUser, listTransactions, journeyData, handNotification]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async notification => {
      handNotification(notification);
    });

    return () => {
      // Unsubscribe the event listener when the component is unmounted
      unsubscribe();
    };
  }, [currentUser, listTransactions, journeyData, handNotification]);
};

export default ManageNotification;
