const { expect } = require('chai');
const { assertRoughlyEqualValues } = require('./helpers.js');

describe('UtilsTest', async function () {
    it('100 ~= 100 (0.01)', async function () {
        assertRoughlyEqualValues('100', '100', 0.01);
    });

    it('100 ~/= 200 (0.01)', async function () {
        expect(() => assertRoughlyEqualValues('100', '200', 0.01)).to.throw();
    });

    it('100 ~= 101 (0.01)', async function () {
        assertRoughlyEqualValues('100', '101', 0.01);
    });

    it('100 ~/= 101 (0.001)', async function () {
        expect(() => assertRoughlyEqualValues('100', '101', 0.001)).to.throw();
    });
});
