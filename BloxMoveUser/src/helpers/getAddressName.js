import Geocoder from 'react-native-geocoding';

export const getAddressFromCoordinates = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        var addressComponent = json.results[0].address_components[1];
        let name = '';
        name = json.results[0]?.formatted_address;
        // json.results[0].address_components.map((item, index) => {
        //   if (index > 0 && index < 7 && item.types.indexOf('neighborhood') < 0) {
        //     name += item.long_name + (index === 6 ? '' : ', ');
        //   }
        // });
        addressComponent.long_name = name;
        resolve(addressComponent);
      })
      .catch(error => {
        resolve('fail');
      });
  });
};
