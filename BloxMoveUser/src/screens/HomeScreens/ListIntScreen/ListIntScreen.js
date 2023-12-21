import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dash} from '../../../components';
import {getArrivalTime} from '../../../helpers/getArrivalTime';

const ListIntScreen = props => {
  const {navigation, route} = props;
  const appConfig = route.params.appConfig;
  const appStyles = route.params.appStyles;
  const bookTime = route.params.bookTime;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  // eslint-disable-next-line no-unused-vars
  const [selectedItem, setItem] = useState([]);
  const [selectedId, setSelectedID] = useState(1);

  let currentTheme = appStyles.navThemeConstants[colorScheme];

  useEffect(() => {}, [selectedId]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.btnToggle}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            name="arrow-back-outline"
            size={30}
            color={currentTheme.fontColor}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  const data = [
    {
      key: 1,
      title: 'Drive Fast',
      price: 1000,
      duration: 300,
      img: appStyles.iconSet.taxiIcon,
      fast: true,
    },
    {
      key: 2,
      title: 'Drive Slow',
      price: 800,
      duration: 360,
      img: appStyles.iconSet.taxiIcon,
      fast: false,
    },
  ];
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Image
          style={styles.image}
          source={appStyles.iconSet.city}
          size={200}
          color="white"
        />
        <View style={styles.bodyContainer}>
          <View style={[styles.topContainer, styles.boxContainer]}>
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
              <Text style={styles.topText}>Ikeja Station</Text>
              <View style={styles.divider} />
              <Text style={styles.bottomText}>Akure Station</Text>
            </View>
          </View>
          {data.map(item => {
            return (
              <View style={styles.boxContainer} key={item.key}>
                <View style={styles.boxBottomHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={() => {
                      props.navigation.navigate('HomeStack', {
                        screen: 'TripInt',
                        params: {
                          fast: item.fast,
                          appStyles,
                          appConfig,
                        },
                      });
                    }}>
                    <Text style={styles.btnText}>Select</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.divider} />
                <View style={styles.boxBody}>
                  <View style={styles.flexContainer}>
                    <Text style={styles.text}>Departure time : {bookTime}</Text>
                  </View>
                  <View style={styles.flexContainer}>
                    <Text style={styles.text}>
                      Estimated arrival time : {getArrivalTime(bookTime, item.duration)}
                    </Text>
                  </View>
                  <View style={styles.flexContainer}>
                    <Text style={styles.text}>
                      Duration : {item.duration / 60} hours
                    </Text>
                  </View>
                  <View style={styles.flexContainer}>
                    <Text style={[styles.text, styles.priceText]}>
                      {selectedItem.price === undefined
                        ? item.price + ' Naria = ' + item.price * 0.05 + ' BLXM'
                        : selectedItem.price + ' Naria = ' + selectedItem.price * 0.05 + ' BLXM'
                      }
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
ListIntScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default ListIntScreen;
