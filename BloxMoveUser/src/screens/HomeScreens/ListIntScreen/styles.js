import {StyleSheet, Platform} from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    scrollContainer: {
      flex: 1,
      width: '100%',
    },
    bodyContainer: {
      paddingHorizontal: 10,
    },
    divider: {
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
    },
    flexContainer: {
      flexDirection: 'row',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '400',
      textAlign: 'center',
      paddingVertical: 10,
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    title: {
      fontSize: 20,
      fontWeight: '500',
      paddingBottom: 5,
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    text: {
      fontSize: 16,
      fontWeight: '400',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingVertical: 5,
    },
    topText: {
      fontSize: 16,
      fontWeight: '400',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingVertical: 5,
      paddingBottom: Platform.os === 'ios' ? 10 : 5,
    },
    bottomText: {
      fontSize: 16,
      fontWeight: '400',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingVertical: 5,
      paddingTop: Platform.os === 'ios' ? 10 : 8,
    },
    priceText: {
      fontSize: 20,
    },
    subText: {
      fontSize: 16,
      fontWeight: '400',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingVertical: 5,
    },
    topContainer: {
      flexDirection: 'row',
      marginTop: 50,
      justifyContent: 'space-between',
      // justifyContent : 'space0'
    },
    boxContainer: {
      width: '100%',
      padding: 15,
      marginTop: 20,
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    leftContainer: {
      width: '10%',
    },
    rightContainer: {
      justifyContent: 'space-between',
      width: '90%',
    },
    boxBottomContainer: {
      marginVertical: 20,
    },
    boxHeader: {
      paddingBottom: 10,
    },
    boxBottomHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
    boxBody: {
      paddingTop: 10,
    },
    makerImg: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    listContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      padding: 10,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      justifyContent: 'space-between',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 0.5,
      elevation: 5,
    },
    btnContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].mainColor,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '30%',
    },
    btnText: {
      fontSize: 14,
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    datePicker: {
      width: '100%',
    },
    inputIconContainer: {
      position: 'absolute',
      right: 25,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },

    image: {
      width: '100%',
      position: 'absolute',
      height: 200,
    },
    btnToggle: {
      marginLeft: 20,
    },
  });
};

export default dynamicStyles;
