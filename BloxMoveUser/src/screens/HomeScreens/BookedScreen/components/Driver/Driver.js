import {COLORS, Text} from '@components';
import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import Verified from '@app/assets/image/icons/verified.svg';
import Icon from 'react-native-vector-icons/AntDesign';
import {styles} from './styles';
import Svgs from '@app/assets/svg/svgs';
import FastImage from 'react-native-fast-image';

export const Driver = ({driver, containerStyles}) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.flexContainer}>
        <View style={styles.driverImage}>
          {driver?.avatar && driver?.avatar !== '' ? (
            <FastImage
              style={styles.profileImg}
              source={{
                uri: driver?.avatar,
                cache: FastImage.cacheControl.web,
                priority: FastImage.priority.normal,
              }}
              collapsable={false}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <Icon size={24} name="smileo" color={COLORS.black} />
          )}
          <View style={styles.rating}>
            <Icon name="star" color={COLORS.white} />
            <Text style={{color: COLORS.white}} textStyle="body10Regular">
              {' '}
              -.-
            </Text>
          </View>
          <Verified style={styles.verified} />
        </View>
        <View style={styles.textContainer}>
          <Text textStyle="body18Regular">
            {driver?.firstName} {driver?.lastName}
          </Text>
          <Text style={styles.description}>
            {driver?.vehicleColor} {driver?.vehicleManufacturer}{' '}
            {driver?.vehicleModel}
          </Text>
          <Text style={styles.description}>
            {driver?.vehicleRegistrationNo}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.phone}
        onPress={() => Linking.openURL(`tel:${driver?.phoneNumber}`)}>
        <Svgs.Phone />
        {/* <Icon name="phone" color={COLORS.white} size={16} /> */}
      </TouchableOpacity>
    </View>
  );
};
