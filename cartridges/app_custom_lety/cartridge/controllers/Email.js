'use strict';

/**
 * @namespace Home
 */

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/Home-Show
 * @function
 * @memberof Home
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Register', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

    var page = PageMgr.getPage('accountEditedEmail');

    if (page && page.isVisible()) {
        res.page('accountEditedEmail');
    } else {
        res.render('account/components/accountEditedEmail');
    }

    
    next();
}, pageMetaData.computedPageMetaData);

/**
 * Lety-Card : this endpoint is called to get Lety points 
 * @name Base/Lety-Card
 * @function
 * @memberof Account
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - server.middleware.https
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {category} - sensitive
 * @param {serverfunction} - get
 * 
 * **/
 server.get('Saldo', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

    var page = PageMgr.getPage('/saldoLetyClub');

    if (page && page.isVisible()) {
        res.page('/saldoLetyClub');
    } else {
        res.render('account/saldoLetyClub');
    }

    
    next();
}, pageMetaData.computedPageMetaData);

/**
 * Lety-Card : this endpoint is called to get Lety points 
 * @name Base/Lety-Card
 * @function
 * @memberof Account
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - server.middleware.https
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {category} - sensitive
 * @param {serverfunction} - get
 * 
 * **/
 server.get('Movimientos', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

    var page = PageMgr.getPage('/movesLetyClub');

    if (page && page.isVisible()) {
        res.page('/movesLetyClub');
    } else {
        res.render('account/movesLetyClub');
    }

    
    next();
}, pageMetaData.computedPageMetaData);


server.get('ErrorNotFound', function (req, res, next) {
    res.setStatusCode(404);
    res.render('error/notFound');
    next();
});

module.exports = server.exports();
