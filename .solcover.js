module.exports = {
    copyPackages: ['openzeppelin-solidity'],
    skipFiles: ['mocks'],
    mocha: {
        grep: "_GasCheck",
        invert: true,
        timeout: 50000,
    },
}
