import {StyleSheet} from 'react-native';
import {COLORS} from '@components';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    padding: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverImage: {
    width: 48,
    height: 48,

    justifyContent: 'center',
    alignItems: 'center',

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,

    borderWidth: 2,
    borderColor: COLORS.primary,

    marginRight: 8,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 32,

    marginRight: 16,
    position: 'absolute',
  },
  profile: {
    width: 48,
    height: 48,
  },

  rating: {
    position: 'absolute',
    bottom: -10,
    width: 48,
    paddingVertical: 2,
    borderRadius: 8,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.primary,
  },
  flexContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  verified: {
    position: 'absolute',
    top: 0,
    right: -5,
  },
  textContainer: {
    flexShrink: 1,
  },
  phone: {
    backgroundColor: COLORS.primary,

    width: 40,
    height: 40,

    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 8,
    marginTop: 8,
  },

  description: {
    color: COLORS.body,
  },
});
