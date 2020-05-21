// y = x
export default {
  getPosition(value, min, max) {
    return ((value - min) / (max - min)) * 100;
  },

  getValue(positionPercent, min, max) {
    const decimal = positionPercent / 100;

    if (positionPercent === 0) {
      return min;
    }

    if (positionPercent === 100) {
      return max;
    }

    return Math.round(((max - min) * decimal) + min);
  },
};
