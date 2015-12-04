import React from 'react';

const startDate = new Date('01-01-2015').valueOf();
const endDate = new Date('12-31-2015').valueOf();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function num(n) {
  const rem = n < 10 || n > 20 ? n % 10 : 0;
  if (rem === 1) {
    return `${n}st`;
  } else if (rem === 2) {
    return `${n}nd`;
  } else if (rem === 3) {
    return `${n}rd`;
  } else {
    return `${n}th`;
  }
}

export default {
  min: startDate,
  max: endDate,
  formatValue: (value) => {
    const date = new Date(value);
    return `${months[date.getMonth()]} ${num(date.getDate())}`;
  },
  values: [startDate],
};
