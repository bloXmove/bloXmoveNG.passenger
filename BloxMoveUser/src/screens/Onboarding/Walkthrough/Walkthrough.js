import React, {useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Button, Text, COLORS} from '@components';
import deviceStorage from '../../utils/AuthDeviceStorage';

const SLIDES = [
  {
    index: 1,
    image: require('@app/assets/image/static/step1.png'),
    text: () => (
      <Text style={styles.text} textStyle="header24">
        Enjoy{' '}
        <Text textStyle="header24" style={styles.green}>
          seamless ride
        </Text>{' '}
        with maximum comfort.
      </Text>
    ),
  },
  {
    index: 2,
    image: require('@app/assets/image/static/step2.png'),
    text: () => (
      <Text textStyle="header24" style={styles.text}>
        Get a Rider{' '}
        <Text textStyle="header24" style={styles.green}>
          anywhere
        </Text>
        ,{' '}
        <Text textStyle="header24" style={styles.green}>
          anytime
        </Text>{' '}
        and{' '}
        <Text textStyle="header24" style={styles.green}>
          any day
        </Text>
        .
      </Text>
    ),
  },
  {
    index: 3,
    image: require('@app/assets/image/static/step3.png'),
    text: () => (
      <Text style={styles.text} textStyle="header24">
        Pay without cash,{' '}
        <Text textStyle="header24" style={styles.green}>
          fast
        </Text>{' '}
        and{' '}
        <Text textStyle="header24" style={styles.green}>
          easy
        </Text>
      </Text>
    ),
  },
];

export const Walkthrough = props => {
  const {navigation} = props;
  const [step, setStep] = useState(1);

  const isFinalStep = step === 3;

  const handleButtonClick = async () => {
    if (!isFinalStep) {
      setStep(step + 1);
    } else {
      await deviceStorage.setShouldShowOnboardingFlow('true');
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoginStack',
          },
        ],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={SLIDES[step - 1].image}
        style={styles.image}
        resizeMode="contain"
      />
      {SLIDES[step - 1].text()}
      <View style={styles.stepper}>
        {SLIDES.map(item => (
          <View
            key={item.index}
            style={[
              styles.step,
              item.index === step && {backgroundColor: COLORS.primary},
            ]}
          />
        ))}
      </View>
      <Button
        title={isFinalStep ? 'Get Started' : 'Next'}
        onPress={handleButtonClick}
        containerStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 312 / 358,
    marginBottom: 32,
  },
  text: {
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
  green: {
    color: COLORS.primary,
  },
  stepper: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 48,
  },
  step: {
    height: 4,
    width: 16,
    borderRadius: 2,
    margin: 2,

    overflow: 'hidden',

    backgroundColor: COLORS.disabled,
  },
});
