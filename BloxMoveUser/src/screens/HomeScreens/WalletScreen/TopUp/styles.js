import {COLORS} from '@components';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,

    justifyContent: 'space-between',
  },
  inner: {
    flexGrow: 1,
    backgroundColor: COLORS.white,

    justifyContent: 'space-between',
    padding: 32,
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 16,
  },
  backButton: {
    padding: 8,
    paddingRight: 32,
  },
  input: {
    marginVertical: 32,
  },
});
