/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Validates and Return the cquotient namespace provided by the commerce cloud platform\n * @returns {Object} - einsteinUtils or null\n */\nfunction getEinsteinUtils() {\n    var einsteinUtils = window.CQuotient;\n    if (einsteinUtils && (typeof einsteinUtils.getCQUserId === 'function') && (typeof einsteinUtils.getCQCookieId === 'function')) {\n        return einsteinUtils;\n    }\n    return null;\n}\n\n/**\n * Renders the einstein response into a given dom element\n * @param {jQuery} $parentElement parent element where recommendations will show.\n */\nfunction showControls($parentElement) {\n    var $liTemplate = $parentElement.find('.hidden-indicators-template li');\n    var $carouselItems = $parentElement.find('.carousel-item');\n\n    $carouselItems.each(function (index) {\n        var $newIndiator = $liTemplate.clone();\n        if (index === 0) {\n            $parentElement.find('.pd-carousel-indicators').append($newIndiator);\n        } else {\n            $newIndiator.removeClass('active');\n            $parentElement.find('.pd-carousel-indicators').append($newIndiator);\n        }\n        $parentElement.find('.pd-carousel-indicators li').last().attr('data-position', index);\n        $parentElement.removeClass('hide-indicators');\n    });\n}\n\n/**\n * fills in the carousel with product tile html objects\n * @param {string} einsteinResponse string html for product tiles\n * @param {jQuery} $parentElement parent element where recommendations will show.\n */\nfunction fillDomElement(einsteinResponse, $parentElement) {\n    var recommender = $parentElement.data('recommender');\n    var recommendedProducts = einsteinResponse[recommender].recs;\n    if (recommendedProducts && recommendedProducts.length > 0) {\n        var template = $parentElement.data('template');\n        var swatches = $parentElement.data('swatches');\n        var displayRatings = $parentElement.data('displayratings');\n        var components = [];\n        components = recommendedProducts.map(function (recommendedProduct) {\n            var tiledefinition = {};\n            tiledefinition.classxs = $parentElement.data('bsxs');\n            tiledefinition.classsm = $parentElement.data('bssm');\n            tiledefinition.classmd = $parentElement.data('bsmd');\n            tiledefinition.template = template;\n            tiledefinition.swatches = swatches;\n            tiledefinition.displayratings = displayRatings;\n            tiledefinition.model = {\n                type: 'product',\n                id: recommendedProduct.id\n            };\n            return tiledefinition;\n        });\n\n        var url = new URL($parentElement.data('product-load-url'));\n        url.searchParams.append('components', JSON.stringify(components));\n        url.searchParams.append('limit', $parentElement.data('limit'));\n        url.searchParams.append('recommender', recommender);\n        $.ajax({\n            url: url.href,\n            type: 'get',\n            dataType: 'html',\n            success: function (html) {\n                $parentElement.find('.carousel-inner').html(html);\n                showControls($parentElement);\n                $('body').trigger('carousel:setup', {});\n            },\n            error: function () {\n                $parentElement.spinner().stop();\n            }\n        });\n    }\n}\n\n /**\n * Processes a recommendation tile, with an already initialized category specific anchors array\n * @param {jQuery} $parentElement parent element where recommendations will show.\n * @param {Object} einsteinUtils cquotient object\n * @param {Array} anchorsArray array of objects representing anchors\n */\nfunction processRecommendationsTile($parentElement, einsteinUtils, anchorsArray) {\n    var recommender = $parentElement.data('recommender');\n\n    var params = {\n        userId: einsteinUtils.getCQUserId(),\n        cookieId: einsteinUtils.getCQCookieId(),\n        ccver: '1.01'\n    };\n\n    if (anchorsArray) {\n        params.anchors = anchorsArray;\n    }\n\n    /**\n    * Processes a recommendation responses\n    * @param {Object} einsteinResponse cquotient object\n    */\n    function recommendationsReceived(einsteinResponse) {\n        fillDomElement(einsteinResponse, $parentElement);\n        $parentElement.spinner().stop();\n    }\n\n    if (einsteinUtils.getRecs) {\n        einsteinUtils.getRecs(einsteinUtils.clientId, recommender, params, recommendationsReceived);\n    } else {\n        einsteinUtils.widgets = einsteinUtils.widgets || []; // eslint-disable-line no-param-reassign\n        einsteinUtils.widgets.push({\n            recommenderName: recommender,\n            parameters: params,\n            callback: recommendationsReceived\n        });\n    }\n}\n\n/**\n * Processes a recommendation tile, with an already initialized product specific anchors array\n * @param {jQuery} $parentElement parent element where recommendations will show.\n * @returns {Array} - containing an anchor object\n */\nfunction createProductAnchor($parentElement) {\n    return [{\n        id: $parentElement.data('primaryProductId'),\n        sku: $parentElement.data('secondaryProductId'),\n        type: $parentElement.data('alternativeGroupType'),\n        alt_id: $parentElement.data('alternativeGroupId')\n    }];\n}\n\n/**\n * Rerieves data attributes from parent element and converts to gretel compatible recommenders array\n * @param {jQuery} $parentElement parent element where recommendations will show.\n * @returns {Array} - containing an anchor object\n */\nfunction createCategoryAnchor($parentElement) {\n    return [{ id: $parentElement.data('categoryId') }];\n}\n\n/**\n * Gets all placeholder elements, which hold einstein recommendations queries the details from the\n * einstein engine and feeds them back to the dom element\n */\nfunction loadRecommendations() {\n    var einsteinUtils = getEinsteinUtils();\n    if (einsteinUtils) {\n        var $recommendationTiles = $('.einstein-carousel');\n        $recommendationTiles.each(function () {\n            var $parentElement = $(this);\n            $parentElement.spinner().start();\n            if ($(this).closest('.experience-einstein-einsteinCarouselProduct').length) {\n                return processRecommendationsTile($parentElement, einsteinUtils, createProductAnchor($parentElement));\n            } else if ($(this).closest('.experience-einstein-einsteinCarouselCategory').length) {\n                return processRecommendationsTile($parentElement, einsteinUtils, createCategoryAnchor($parentElement));\n            }\n            return processRecommendationsTile($parentElement, einsteinUtils);\n        });\n    }\n}\n\n$(document).ready(function () {\n    loadRecommendations();\n});\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js?");

/***/ })

/******/ });