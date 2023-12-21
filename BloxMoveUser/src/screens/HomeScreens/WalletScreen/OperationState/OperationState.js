import {Button, COLORS, Text} from '@components';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';
import * as Progress from 'react-native-progress';
import messaging from '@react-native-firebase/messaging';

export const OperationState = ({route}) => {
  const {onButtonPress} = route.params;
  const [title, setTitle] = useState(route.params.title);
  const [description, setDes] = useState(route.params.description);
  const [type, setType] = useState(route.params.type);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      if (remoteMessage.data.data) {
        const notiType = remoteMessage.data.type;
        if (
          notiType === 'WITHDRAW_COMPLETED' ||
          notiType === 'TOP_UP_COMPLETED'
        ) {
          setTitle('Successful');
          setDes(
            notiType === 'WITHDRAW_COMPLETED'
              ? 'Withdrawal transaction complete, check transaction history to know more'
              : 'Top up transaction complete, check transaction history to know more',
          );
          setType('SUCCESS');
        } else if (
          notiType === 'TOP_UP_FAILED' ||
          notiType === 'WITHDRAW_FAILED'
        ) {
          setTitle('Failure');
          setDes(
            notiType === 'WITHDRAW_FAILED'
              ? 'Your transaction encountered an error. Please try again'
              : 'Top up transaction encountered an error. Please try again',
          );
          setType('ERROR');
        }
      }
    });

    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                type === 'PROCESSING'
                  ? COLORS.white
                  : type === 'ERROR'
                  ? COLORS.error
                  : COLORS.primary,
            },
          ]}>
          {type === 'PROCESSING' && (
            <Progress.Circle
              size={200}
              thickness={3}
              showsText={true}
              progress={1}
              animated={true}
              indeterminate={true}
              style={styles.progress}
              color={COLORS.primary}
              borderWidth={3}
            />
          )}
          {type !== 'PROCESSING' && (
            <Icon
              name={type === 'ERROR' ? 'close' : 'check'}
              size={40}
              color={COLORS.white}
            />
          )}
        </View>
        <Text textStyle="body18Semibold">{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Button title="Continue" onPress={onButtonPress} />
    </View>
  );
};
