"use strict";

const server = require("server");
server.extend(module.superModule);
server.get(
    'Saldo',
    server.middleware.https,
    function (req, res, next) {
        var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');
    var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');

    var accountModel = accountHelpers.getAccountModel(req);
    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

    let LetyCard;
    let SaldoMembresia;
    let FechaAlta;
    let StatusMembresia;    

   if(req.querystring.LetyCard || req.querystring.SaldoMembresia ||req.querystring.FechaAlta || req.querystring.StatusMembresia) {
        LetyCard = req.querystring.LetyCard;
        SaldoMembresia = req.querystring.SaldoMembresia;
        FechaAlta = req.querystring.FechaAlta;
        StatusMembresia = req.querystring.StatusMembresia;
    }

    var page = PageMgr.getPage('/saldoLetyClub');

    if (page && page.isVisible()) {
        res.page('/saldoLetyClub');
    } else {
        res.render('account/saldoLetyClub', {
            Account:
                {
                    LetyCard:LetyCard,
                    SaldoMembresia: SaldoMembresia,
                    FechaAlta: FechaAlta,
                    StatusMembresia: StatusMembresia
                }, 
            addressId: 'Algo'
        });
    }
        next();
    }
);

server.get(
    'Movimientos',
    server.middleware.https,
    function (req, res, next) {
        var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');
    var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');

    var accountModel = accountHelpers.getAccountModel(req);
    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

    var page = PageMgr.getPage('/movesLetyClub');

    if (page && page.isVisible()) {
        res.page('/movesLetyClub');
    } else {
        res.render('account/movesLetyClub');
    }
        next();
    }
);

module.exports = server.exports();