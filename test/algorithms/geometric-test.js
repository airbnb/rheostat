import { assert } from 'chai';
import casual from 'casual';
import geometric from '../../lib/algorithms/geometric';

describe('geometric algorithm', () => {
  it('should have inverse functions for getPosition and getValue', () => {
    const min = casual.integer(0, 100);
    const max = casual.integer(900, 1000);
    const originalPosition = casual.integer(100, 900);
    const value = geometric.getValue(originalPosition, min, max);
    const positionFromValue = geometric.getPosition(value, min, max);
    assert.equal(Math.round(positionFromValue), originalPosition);
  });

  it('should handle the minimum end of the range correctly', () => {
    const min = casual.integer(0, 99);
    const max = casual.integer(100, 1000);
    const value = geometric.getValue(0, min, max);
    assert.equal(value, min);
    const positionFromValue = geometric.getPosition(value, min, max);
    assert.equal(Math.round(positionFromValue), 0);
  });

  it('should handle the maximum end of the range correctly', () => {
    const min = casual.integer(0, 899);
    const max = casual.integer(900, 1000);
    const value = geometric.getValue(100, min, max);
    assert.equal(value, max);
    const positionFromValue = geometric.getPosition(value, min, max);
    assert.equal(Math.round(positionFromValue), 100);
  });

  it('should provide correct values for nice integers in the middle of a range', () => {
    const min = 0;
    const max = 1024;
    const x = 25;
    const value = geometric.getValue(x, min, max);
    assert.equal(value, 64);
    const positionFromValue = geometric.getPosition(value, min, max);
    assert.equal(positionFromValue, x);
  });
});
