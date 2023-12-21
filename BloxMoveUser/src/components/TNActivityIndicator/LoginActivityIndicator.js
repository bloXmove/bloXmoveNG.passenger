import React from 'react';
import {View, useColorScheme, Modal} from 'react-native';
import FastImage from 'react-native-fast-image';
import dynamicStyles from './styles';

const LoginActivityIndicator = props => {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(props.appStyles, colorScheme);
  return (
    <Modal transparent={true}>
      <View style={styles.container}>
        <View style={styles.indicatorContainer}>
          <FastImage
            style={styles.logoImg}
            source={require('@app/assets/image/icons/logo_lg.png')}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
    </Modal>
  );
};

LoginActivityIndicator.defaultProps = {
  text: '',
};

export default LoginActivityIndicator;
