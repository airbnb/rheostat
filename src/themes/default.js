import colorLib from 'color';

function opacity(color, alpha) {
  const c = colorLib(color);
  c.alpha(alpha);
  return c.rgbaString();
}
const primary = '#00A699';

export default {
  unit: 8,
  color: {
    white: '#ffffff',
    carousel: 'rgba(0, 0, 0, 0.3)',
    buttons: {
      secondaryBorder: primary,
      secondaryDisabledBorder: opacity(primary, 0.3),
    },
    accent: {
      bgGray: '#F2F2F2',
    },
  },
};
