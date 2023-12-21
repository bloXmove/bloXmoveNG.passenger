import moment from 'moment';

// Return Arrival Time
export const getArrivalTime = (depTime, duration) => {
  if (depTime) {
    var time = moment(depTime, 'HH:mm').local();
    time.add(duration, 'm');
    return time.format('HH:mm');
  }
  return ' ';
};

// Convert Minutes to Hours
export const calcuateDuration = minutes => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return (
      hours +
      (hours > 1 ? ' hrs' : ' hr' + ' ') +
      remainingMinutes.toFixed(0) +
      ' mins'
    );
  } else if (minutes < 60 && minutes > 0) {
    return minutes.toFixed(0) + ' mins';
  } else {
    return '0 min';
  }
};
