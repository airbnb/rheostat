import PropTypes from 'prop-types';

export default {
  'aria-valuemax': PropTypes.number,
  'aria-valuemin': PropTypes.number,
  'aria-valuenow': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  'aria-disabled': PropTypes.bool,
  'data-handle-key': PropTypes.node,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  handleRef: PropTypes.func,
  role: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
};

export const handleDefaultProps = {
  handleRef: null,
  orientation: 'horizontal',
  disabled: false,
  'aria-valuenow': undefined,
  'data-handle-key': undefined,
  'aria-valuemax': undefined,
  'aria-valuemin': undefined,
  'aria-disabled': undefined,
  onClick: null,
  onKeyDown: null,
  onMouseDown: null,
  onTouchStart: null,
  role: undefined,
  tabIndex: undefined,
};
