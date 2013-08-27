var accountSetters = require('./accountSetters');
var accountGetters = require('./accountGetters');

module.exports = {
    getActiveAccounts: accountGetters.getActiveAccounts,
    getDisabledAccounts: accountGetters.getDisabledAccounts,
    getAccountForName: accountGetters.getAccountForName,
    createOrUpdateAccount: accountSetters.createOrUpdateAccount
};