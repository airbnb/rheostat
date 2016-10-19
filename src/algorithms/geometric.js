export default {
  getPosition(x, min, max) {
    return Math.pow(max / (max - min), 0.5) * Math.pow((x - min) / max, 0.5) * 100;
  },

  getValue(x, min, max) {
    return (Math.floor(Math.pow(x / 100, 2) * (max - min)) + min);
  },
};
