// y = x^2
const POWER = 2;
export default {
  getPosition(value, min, max) {
    return ((value - min) / (max - min)) ** (1 / POWER) * 100;
  },

  getValue(positionPercent, min, max) {
    return (Math.round(((positionPercent / 100) ** POWER) * (max - min)) + min);
  },
};
