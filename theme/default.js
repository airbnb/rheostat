import colorLib from 'color';

function opacity(color, alpha) {
  const c = colorLib(color);
  c.alpha(alpha);
  return c.rgbaString();
}

// Airbnb Theme Colors
const babu = '#00A699';
const hof = '#484848';
const accentBgGray = '#F2F2F2';
const white = '#ffffff';

export default {
  unit: 8,
  color: {
    sliderWhite: white,
    sliderBackground: accentBgGray,
    sliderBackgroundActive: babu,
    sliderBackgroundDisabled: opacity(babu, 0.3),
    sliderButtonBorder: babu,
    sliderButtonBorderDisabled: opacity(babu, 0.3),
    sliderShadow: opacity(hof, 0.3),
  },
};
