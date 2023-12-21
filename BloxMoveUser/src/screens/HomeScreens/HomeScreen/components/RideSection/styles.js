const {COLORS} = require('@components');
const {StyleSheet} = require('react-native');

export const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: COLORS.form,

    marginTop: 8,
  },
  subHeader: {
    marginBottom: 8,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressBottomText: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  handle: {
    height: 4,
    width: 64,
    backgroundColor: COLORS.form,
    borderRadius: 4,

    alignSelf: 'center',
    marginBottom: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  checkBox: {
    width: 16,
    height: 16,
    marginRight: 16,
  },
  text: {
    textTransform: 'capitalize',
  },
  topText: {
    color: COLORS.body,
    marginVertical: 20,
  },
  btnCancel: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center',
  },
});
