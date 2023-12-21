import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Rating} from 'react-native-ratings';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {journeyReview} from '../../utils/api/jonuney';
import {displayErrors} from '../../../../helpers/displayErrors';
import {Button, COLORS, Input, Text} from '@components';
import {Controller, useForm} from 'react-hook-form';
import Profile from '@app/assets/image/icons/profile.svg';
import {styles} from './styles';
import {setCurrent} from '../../redux/actions';

const ReviewTripScreen = props => {
  const {navigation, route} = props;
  const item = route.params.item;
  const dispatch = useDispatch();

  const {control, getValues} = useForm({
    mode: 'onChange',
  });

  const [rate, setRate] = useState(5);
  const [loading, setLoading] = useState(false);
  const apiToken = useSelector(state => state.auth.token);
  const currentJourney = useSelector(state => state.journey.currentJourney);

  const submitReview = async () => {
    const {message} = getValues();

    setLoading(true);
    const data = {
      score: rate,
      reportNotComplete: false,
      remark: message,
    };
    journeyReview(item.id, data, apiToken)
      .then(response => {
        if (currentJourney && currentJourney.id === item.id) {
          dispatch(setCurrent({data: ''}));
        }
        navigation.navigate('MyRides');
      })
      .catch(error => {
        setLoading(false);
        displayErrors(error);
      });
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text textStyle="body18Semibold">Rate your driver</Text>
      </View>
      <View style={styles.content}>
        <Text textStyle="header24">
          Please rate your Driver & ride experience
        </Text>
        <View style={styles.driverInfo}>
          <Profile style={styles.profile} />
          <Text style={{textAlign: 'center'}} textStyle="body18Regular">
            {item?.driver?.firstName} {item?.driver?.lastName}
          </Text>
        </View>
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={45}
          style={styles.rating}
          ratingBackgroundColor={COLORS.form}
          tintColor={COLORS.white}
          jumpValue={1}
          defaultRating={rate}
          startingValue={rate}
          onFinishRating={rating => {
            setRate(rating);
          }}
        />

        <Controller
          name="message"
          control={control}
          defaultValue=""
          render={({field: {onChange, value, onBlur}, fieldState: {error}}) => (
            <Input
              label="Leave a review"
              placeholder="Message"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="done"
            />
          )}
        />
      </View>
      <Button
        disabled={loading}
        title="Submit Feedback"
        onPress={() => submitReview()}
      />
    </KeyboardAwareScrollView>
  );
};

export default ReviewTripScreen;
