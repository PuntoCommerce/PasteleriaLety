'use strict';

var collections = require('*/cartridge/scripts/util/collections');
var searchRefinementsFactory = require('*/cartridge/scripts/factories/searchRefinements');
var URLUtils = require('dw/web/URLUtils');
var preferences = require('*/cartridge/config/preferences');
var ProductSortOptions = require('*/cartridge/models/search/productSortOptions');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');

var ACTION_ENDPOINT = 'Search-Show';
var ACTION_ENDPOINT_AJAX = 'Search-ShowAjax';
var DEFAULT_PAGE_SIZE = preferences.defaultPageSize ? preferences.defaultPageSize : 12;


/**
 * Generates URL that removes refinements, essentially resetting search criteria
 *
 * @param {dw.catalog.ProductSearchModel} search - Product search object
 * @param {Object} httpParams - Query params
 * @param {string} [httpParams.q] - Search keywords
 * @param {string} [httpParams.cgid] - Category ID
 * @return {string} - URL to reset query to original search
 */
function getResetLink(search, httpParams) {
    return search.categorySearch
        ? URLUtils.url(ACTION_ENDPOINT_AJAX, 'cgid', httpParams.cgid)
        : URLUtils.url(ACTION_ENDPOINT_AJAX, 'q', httpParams.q);
}

/**
 * Retrieves search refinements
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search object
 * @param {dw.catalog.ProductSearchRefinements} refinements - Search refinements
 * @param {ArrayList.<dw.catalog.ProductSearchRefinementDefinition>} refinementDefinitions - List of
 *     product serach refinement definitions
 * @return {Refinement[]} - List of parsed refinements
 */
function getRefinements(productSearch, refinements, refinementDefinitions) {
    return collections.map(refinementDefinitions, function (definition) {
        var refinementValues = refinements.getAllRefinementValues(definition);
        var values = searchRefinementsFactory.get(productSearch, definition, refinementValues);

        return {
            displayName: definition.displayName,
            isCategoryRefinement: definition.categoryRefinement,
            isAttributeRefinement: definition.attributeRefinement,
            isPriceRefinement: definition.priceRefinement,
            isPromotionRefinement: definition.promotionRefinement,
            values: values
        };
    });
}

/**
 * Returns the refinement values that have been selected
 *
 * @param {Array.<CategoryRefinementValue|AttributeRefinementValue|PriceRefinementValue>}
 *     refinements - List of all relevant refinements for this search
 * @return {Object[]} - List of selected filters
 */
function getSelectedFilters(refinements) {
    var selectedFilters = [];
    var selectedValues = [];

    refinements.forEach(function (refinement) {
        selectedValues = refinement.values.filter(function (value) { return value.selected; });
        if (selectedValues.length) {
            selectedFilters.push.apply(selectedFilters, selectedValues);
        }
    });

    return selectedFilters;
}

/**
 * Configures and returns a PagingModel instance
 *
 * @param {dw.util.Iterator} productHits - Iterator for product search results
 * @param {number} count - Number of products in search results
 * @param {number} pageSize - Number of products to display
 * @param {number} startIndex - Beginning index value
 * @return {dw.web.PagingModel} - PagingModel instance
 */
function getPagingModel(productHits, count, pageSize, startIndex) {
    var PagingModel = require('dw/web/PagingModel');
    var paging = new PagingModel(productHits, count);

    paging.setStart(startIndex || 0);
    paging.setPageSize(pageSize || DEFAULT_PAGE_SIZE);

    return paging;
}

/**
 * Generates URL for [Show] More button
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search object
 * @param {Object} httpParams - HTTP query parameters
 * @return {string} - More button URL
 */
function getShowMoreUrl(productSearch, httpParams) {
    var showMoreEndpoint = 'Search-UpdateGrid';
    var currentStart = httpParams.start || 0;
    var pageSize = httpParams.sz || DEFAULT_PAGE_SIZE;
    var hitsCount = productSearch.count;
    var nextStart;

    var paging = getPagingModel(
        productSearch.productSearchHits,
        hitsCount,
        DEFAULT_PAGE_SIZE,
        currentStart
    );

    if (pageSize >= hitsCount) {
        return '';
    } else if (pageSize > DEFAULT_PAGE_SIZE) {
        nextStart = pageSize;
    } else {
        var endIdx = paging.getEnd();
        nextStart = endIdx + 1 < hitsCount ? endIdx + 1 : null;

        if (!nextStart) {
            return '';
        }
    }

    paging.setStart(nextStart);

    var baseUrl = productSearch.url(showMoreEndpoint);
    var finalUrl = paging.appendPaging(baseUrl);
    return finalUrl;
}

/**
 * Forms a URL that can be used as a permalink with filters, sort, and page size preserved
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search object
 * @param {number} pageSize - 'sz' query param
 * @param {number} startIdx - 'start' query param
 * @return {string} - Permalink URL
 */
function getPermalink(productSearch, pageSize, startIdx) {
    var showMoreEndpoint = 'Search-Show';
    var params = { start: '0', sz: pageSize + startIdx };
    var url = productSearch.url(showMoreEndpoint).toString();
    var appended = urlHelper.appendQueryParams(url, params).toString();
    return appended;
}

/**
 * Compile a list of relevant suggested phrases
 *
 * @param {dw.util.Iterator.<dw.suggest.SuggestedPhrase>} suggestedPhrases - Iterator to retrieve suggestedPhrases
 * @return {SuggestedPhrase[]} - Array of suggested phrases
 */
function getPhrases(suggestedPhrases) {
    var phrase = null;
    var phrases = [];

    while (suggestedPhrases.hasNext()) {
        phrase = suggestedPhrases.next();
        phrases.push({
            value: phrase.phrase,
            url: URLUtils.url(ACTION_ENDPOINT, 'q', phrase.phrase)
        });
    }
    return phrases;
}

/**
 * @param {dw.catalog.Product} product the product
 * @param {string} inventoryListID - optionally specify the inventory list to use
 * @returns {dw.catalog.ProductInventoryRecord} inventory record
 */
function getInventoryRecord(productID, inventoryListID) {
    var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
    var productID = productID || 'undefined';

    var inventoryListID = inventoryListID || session.custom.inventoryListID;
    var inventoryList = ProductInventoryMgr.getInventoryList(inventoryListID);

    if (!inventoryList) {
        inventoryList = ProductInventoryMgr.getInventoryList();
    }

    var productInventoryRecord;
    var retry = false;
    var retryCount = 0;
    do {
        try {
            retry = false;
            productInventoryRecord = inventoryList.getRecord(productID);
        } catch (e) {
            if (e.javaName && e.javaName === 'ORMOptimisticLockingException') {
                retry = true;
                retryCount++;
            } else {
                LoggerWrapper.error('Error in getInventoryRecord: ' + JSON.stringify(e));
            }
        }
    } while (retry);

    if (retryCount > 0) {
        LoggerWrapper.warn('Error in getInventoryRecord. Retry count: {0}', retryCount);
    }

    var inventoryRecord = productInventoryRecord || {
        perpetual: inventoryList.defaultInStockFlag
    };

    return inventoryRecord;
}

/**
 * @constructor
 * @classdesc ProductSearch class
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search object
 * @param {Object} httpParams - HTTP query parameters
 * @param {string} sortingRule - Sorting option rule ID
 * @param {dw.util.ArrayList.<dw.catalog.SortingOption>} sortingOptions - Options to sort search
 *     results
 * @param {dw.catalog.Category} rootCategory - Search result's root category if applicable
 */
function ProductSearch(productSearch, httpParams, sortingRule, sortingOptions, rootCategory, storeID) {
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');
    var Site = require('dw/system/Site');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var storeId = storeID;
    var store = StoreMgr.getStore(storeId);
    var inventoryListID = store ? store.inventoryListID : session.custom.inventoryListID;

    this.pageSize = parseInt(httpParams.sz, 10) || DEFAULT_PAGE_SIZE;
    this.productCount = productSearch.count;

    this.productSearch = productSearch;
    var startIdx = httpParams.start;

    var paging = getPagingModel(
        productSearch.productSearchHits,
        productSearch.count,
        this.pageSize,
        startIdx
    );
    var pagingCount = getPagingModel(
        productSearch.productSearchHits,
        productSearch.count,
        this.productCount,
        startIdx
    );

    var searchSuggestions = productSearch.searchPhraseSuggestions;
    this.isSearchSuggestionsAvailable = searchSuggestions ? searchSuggestions.hasSuggestedPhrases() : false;

    if (this.isSearchSuggestionsAvailable) {
        this.suggestionPhrases = getPhrases(searchSuggestions.suggestedPhrases);
    }

    this.pageNumber = paging.currentPage;
    this.count = productSearch.count;
    this.isCategorySearch = productSearch.categorySearch;
    this.isRefinedCategorySearch = productSearch.refinedCategorySearch;
    this.searchKeywords = productSearch.searchPhrase;

    this.resetLink = getResetLink(productSearch, httpParams);
    this.bannerImageUrl = productSearch.category ? searchHelper.getBannerImageUrl(productSearch.category) : null;

    this.productIds = collections.map(pagingCount.pageElements, function (item) {
        return {
            InventoryRecord: getInventoryRecord(item.productID, inventoryListID),
            productSearchHit: item,
            productID: item.productID
        };
    });

    // Separate the products based on the productAvailablity condition
    var availableProductIds = [];
    var unavailableProductIds = [];
    this.productIds.forEach(function (product) {
        if (product.InventoryRecord.ATS > 0 || product.InventoryRecord.perpetual === true) {
            availableProductIds.push({productID: product.productID, productSearchHit: product.productSearchHit});
        } else {
            unavailableProductIds.push({productID: product.productID, productSearchHit: product.productSearchHit});
        }
    });

    // Concatenate the available and unavailable product IDs
    var formatedProductIds = availableProductIds.concat(unavailableProductIds);
    this.productIds = collections.map(paging.pageElements, function (item, index) {
        var formattedItem = formatedProductIds[index];
        return {
            productID: formattedItem.productID,
            productSearchHit: formattedItem.productSearchHit
        };
    });

    this.productSort = new ProductSortOptions(
        productSearch,
        sortingRule,
        sortingOptions,
        rootCategory,
        paging
    );
    this.showMoreUrl = getShowMoreUrl(productSearch, httpParams);
    this.permalink = getPermalink(
        productSearch,
        parseInt(this.pageSize, 10),
        parseInt(startIdx, 10)
    );

    if (productSearch.category) {
        this.category = {
            name: productSearch.category.displayName,
            id: productSearch.category.ID,
            pageTitle: productSearch.category.pageTitle,
            pageDescription: productSearch.category.pageDescription,
            pageKeywords: productSearch.category.pageKeywords
        };
    }
    this.pageMetaTags = productSearch.pageMetaTags;
}

Object.defineProperty(ProductSearch.prototype, 'refinements', {
    get: function () {
        if (!this.cachedRefinements) {
            this.cachedRefinements = getRefinements(
                this.productSearch,
                this.productSearch.refinements,
                this.productSearch.refinements.refinementDefinitions
            );
        }

        return this.cachedRefinements;
    }
});

Object.defineProperty(ProductSearch.prototype, 'selectedFilters', {
    get: function () {
        return getSelectedFilters(this.refinements);
    }
});

module.exports = ProductSearch;
