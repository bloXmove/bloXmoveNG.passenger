import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    title: {
      fontSize: 30,
      lineHeight : 36,
    fontWeight : "500",
      textAlign: 'center',
      paddingBottom: 25,
    //   fontFamily : "SF Pro Display Regular",
      color: appStyles.colorSet[colorScheme].blackColor,
    },
    text: {
      fontSize: 17,
      lineHeight : 20,
      fontWeight : "400",
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].blackColor,
      paddingLeft: 10,
      paddingRight: 10,
    },
    image: {
      width: 250,
      height: 250,
      marginBottom: 60,
    //   tintColor: 'white',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    button: {
      fontSize: 18,
      color: 'white',
      marginTop: 10,
    },
    activatedDot :{
        color : appStyles.colorSet[colorScheme].mainColor,
        backgroundColor : appStyles.colorSet[colorScheme].mainColor,
        width : 30,
    },
    skipButton : {
        alignItems : "center",
        marginTop : 50
    },
    skipText: {
        color : "#BEC2CE",
        fontSize : 17,
        fontWeight : "600",
    },
    startButton: {
        alignItems : "center",
        alignSelf : "center",
        marginTop : 50,

        color : "#0A1F44",
        backgroundColor: appStyles.colorSet[colorScheme].mainColor,
        paddingHorizontal: 50,
        paddingVertical : 13,
        borderRadius : 8,
        borderWidth : 1,
        borderColor : 'white',
        width : "80%"
    },
    startText : {
        fontSize : 17,
        lineHeight:20,
        fontWeight : "600",
        color : appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
  });
};

export default dynamicStyles;
