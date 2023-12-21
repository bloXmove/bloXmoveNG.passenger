import {StyleSheet} from 'react-native';
import {COLORS} from '@components';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  gray: {
    color: COLORS.body,
  },
  paymentInfo: {
    marginTop: 8,
    marginBottom: 18,
  },
  content: {
    padding: 32,
    paddingTop: 0,
  },
  details: {
    flexDirection: 'row',
    paddingBottom: 6,
  },
  detailsTitle: {
    flex: 1,
    paddingRight: 8,
  },
  detailsDescription: {
    flex: 1,
    color: COLORS.body,
    textTransform: 'capitalize',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 32,
    paddingBottom: 0,

    marginVertical: 16,
  },
  backButton: {
    marginRight: 32,
  },
  btn: {
    marginTop: 20,
  },
});
