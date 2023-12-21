import React from 'react';
import {View, useColorScheme, ActivityIndicator, Modal} from 'react-native';
import dynamicStyles from './styles';

const TNActivityIndicator = props => {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(props.appStyles, colorScheme);
  return (
    <Modal>
      <View style={styles.container}>
        <View style={styles.indicatorContainer}>
          <ActivityIndicator style={styles.indicatorContainer} />
          {/* <Image
            source={require('../../../assets/image/Logo.png')}
            style={styles.logoImg}
          /> */}
        </View>
      </View>
    </Modal>
  );
};

TNActivityIndicator.defaultProps = {
  text: '',
};

export default TNActivityIndicator;
