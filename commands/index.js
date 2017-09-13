module.exports.createCoupon = require('./crudCoupon').createCoupon;
module.exports.deleteCoupon = require('./crudCoupon').deleteCoupon;
module.exports.updateCoupon = require('./crudCoupon').updateCoupon;
module.exports.notifyChanges = require('./crudCoupon').notifyChanges;
module.exports.listUsers = require('./crudCoupon').listUsers;

module.exports.getCoupons = require('./getCoupons').getCoupons;

module.exports.subscribe = require('./subscriptions').subscribe;
module.exports.unsubscribe = require('./subscriptions').unsubscribe;

module.exports.test = require('./scrapper').test;
module.exports.syncVoucher = require('./scrapper').syncVoucher;
module.exports.syncCodes = require('./scrapper').syncCodes;

