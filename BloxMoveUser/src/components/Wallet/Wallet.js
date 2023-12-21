import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const Wallet = () => {
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
        } catch (err) {
          console.error('Error adding a Wallet with WalletConnect', err);
        }
      }}>
      <Text>Connect</Text>
    </TouchableOpacity>
  );
};

export default Wallet;
