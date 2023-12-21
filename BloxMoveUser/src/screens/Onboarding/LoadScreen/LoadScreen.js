import React, {useEffect} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

const LoadScreen = props => {
  const {navigation, route} = props;
  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAppState();
    });
    return unsubscribe;
  }, [navigation]);

  const gotoLogin = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoginStack',
          params: {appStyles: appStyles, appConfig: appConfig},
        },
      ],
    });
  };

  const setAppState = async () => {
    gotoLogin();
  };

  return <View />;
};

LoadScreen.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

LoadScreen.navigationOptions = {
  header: null,
};

export default LoadScreen;
