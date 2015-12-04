function roundToNearest(nearest, value) {
  return (value % nearest) >= (nearest / 2)
    ? Math.ceil(value / nearest) * nearest
    : Math.floor(value / nearest) * nearest;
}

export default {
  algorithm: {
    getPosition(value, min, max) {
      return (value - min) / (max - min) * 100;
    },
    getValue(pos, min, max) {
      const decimal = pos / 100;

      if (pos === 0) {
        return min;
      } else if (pos === 100) {
        return max;
      }

      return roundToNearest(5, Math.floor((max - min) * decimal + min)) || min;
    }
  },

  min: 1,

  values: [1, 100],
};
