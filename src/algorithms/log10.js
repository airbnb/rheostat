export default {
  getPosition(value, min, max) {
    const minv = isFinite(Math.log(min)) ? Math.log(min) : 0;
    const maxv = isFinite(Math.log(max)) ? Math.log(max) : 0;

    const scale = (maxv - minv) / 100;
    const position = (Math.log(value) - minv) / scale;

    return isFinite(position) ? position : 0;
  },

  getValue(positionPercent, min, max) {
    const minv = isFinite(Math.log(min)) ? Math.log(min) : 0;
    const maxv = isFinite(Math.log(max)) ? Math.log(max) : 0;

    if (positionPercent === 0) {
      return min;
    }

    if (positionPercent === 100) {
      return max;
    }

    // calculate adjustment factor
    const scale = (maxv - minv) / 100;

    return Math.floor(Math.exp(minv + (scale * positionPercent))) || 0;
  },
};
