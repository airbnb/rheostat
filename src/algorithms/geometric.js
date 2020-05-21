export default {
  getPosition(x, min, max) {
    return ((x - min) / (max - min)) ** 0.5 * 100;
  },

  getValue(x, min, max) {
    return (Math.round(((x / 100) ** 2) * (max - min)) + min);
  },
};
