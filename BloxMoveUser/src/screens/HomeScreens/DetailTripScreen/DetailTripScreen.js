import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ChoosePayment, Dash} from '../../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {getNFTBalance} from '../utils/api/nft';

const DetailTripScreen = props => {
  const {navigation, route} = props;
  const appStyles = route.params.appStyles;
  const data = route.params.data;
  const prices = data.prices;
  const depature = data.from;
  const destination = data.to;
  const currentFlag = route.params.currentFlag;
  const currentUser = useSelector(state => state.auth.user);
  const ngnRate = useSelector(state => state.payment.ngn);
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const [selectedItem, setItem] = useState([]);
  const [selectedId, setSelectedID] = useState(0);
  let currentTheme = appStyles.navThemeConstants[colorScheme];
  const [loading, setLoading] = useState(true);
  const [nft, setNFT] = useState(0);
  const [nftStatus, setStatus] = useState('0');
  const [nftData, setNFTData] = useState('');

  useEffect(() => {}, [selectedId]);
  useEffect(() => {
    getNFT();
  }, []);

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
      headerRight: () =>
        loading ? (
          <View style={styles.nftcontiner}>
            <ActivityIndicator color="black" />
          </View>
        ) : (
          <View style={styles.nftcontiner}>
            <Text style={styles.subText}>NFTicket</Text>
            <Text style={styles.subText}>{nft}</Text>
          </View>
        ),
    });
  }, [loading]);

  const getNFT = () => {
    setLoading(true);
    getNFTBalance(currentUser.ticketId)
      .then(response => {
        if (response.success === true) {
          setNFT(response.data[4]);
          setStatus(response.data[1]);
          setNFTData(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const changeItem = item => {
    setItem(item);
    setSelectedID(item.key);
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Image
          style={styles.headerImg}
          source={appStyles.iconSet.city}
          size={200}
          color="white"
        />
        <View style={[styles.boxContainer, styles.headerBoxContainer]}>
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
              <Text style={styles.text} numberOfLines={1}>
                {depature.name}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.text} numberOfLines={1}>
                {destination.name}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.priceBox}>
            {prices.map((item, index, separators) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={1}
                  onPress={() => changeItem(item)}>
                  <View style={styles.listContainer}>
                    <Text style={styles.text}>NGN {item.price}</Text>
                    <Image
                      style={styles.makerImg}
                      source={appStyles.iconSet.taxiIcon}
                      size={200}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <ChoosePayment
              navigation={navigation}
              appStyles={appStyles}
              type={0}
              depature={depature}
              destination={destination}
              currentFlag={currentFlag}
              item={selectedItem.price === undefined ? prices[0] : selectedItem}
              journey={data}
              nft={nft}
              nftStatus={nftStatus}
              nftData={nftData}
              getNFT={getNFT}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
DetailTripScreen.propTypes = {
  appStyles: PropTypes.object,
  appConfig: PropTypes.object,
};

export default DetailTripScreen;
