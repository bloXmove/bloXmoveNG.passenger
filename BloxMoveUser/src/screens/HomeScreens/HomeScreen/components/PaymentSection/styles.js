import {COLORS, FONTS} from '@components';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  activePaymentInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 64,

    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  selectPaymentInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 64,

    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.form,
    overflow: 'hidden',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginHorizontal: 5,
    fontSize: 18,
    color: COLORS.black,
    width: '75%',
  },
  inputGreyContainer: {
    marginHorizontal: 5,
    fontSize: 18,
    color: COLORS.body,
    width: '90%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,

    marginRight: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    paddingVertical: 8,
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInputLabel: {
    fontFamily: FONTS.regular,
    color: COLORS.form,
    paddingLeft: 8,
  },
  cardInput: {
    fontFamily: FONTS.regular,
    paddingLeft: 8,
  },
  cardInputContainer: {
    borderColor: COLORS.form,
    borderRadius: 8,
    marginVertical: 8,

    borderWidth: 2,
    marginLeft: 4,
  },
  description: {
    color: COLORS.body,
    marginBottom: 32,
  },
  progress: {
    alignSelf: 'center',
  },
  rightArrow: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 80,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  lgText: {
    marginBottom: 13,
    color: COLORS.black,
  },
  lgGreyText: {
    marginBottom: 13,
    color: COLORS.body,
  },
  priceContainer: {
    alignItems: 'center',
  },
  oldPrice: {
    color: COLORS.body,
    textDecorationLine: 'line-through',
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
});
