import {COLORS} from '@components';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  safeview: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    padding: 32,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',

    flexGrow: 1,
  },
  description: {
    textAlign: 'center',
    color: COLORS.body,

    marginTop: 24,
  },

  backButton: {
    marginRight: 24,
    padding: 8,
  },
});
