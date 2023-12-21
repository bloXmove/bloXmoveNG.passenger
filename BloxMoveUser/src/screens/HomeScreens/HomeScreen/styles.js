import {COLORS, FONTS} from '@components';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {},
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomSmComponent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 32,
    paddingTop: 16,

    backgroundColor: COLORS.white,

    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    marginBottom: -150,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 32,

    backgroundColor: COLORS.white,

    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
  },
  image: {
    width: 48,
    height: 48,
  },
  bottomComponentButton: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.disabled,
    borderRadius: 16,
    borderWidth: 3,

    height: 100,
    width: 140,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 64,

    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.form,
    overflow: 'hidden',
  },
  buttonsContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  inputRight: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: COLORS.disabled,
    width: 113,
    height: 64,
  },
  watchIcon: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 8,

    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    paddingHorizontal: 8,
  },
  topToggle: {
    position: 'absolute',
    top: 32,
    left: 32,

    backgroundColor: COLORS.white,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,

    zIndex: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 16,
  },
  backButton: {
    marginRight: 32,
  },
  fullScreenModal: {
    backgroundColor: COLORS.white,
    margin: 0,

    padding: 32,
    justifyContent: 'flex-start',
  },
  placesInputContainer: {
    borderWidth: 2,
    color: COLORS.black,
    borderRadius: 8,
    marginBottom: 8,
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
  inputContainer: {
    flexDirection: 'row',
    marginTop: -2,
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
  placesLeftComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taxiMapIcon: {
    width: 50,
    height: 50,
  },

  markerDescriptionContainer: {
    height: 37,
    paddingRight: 8,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerLeftDep: {
    minWidth: 4,
    height: '100%',
    marginRight: 8,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5278DB',
  },
  markerLeft: {
    minWidth: 4,
    height: '100%',
    marginRight: 8,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    // position: 'absolute',
    // bottom: 20,
    marginTop: 9,
    width: '100%',
    alignSelf: 'center',
    zIndex: -10,
  },
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(82, 120, 219, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)',
    opacity: 1,
  },
});
