require('@eth-optimism/hardhat-ovm');

module.exports = {
    ovm: {
        solcVersion: '0.7.6+commit.3b061308',
    },
    paths: {
        artifacts: './artifacts-ovm',
    },
    ...require('./hardhat.config.js'),
};
