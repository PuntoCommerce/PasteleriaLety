'use strict';

const base = module.superModule;

var collections = require('*/cartridge/scripts/util/collections');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');

function getAllBreadcrumbs(cgid, pid, breadcrumbs) {
    var URLUtils = require('dw/web/URLUtils');
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var ProductMgr = require('dw/catalog/ProductMgr');

    var category;
    var product;
    if (pid) {
        product = ProductMgr.getProduct(pid);
        category = product.variant
            ? product.masterProduct.primaryCategory
            : product.primaryCategory;
    } else if (cgid) {
        category = CatalogMgr.getCategory(cgid);
    }

    if (category) {
        breadcrumbs.push({
            htmlValue: category.displayName,
            url: URLUtils.url('Search-Show', 'cgid', category.ID)
        });

        if (category.parent && category.parent.ID !== 'root') {
            return getAllBreadcrumbs(category.parent.ID, null, breadcrumbs);
        }
    }

    return breadcrumbs;
}

function getResources() {
    var Resource = require('dw/web/Resource');

    return {
        /* info_selectforstock: Resource.msg('info.selectforstock', 'product',
            'Select Styles for Availability') */
        info_selectforstock: '',
        assistiveSelectedText: Resource.msg('', 'common', null)
    };
}

/**
 * Renders the Product Details Page
 * @param {Object} querystring - query string parameters
 * @param {Object} reqPageMetaData - request pageMetaData object
 * @param {Object} usePageDesignerTemplates - wether to use the page designer version of the product detail templates, defaults to false
 * @returns {Object} contain information needed to render the product page
 */
base.showProductPage = function (querystring, reqPageMetaData) {
    var URLUtils = require('dw/web/URLUtils');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');
    var ProductMgr = require('dw/catalog/ProductMgr');

    var params = querystring;
    var product = ProductFactory.get(params);
    var productCategory = ProductMgr.getProduct(product.id).custom.tipoproducto;
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
    var canonicalUrl = URLUtils.url('Product-Show', 'pid', product.id);
    var breadcrumbs = getAllBreadcrumbs(null, product.id, []).reverse();

    var template = 'product/productDetails';

    if (product.productType === 'bundle' && !product.template) {
        template = 'product/bundleDetails';
    } else if (product.productType === 'set' && !product.template) {
        template = 'product/setDetails';
    } else if (product.template) {
        template = product.template;
    }

    pageMetaHelper.setPageMetaData(reqPageMetaData, product);
    pageMetaHelper.setPageMetaTags(reqPageMetaData, product);
    var schemaData = require('*/cartridge/scripts/helpers/structuredDataHelper').getProductSchema(product);

    var user = session.custom.user

    return {
        template: template,
        product: product,
        addToCartUrl: addToCartUrl,
        resources: getResources(),
        breadcrumbs: breadcrumbs,
        canonicalUrl: canonicalUrl,
        schemaData: schemaData,
        user: user,
        productCategory: productCategory
    };
}

module.exports = base;
