import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {ChoosePayment, Dash} from '../../../components';

const DetailTripIntScreen = props => {
  const {navigation, route} = props;
  const appStyles = route.params.appStyles;
  const fastFlag = route.params.fast;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const numRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [selectedItem, setItem] = useState([]);
  const [numSeat, setSeat] = useState('1');
  const [passName, setPassName] = useState([]);
  const [passNameList, setPassNameList] = useState([]);

  let currentTheme = appStyles.navThemeConstants[colorScheme];

  var passenger = [];
  var nameList = [];
  const item = key => {
    return (
      <View style={styles.fullWidth} key={key}>
        <TextInput
          placeholder="Please enter name"
          placeholderTextColor="#ddd"
          style={styles.inputBox}
          value={nameList[key]}
          onChangeText={async val => {
            nameList[key] = val;
            setPassNameList(nameList);
          }}
        />
      </View>
    );
  };
  useEffect(() => {
    for (var i = 0; i < numSeat; i++) {
      passenger.push(item(i));
    }
    setPassName(passenger);
  }, [numSeat]);
  useEffect(() => {}, [passNameList]);

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

  const changeSeat = value => {
    if (value < 1) {
      setSeat(1);
      return;
    }
    if (value > 3) {
      Alert.alert('You can add up to 3 seats', '', [
        {
          text: 'OK',
          onPress: async () => await setSeat(1),
        },
      ]);
      return;
    }
    setSeat(value === '' ? 1 : value);
  };

  const data = [
    {
      key: 1,
      title: 'Naria',
      price: 1000,
      duration: 60,
      img: appStyles.iconSet.taxiIcon,
    },
    {
      key: 2,
      title: 'Naria 2',
      price: 800,
      duration: 80,
      img: appStyles.iconSet.taxiIcon,
    },
  ];
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
        <View style={[styles.boxContainer, styles.topContainer]}>
          <View style={[styles.flexContainer]}>
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
              <Text style={[styles.text, styles.stationTitle]}>
                Ikeja Station
              </Text>
              <View style={styles.divider} />
              <Text style={[styles.text, styles.stationTitle]}>
                Akure Station
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.boxContainer}>
            <View style={styles.boxHeader}>
              <Text style={styles.title}>
                Drive {fastFlag === true ? 'Fast' : 'Slow'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.boxBody}>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Date : </Text>
                <Text style={[styles.subText]}>20.05.2022 </Text>
                <Image
                  style={styles.busImg}
                  source={appStyles.iconSet.busIcon}
                  size={200}
                  color="white"
                />
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Departure time : </Text>
                <Text style={styles.subText}>9 : 30 </Text>
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Estimated arrival time : </Text>
                <Text style={styles.subText}>10 : 30 </Text>
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Number of stops : </Text>
                <Text style={styles.subText}>none </Text>
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Vehicle type : </Text>
                <Text style={styles.subText}>Bus </Text>
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Vehicle number : </Text>
                <Text style={styles.subText}>APP-565GP </Text>
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>Baggage per passenger : </Text>
                <Text style={styles.subText}>1</Text>
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>
                  {selectedItem['price'] == undefined
                    ? (data[0]['price']) + ' ' + data[0].title + ' = ' + (data[0].price) * 0.05 + ' BLXM'
                    : (selectedItem['price']) + ' ' + selectedItem['title'] + ' = ' + (selectedItem.price) * 0.05 + ' BLXM'
                  }
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.boxContainer, styles.mt20]}>
            <View style={styles.boxBottomHeader}>
              <Text style={styles.title}>Number of seat</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.boxBody}>
              <View style={styles.seatContainer}>
                <TextInput
                  ref={numRef}
                  style={styles.inputBox}
                  value={numSeat}
                  onChangeText={changeSeat}
                  placeholder="Please input number of seat"
                  placeholderTextColor="#ddd"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.flexContainer}>
                <Text style={styles.text}>
                  {
                    selectedItem['price'] == undefined
                    ? (data[0]['price'] * numSeat) + ' ' + data[0]['title'] + ' = ' + (data[0]['price'] * numSeat) * 0.05 + ' BLXM'
                    : (selectedItem['price'] * numSeat) + ' ' + selectedItem['title'] + ' = ' + (selectedItem['price'] * numSeat) * 0.05 + ' BLXM'
                  }
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.boxContainer, styles.mt20]}>
            <View style={styles.boxBottomHeader}>
              <Text style={styles.title}>Required Passenger Info</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.boxBody}>{passName}</View>
          </View>
          <View style={[styles.boxContainer, styles.mt20]}>
            <View style={styles.boxBody}>
              <Text style={styles.title}>Required document for Trip</Text>
              <Text style={styles.text}>ID</Text>
              <Text style={styles.title}>Refund Policy</Text>
              <Text style={styles.text}>
                50% Refund for cancellation 2 days before up
              </Text>
            </View>
          </View>
          {
            <ChoosePayment
              navigation={navigation}
              appStyles={appStyles}
              type={1}
              seat={numSeat}
              passNameList={passNameList}
              item={selectedItem.price === undefined ? data[0] : selectedItem}
            />
          }
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
DetailTripIntScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default DetailTripIntScreen;
