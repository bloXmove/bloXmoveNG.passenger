import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Text} from '../Text';
import {COLORS} from '../theme';
import {Button} from '../Button/Button';

const CountriesModalPicker = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const modal = useRef(null);

  useEffect(() => {
    setData(props.data);
    setModalVisible(props.visible);
  }, [props.data, props.visible]);

  const close = () => {
    setModalVisible(false);
  };

  const onChange = item => {
    props.onChange(item);
    props.onCancel();
  };

  const renderOption = option => {
    return (
      <TouchableOpacity key={option.key} onPress={() => onChange(option)}>
        <View style={[styles.optionStyle, props.optionStyle]}>
          <View style={styles.flexContainer}>
            <Text style={props.optionTextStyle}>{option.label}</Text>
          </View>
          <Text style={[styles.optionTextStyle, props.optionTextStyle]}>
            {option.dialCode}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOptionList = () => {
    const options = data.map(item => {
      return renderOption(item);
    });

    return (
      <View
        style={[styles.overlayStyle, props.overlayStyle]}
        // key={`modalPicker${componentIndex++}`}
      >
        <View style={styles.optionContainer}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.p10}>{options}</View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <Button
            onPress={() => props.onCancel()}
            title={props.cancelText}
            type="outlined"
          />
        </View>
      </View>
    );
  };

  const dp = (
    <Modal
      transparent
      ref={modal}
      visible={modalVisible}
      onRequestClose={close}
      animationType="slide">
      {renderOptionList()}
    </Modal>
  );

  return <View style={props.style}>{dp}</View>;
};

CountriesModalPicker.defaultProps = {
  data: [],
  onChange: () => {},
  initValue: 'Select me!',
  style: {},
  selectStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  sectionStyle: {},
  sectionTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel',
};

const styles = StyleSheet.create({
  overlayStyle: {
    backgroundColor: COLORS.white,
  },
  optionStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    paddingVertical: 10,
  },
  optionContainer: {
    paddingHorizontal: 32,
    paddingBottom: 82,
  },
  flexContainer: {
    flex: 4,
  },
  optionTextStyle: {
    flex: 1,
    textAlign: 'right',
  },
  cancelContainer: {
    position: 'absolute',
    paddingHorizontal: 32,
    paddingVertical: 8,
    bottom: 0,

    borderTopColor: COLORS.disabled,
    borderTopWidth: 2,

    backgroundColor: COLORS.white,
    width: '100%',
  },
});

export default CountriesModalPicker;
