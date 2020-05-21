export default {
  getPosition(value, min, max) {
    return ((value - min) / (max - min)) ** 0.5 * 100;
  },

  getValue(positionPercent, min, max) {
    return (Math.round(((positionPercent / 100) ** 2) * (max - min)) + min);
  },
};
