import {COLORS} from '@components';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  description: {
    color: COLORS.body,
    marginBottom: 32,
  },
  cancel: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.error,
    textDecorationLine: 'underline',
  },
  // Cancel Modal
  cancelModal: {
    justifyContent: 'flex-end',
    flex: 1,
    margin: 0,
  },
  cancelModalContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  centered: {
    textAlign: 'center',
    marginBottom: 24,
  },
});
