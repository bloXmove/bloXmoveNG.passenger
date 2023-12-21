import {COLORS, FONTS} from '@components';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    backgroundColor: COLORS.white,
  },
  inner: {
    paddingVertical: 20,
    backgroundColor: COLORS.white,
  },
  profileImageContainer: {
    paddingLeft: 32,
    paddingRight: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.form,
    height: 64,
    lineHeight: 20,
    marginBottom: 32,
    justifyContent: 'space-around',
  },
  inputBoxContainer: {
    backgroundColor: 'red',
  },
  inputBox: {
    fontSize: 18,
    paddingHorizontal: 15,
    lineHeight: 20,
    fontFamily: FONTS.regular,
    transform: [{translateY: 4}],
    color: COLORS.black,
  },
  halfContainer: {
    width: '48%',
  },
  carContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  name: {
    marginTop: 8,
  },
  referralBy: {
    marginTop: 8,
    color: COLORS.body,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 32,
    paddingTop: 0,
    flexDirection: 'row',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '55%',
  },
  content: {
    paddingHorizontal: 32,
  },
  backButton: {
    marginRight: 5,
    padding: 8,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.form,
  },
  userData: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  terms: {
    marginBottom: 16,
  },

  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 22,
    paddingHorizontal: 15,
    borderRadius: 16,
    width: '100%',
  },
  description: {
    color: COLORS.body,

    marginVertical: 24,
  },
  centered: {
    textAlign: 'center',
  },
  buttonMargin: {
    marginBottom: 8,
  },
  editButton: {
    padding: 8,
  },
  greyColor: {
    color: COLORS.body,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recoveryContainer: {
    color: COLORS.black,
    marginVertical: 24,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.disabled,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  // Auto Complete
  placesInputContainer: {
    borderWidth: 2,
    color: COLORS.black,
    borderRadius: 8,
    marginBottom: 32,
  },
  placesInput: {
    marginBottom: 1,
    borderRadius: 10,
    color: COLORS.black,

    height: 64,
    fontFamily: FONTS.regular,
    fontSize: 18,
    paddingTop: 10,
  },
  placesRow: {
    backgroundColor: '#FFFFFF',
    // height: 64,
    alignItems: 'center',
    flexDirection: 'row',
  },
  placesLoader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  placesSeparator: {
    height: 0.5,
    backgroundColor: '#c8c7cc',
  },
  placesDescription: {
    color: COLORS.black,
    fontSize: 14,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  rightPrice: {
    position: 'absolute',
    right: 10,
  },
  iconDown: {
    marginTop: 5,
    position: 'absolute',
    right: 10,
  },
});
