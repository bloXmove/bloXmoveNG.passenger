import React, {useLayoutEffect} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Icon from 'react-native-vector-icons/Ionicons';
import {Dash} from '../../../components';

const BookedIntScreen = props => {
  const {route} = props;
  const appStyles = route.params.appStyles;
  const passNameList = route.params.passNameList;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  let currentTheme = appStyles.navThemeConstants[colorScheme];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.btnToggle} onPress={openDrawer}>
          <Icon name="menu-outline" size={30} color={currentTheme.fontColor} />
        </TouchableOpacity>
      ),
    });
  }, [])

  const openDrawer = () => {
    Keyboard.dismiss();
    props.navigation.openDrawer();
  };

  var passenger = [];
  for (var i = 0; i < passNameList.length; i++) {
    passenger.push(
      <View style={styles.fullWidth} key={i}>
        <Text style={styles.text}>{passNameList[i]}</Text>
      </View>,
    );
  }
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Image
          style={styles.headerImg}
          source={appStyles.iconSet.city}
          size={200}
          color="white"
        />
        <View style={[styles.boxContainer, styles.fullBoxContainer]}>
          <View style={styles.headerIntContainer}>
            <Text style={styles.title}>Drive Fast</Text>
          </View>
          <View style={[styles.bodyContainer, styles.flexContainer]}>
            <View style={styles.leftContainer}>
              <Icon
                name="radio-button-on-outline"
                size={25}
                color={appStyles.colorSet[colorScheme].mainColor}
              />
              <Dash appStyles={appStyles} />
              <Icon name="location-outline" size={25} color={'red'} />
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.depIntText}>Ikeja Station</Text>
              <View style={styles.divider} />
              <Text style={styles.desIntText}>Akure Station</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.bodyIntContainer}>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Date : </Text>
              <Text style={styles.text}>20.05.2022</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Departure Time : </Text>
              <Text style={styles.text}>8:30</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Estimated Arrival Time: </Text>
              <Text style={styles.text}>9:30</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Number of stop : </Text>
              <Text style={styles.text}>none</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Vehicle Type : </Text>
              <Text style={styles.text}>Bus</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Vehicle Number : </Text>
              <Text style={styles.text}>APP-565GR</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Baggage per passenger : </Text>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.bodySmallBottomContainer}>
              <Text style={styles.text}>Price: NGN 1,000 </Text>
            </View>
            <View style={styles.passContainer}>
              <Text style={styles.text}>Passenger Name : </Text>
              {passenger}
            </View>
            <View style={styles.passContainer}>
              <Text style={styles.text}>Required document for trip : </Text>
              <Text style={styles.text}>ID</Text>
            </View>
            <View style={styles.passContainer}>
              <Text style={styles.text}>Refund Policy : </Text>
              <Text style={styles.text}>
                50% refund for cancellation 2 days before trip
              </Text>
            </View>
          </View>
          <View style={[styles.footerContainer, styles.flexContainer]}>
            <TouchableOpacity style={styles.btnContainer}>
              <Text style={styles.btnText}>Download Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancelContainer}
              onPress={() => {
                props.navigation.navigate('CancelRide', {
                  appStyles: appStyles,
                });
              }}>
              <Text style={styles.btnText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

BookedIntScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default BookedIntScreen;
