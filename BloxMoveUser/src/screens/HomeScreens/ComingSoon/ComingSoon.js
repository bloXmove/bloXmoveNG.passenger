import {Button, COLORS, Text} from '@components';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, TouchableOpacity, Linking, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';

export const ComingSoon = () => {
  const {goBack} = useNavigation();

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrowleft" size={24} color={COLORS.black} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text textStyle="header24">Coming Soon</Text>
          <Text style={styles.description}>
            This feature is still under development and will be available for
            public use soonest.
          </Text>
          <Button
            type="link"
            title="Learn More"
            onPress={() => Linking.openURL('https://bloxmove.ng/bloxfleet/')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
