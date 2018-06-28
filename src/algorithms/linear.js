export default {
  getPosition(value, min, max) {
    return ((value - min) / (max - min)) * 100;
  },

  getValue(pos, min, max) {
    const decimal = pos / 100;

    if (pos === 0) {
      return min;
    } else if (pos === 100) {
      return max;
    }

    return Math.round(((max - min) * decimal) + min);
  },
};
