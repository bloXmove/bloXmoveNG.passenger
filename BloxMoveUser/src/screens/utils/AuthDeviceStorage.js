import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOULD_SHOW_ONBOARDING_FLOW = 'SHOULD_SHOW_ONBOARDING_FLOW';
const ACCESS_TOKEN = 'ACCESS_TOKEN';
const EXPIRED_AT = 'EXPIRED_AT';
const ACCOUNT_NUMBER = 'ACCOUNT_NUMBER';
const Account = 'Valora_Account';
const BANKS = 'BANKS';
const SIGNATURE = 'SIGNATURE';
const SIGN_TIME = 'SIGN_TIME';
const NFT_ADDRESS = 'NFT_ADDRESS';
const NFT_ABI = 'NFT_ABI';
const NON_VERIFIED = 'NON_VERIFIED';

/**
 * Get Should Show Onboarding
 * @param {String} value
 * @returns {Boolean}
 */
const getShouldShowOnboardingFlow = async () => {
  try {
    const result = await AsyncStorage.getItem(SHOULD_SHOW_ONBOARDING_FLOW);

    return result === 'true' ? true : false;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Should Show OnBoarding Flow
 * @param {String} value
 *
 */
const setShouldShowOnboardingFlow = async value => {
  try {
    await AsyncStorage.setItem(SHOULD_SHOW_ONBOARDING_FLOW, value);
  } catch (err) {
    console.log(err);
  }
};
// Access Token
const getAccessToken = async () => {
  try {
    const result = await AsyncStorage.getItem(ACCESS_TOKEN);

    return result !== null ? result : '';
  } catch (err) {
    console.log(err);
  }
};

const setAccessToken = async value => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN, value);
  } catch (err) {
    console.log(err);
  }
};

// Expired Time
const getExpired = async () => {
  try {
    const result = await AsyncStorage.getItem(EXPIRED_AT);

    return result !== null ? result : '';
  } catch (err) {
    console.log(err);
  }
};

const setExpired = async value => {
  try {
    await AsyncStorage.setItem(EXPIRED_AT, value);
  } catch (err) {
    console.log(err);
  }
};
// GET / SAVE VALORA ACCOUNT NUMBER

const getAccountNumber = async () => {
  try {
    const result = await AsyncStorage.getItem(ACCOUNT_NUMBER);

    return result !== null ? result : true;
  } catch (err) {
    console.log(err);
  }
};

const setAccountNumber = async value => {
  try {
    await AsyncStorage.setItem(ACCOUNT_NUMBER, value);
  } catch (err) {
    console.log(err);
  }
};

// Signature
const getSigature = async () => {
  try {
    const result = await AsyncStorage.getItem(SIGNATURE);

    return result !== null ? result : false;
  } catch (err) {
    console.log(err);
  }
};

const setSignature = async value => {
  try {
    await AsyncStorage.setItem(SIGNATURE, value);
  } catch (err) {
    console.log(err);
  }
};

// SET SIGNATURE TIME
const getSigTime = async () => {
  try {
    const result = await AsyncStorage.getItem(SIGN_TIME);

    return result !== null ? result : false;
  } catch (err) {
    console.log(err);
  }
};

const setSigTime = async value => {
  try {
    await AsyncStorage.setItem(SIGN_TIME, value);
  } catch (err) {
    console.log(err);
  }
};
// SET NFT ADDRESS
const getNFTAddress = async () => {
  try {
    const result = await AsyncStorage.getItem(NFT_ADDRESS);

    return result !== null ? result : false;
  } catch (err) {
    console.log(err);
  }
};

const setNFTADDRESS = async value => {
  try {
    await AsyncStorage.setItem(NFT_ADDRESS, value);
  } catch (err) {
    console.log(err);
  }
};
// ABI
const getNFTAbi = async () => {
  try {
    const result = await AsyncStorage.getItem(NFT_ABI);

    return result !== null ? result : false;
  } catch (err) {
    console.log(err);
  }
};

const setNFTAbi = async value => {
  try {
    await AsyncStorage.setItem(NFT_ABI, value);
  } catch (err) {
    console.log(err);
  }
};

const getAccount = async () => {
  try {
    const result = await AsyncStorage.getItem(Account);

    return result !== null ? result : true;
  } catch (err) {
    console.log(err);
  }
};
const setAccount = async value => {
  try {
    await AsyncStorage.setItem(Account, JSON.stringify(value));
  } catch (err) {
    console.log(err);
  }
};
// Manage Bank Card
const getCard = async () => {
  try {
    const result = await AsyncStorage.getItem(BANKS);

    return result !== null ? JSON.parse(result) : [];
  } catch (err) {
    console.log(err);
  }
};

const setCard = async value => {
  try {
    await AsyncStorage.setItem(BANKS, JSON.stringify(value));
  } catch (err) {
    console.log(err);
  }
};
// Get Non verified user show flow
const getNonVerfiedShowOnboardingFlow = async () => {
  try {
    const result = await AsyncStorage.getItem(NON_VERIFIED);

    return result === 'true' ? true : false;
  } catch (err) {
    console.log(err);
  }
};

// Set Non verified user show flow

const setNonverifedShowOnboardingFlow = async value => {
  try {
    await AsyncStorage.setItem(NON_VERIFIED, value);
  } catch (err) {
    console.log(err);
  }
};

const authDeviceStorage = {
  getShouldShowOnboardingFlow,
  setShouldShowOnboardingFlow,
  getAccountNumber,
  setAccountNumber,
  getAccount,
  setAccount,
  getCard,
  setCard,
  getSigature,
  setSignature,
  getSigTime,
  setSigTime,
  getNFTAddress,
  setNFTADDRESS,
  getNFTAbi,
  setNFTAbi,
  getAccessToken,
  setAccessToken,
  getExpired,
  setExpired,
  getNonVerfiedShowOnboardingFlow,
  setNonverifedShowOnboardingFlow,
};

export default authDeviceStorage;
