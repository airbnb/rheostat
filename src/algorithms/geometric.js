export default {
  getPosition(x, min, max) {
    return ((max / (max - min)) ** 0.5) * (((x - min) / max) ** 0.5) * 100;
  },

  getValue(x, min, max) {
    return (Math.floor(((x / 100) ** 2) * (max - min)) + min);
  },
};
