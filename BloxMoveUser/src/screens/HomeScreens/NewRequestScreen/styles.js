import {StyleSheet, Dimensions, Platform} from 'react-native';

const width = Dimensions.get('window').width;
const codeInptCellWidth = width * 0.08;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    scrollContainer: {
      flex: 1,
      width: '100%',
    },
    title: {
      fontSize: 18,
      fontFamily: 'PlusJakartaSans-Regular',
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    subTitle: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Regular',
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].grey9,
    },
    reviewTitle: {
      fontSize: 25,
      fontFamily: 'PlusJakartaSans-Regular',
      paddingBottom: 10,
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].blackColor,
      fontWeight: '500',
    },
    reiviewSubTitle: {
      fontSize: 18,
      fontFamily: 'PlusJakartaSans-Regular',
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].grey9,
      textAlign: 'center',
    },
    text: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    depIntText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingBottom: 8,
    },
    desIntText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingTop: 8,
    },
    depTimeText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingTop: 5,
    },
    notAuthContainer: {
      justifyContent: 'center',
      flex: 1,
    },
    noPermissionText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    orText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingTop: 10,
    },
    phoneText: {
      fontSize: 15,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingTop: 5,
    },
    addressTopText: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingBottom: 10,
    },
    addressBottomText: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingTop: 10,
    },
    topText: {
      paddingBottom: 10,
    },
    bottomText: {
      paddingTop: 10,
    },
    image: {
      width: '100%',
      position: 'absolute',
      height: 200,
    },
    boxContainer: {
      width: '95%',
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
    cancelBoxContainer: {
      marginTop: 100,
    },
    completedBoxContainer: {
      width: '95%',
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
    addressBoxContainer: {
      width: '95%',
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
      marginVertical: 20,
      overflow: 'hidden',
    },
    reviewContainer: {
      width: '95%',
      marginTop: 60,
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
    fullBoxContainer: {
      marginTop: 30,
      alignSelf: 'center',
      marginBottom: 30,
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 30,
    },
    flexContainer: {
      flexDirection: 'row',
    },
    hailContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      width: '80%',
      alignSelf: 'center',
    },
    headerContainer: {
      backgroundColor: '#F7F7F7',
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    headerIntContainer: {
      backgroundColor: '#F7F7F7',
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    bodyContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    bodyIntContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 5,
      paddingVertical: 10,
    },
    footerContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    rateFooterContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 20,
    },
    cancelFooterContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 20,
      flexDirection: 'row',
    },
    reportContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    leftContainer: {
      width: '10%',
    },
    rightContainer: {
      justifyContent: 'center',
      width: '85%',
    },
    centerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    bodyBottomContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    bodySmallBottomContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    passContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 5,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    iconContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainColor,
      padding: 15,
      borderRadius: 50,
      color: 'white',
      marginRight: 20,
    },
    divider: {
      borderBottomColor: '#eee',
      borderBottomWidth: 0.5,
    },
    mapContainer: {
      width: '100%',
      height: '100%',
    },
    carImg: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      position: 'absolute',
      right: 20,
      top: 70,
      zIndex: 1,
    },
    makerImg: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      position: 'absolute',
      right: 20,
      top: 10,
    },
    taxiImg: {
      width: 50,
      height: 50,
    },
    imgContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].grey0,
      borderRadius: 50,
      width: 70,
      height: 70,
      top: -40,
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    reviewImg: {
      width: 60,
      height: 60,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    btnContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].mainColor,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '50%',
    },
    btnSmContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].mainColor,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '33%',
    },
    btnFullContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].mainColor,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '100%',
    },
    btnReview: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].mainColor,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '30%',
    },
    btnCancelContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].blackColor,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '50%',
    },
    btnSmCancelContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: appStyles.colorSet[colorScheme].blackColor,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '33%',
    },
    btnPassengerCancelContainer: {
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].blackColor,
      paddingVertical: 10,
      marginTop: 5,
      marginHorizontal: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'white',
      width: '33%',
    },
    fullWidth: {
      width: '100%',
    },
    halfWidth: {
      width: '50%',
    },
    btnText: {
      fontSize: 15,
      fontWeight: '500',
      lineHeight: 20,
      fontFamily: 'PlusJakartaSans-Regular',
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    btnReportText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].blackColor,
      textAlign: 'center',
    },
    track: {
      position: 'absolute',
      right: 0,
      top: -30,
    },
    // Modal
    modalView: {
      justifyContent: 'flex-end',
      margin: 0,
      flex: 1,
    },
    modalHeader: {
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: 23,
    },
    Modalcontent: {
      flex: Platform.OS === 'ios' ? 0.85 : 0.85,
      height: '80%',
      backgroundColor: 'white',
      borderRadius: 20,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      paddingBottom: 30,
    },
    // Cancel
    headerImg: {
      width: '100%',
      height: 180,
      position: 'absolute',
      left: 0,
    },
    centerCarContainer: {
      width: 70,
      height: 70,
      marginTop: -40,
      backgroundColor: appStyles.colorSet[colorScheme].grey0,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputBox: {
      width: '100%',
      height: 100,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      padding: 10,
      color: appStyles.colorSet[colorScheme].blackColor,
      borderRadius: 8,
      marginTop: 5,
      marginBottom: 10,
    },
    termInput: {
      height: 'auto',
      textAlignVertical: 'top',
    },
    reasonInputBox: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    passInputBox: {
      width: '100%',
      height: 40,
      borderBottomWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    // QR Container
    QRModalContent: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 20,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      paddingVertical: 30,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    qrFooter: {
      flexDirection: 'row',
      paddingTop: 10,
    },
    qrContainer: {
      width: '100%',
      height: 300,
    },
    qrOutContainer: {
      borderColor: appStyles.colorSet[colorScheme].grey0,
      borderWidth: 10,
      borderRadius: 8,
      width: 300,
      height: 300,
      justifyContent: 'center',
      alignSelf: 'center',
      overflow: 'hidden',
    },
    qrCamera: {
      width: 300,
      height: 300,
      borderRadius: 10,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    // OTP
    codeFieldContainer: {
      marginTop: 20,
      // marginBottom : 10,
      alignItems: 'center',
    },
    codeInputCell: {
      width: codeInptCellWidth,
      height: 40,
      fontSize: 26,
      fontFamily: 'PlusJakartaSans-Regular',
      fontWeight: '400',
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].blackColor,
      backgroundColor: appStyles.colorSet[colorScheme].grey3,
      paddingBottom: 0,
      paddingTop: 0,
      marginLeft: 8,
      borderRadius: 0,
      borderBottomColor: appStyles.colorSet[colorScheme].grey3,
      borderBottomWidth: 6,
    },
    focusCell: {
      borderColor: '#000',
      paddingBottom: 5,
    },
    btnToggle: {
      marginLeft: 20,
    },
    // Approve Modal
    approveModalContent: {
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      paddingBottom: 30,
    },
    modalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
    },
    reasonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
    },
    checkBox: {
      width: 20,
      height: 20,
      marginRight: 20,
    },
    processingContainer: {
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey0,
    },
  });
};

export default dynamicStyles;
