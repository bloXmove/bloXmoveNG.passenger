import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import PropTypes from 'prop-types';
import AppIntroSlider from 'react-native-app-intro-slider';
import dynamicStyles from './styles';
import deviceStorage from '../utils/AuthDeviceStorage';

const WalkthroughScreen = props => {
  const {navigation, route} = props;
  const appConfig = route.params.appConfig;
  const appStyles = route.params.appStyles;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const slides = appConfig.onboardingConfig.walkthroughScreens.map(
    (screenSpec, index) => {
      return {
        key: `${index}`,
        text: screenSpec.description,
        title: screenSpec.title,
        image: screenSpec.icon,
      };
    },
  );
  const _onDone = () => {
    deviceStorage.setShouldShowOnboardingFlow('false');
    if (appConfig?.isDelayedLoginEnabled) {
      navigation.navigate('DelayedHome');
      return;
    }
    navigation.navigate('LoginStack', {screen: 'Welcome'});
  };

  const _renderItem = ({item, dimensions}) => (
    <View style={[styles.container, dimensions]}>
      <Image
        style={styles.image}
        source={item.image}
        size={200}
        color="white"
      />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        {item.key !== 2 ? (
          <TouchableOpacity style={styles.skipButton} onPress={() => _onDone()}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => _onDone()}>
            <Text style={styles.startText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <AppIntroSlider
      data={slides}
      slides={slides}
      renderItem={_renderItem}
      //Handler for the done On last slide
      showSkipButton={false}
      showDoneButton={false}
      showNextButton={false}
      onSkip={_onDone}
      onDone={_onDone}
      activeDotStyle={styles.activatedDot}
    />
  );
};

WalkthroughScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default WalkthroughScreen;
