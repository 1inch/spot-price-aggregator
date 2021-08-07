const { ether, expectRevert } = require('@openzeppelin/test-helpers');
const { tokens, assertRoughlyEqualValues } = require('./helpers.js');

const SynthetixOracle = artifacts.require('SynthetixOracle');

describe('SynthetixOracle', async function () {

	function symbolToBytes(symbol) {
		let result = '0x';
		for (var i = 0; i < symbol.length; i++) {
		    result += symbol.charCodeAt(i);
		}
		return result;
	}
	
	before(async function () {
        this.synthetixOracle = await SynthetixOracle.new('0xd69b189020EF614796578AfE4d10378c5e7e1138');
	});

    it('sREN -> iREN', async function () {
    	const result = await this.synthetixOracle.getRate(tokens.sREN, tokens.iREN, tokens.NONE);
        console.log(result.rate.toString(), result.weight.toString());
    });
});