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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator.js":
/*!************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar processInclude = __webpack_require__(/*! ./util */ \"./cartridges/app_storefront_base/cartridge/client/default/js/util.js\");\n\n$(document).ready(function () {\n    processInclude(__webpack_require__(/*! ./storeLocator/storeLocator */ \"./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js\"));\n});\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* globals google */\n\n\n/**\n * appends params to a url\n * @param {string} url - Original url\n * @param {Object} params - Parameters to append\n * @returns {string} result url with appended parameters\n */\nfunction appendToUrl(url, params) {\n    var newUrl = url;\n    newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {\n        return key + '=' + encodeURIComponent(params[key]);\n    }).join('&');\n\n    return newUrl;\n}\n\n/**\n * Uses google maps api to render a map\n */\nfunction maps() {\n    var map;\n    var infowindow = new google.maps.InfoWindow();\n\n    // Init U.S. Map in the center of the viewport\n    var latlng = new google.maps.LatLng(37.09024, -95.712891);\n    var mapOptions = {\n        scrollwheel: false,\n        zoom: 4,\n        center: latlng\n    };\n\n    map = new google.maps.Map($('.map-canvas')[0], mapOptions);\n    var mapdiv = $('.map-canvas').attr('data-locations');\n\n    mapdiv = JSON.parse(mapdiv);\n\n    var bounds = new google.maps.LatLngBounds();\n\n    // Customized google map marker icon with svg format\n    var markerImg = {\n        path: 'M13.5,30.1460153 L16.8554555,25.5 L20.0024287,25.5 C23.039087,25.5 25.5,' +\n            '23.0388955 25.5,20.0024287 L25.5,5.99757128 C25.5,2.96091298 23.0388955,0.5 ' +\n            '20.0024287,0.5 L5.99757128,0.5 C2.96091298,0.5 0.5,2.96110446 0.5,5.99757128 ' +\n            'L0.5,20.0024287 C0.5,23.039087 2.96110446,25.5 5.99757128,25.5 L10.1445445,' +\n            '25.5 L13.5,30.1460153 Z',\n        fillColor: '#0070d2',\n        fillOpacity: 1,\n        scale: 1.1,\n        strokeColor: 'white',\n        strokeWeight: 1,\n        anchor: new google.maps.Point(13, 30),\n        labelOrigin: new google.maps.Point(12, 12)\n    };\n\n    Object.keys(mapdiv).forEach(function (key) {\n        var item = mapdiv[key];\n        var lable = parseInt(key, 10) + 1;\n        var storeLocation = new google.maps.LatLng(item.latitude, item.longitude);\n        var marker = new google.maps.Marker({\n            position: storeLocation,\n            map: map,\n            title: item.name,\n            icon: markerImg,\n            label: { text: lable.toString(), color: 'white', fontSize: '16px' }\n        });\n\n        marker.addListener('click', function () {\n            infowindow.setOptions({\n                content: item.infoWindowHtml\n            });\n            infowindow.open(map, marker);\n        });\n\n        // Create a minimum bound based on a set of storeLocations\n        bounds.extend(marker.position);\n    });\n    // Fit the all the store marks in the center of a minimum bounds when any store has been found.\n    if (mapdiv && mapdiv.length !== 0) {\n        map.fitBounds(bounds);\n    }\n}\n\n/**\n * Renders the results of the search and updates the map\n * @param {Object} data - Response from the server\n */\nfunction updateStoresResults(data) {\n    var $resultsDiv = $('.results');\n    var $mapDiv = $('.map-canvas');\n    var hasResults = data.stores.length > 0;\n\n    if (!hasResults) {\n        $('.store-locator-no-results').show();\n    } else {\n        $('.store-locator-no-results').hide();\n    }\n\n    $resultsDiv.empty()\n        .data('has-results', hasResults)\n        .data('radius', data.radius)\n        .data('search-key', data.searchKey);\n\n    $mapDiv.attr('data-locations', data.locations);\n\n    if ($mapDiv.data('has-google-api')) {\n        maps();\n    } else {\n        $('.store-locator-no-apiKey').show();\n    }\n\n    if (data.storesResultsHtml) {\n        $resultsDiv.append(data.storesResultsHtml);\n    }\n}\n\n/**\n * Search for stores with new zip code\n * @param {HTMLElement} element - the target html element\n * @returns {boolean} false to prevent default event\n */\nfunction search(element) {\n    var dialog = element.closest('.in-store-inventory-dialog');\n    var spinner = dialog.length ? dialog.spinner() : $.spinner();\n    spinner.start();\n    var $form = element.closest('.store-locator');\n    var radius = $('.results').data('radius');\n    var url = $form.attr('action');\n    var urlParams = { radius: radius };\n\n    var payload = $form.is('form') ? $form.serialize() : { postalCode: $form.find('[name=\"postalCode\"]').val() };\n\n    url = appendToUrl(url, urlParams);\n\n    $.ajax({\n        url: url,\n        type: $form.attr('method'),\n        data: payload,\n        dataType: 'json',\n        success: function (data) {\n            spinner.stop();\n            updateStoresResults(data);\n            $('.select-store').prop('disabled', true);\n        }\n    });\n    return false;\n}\n\nmodule.exports = {\n    init: function () {\n        if ($('.map-canvas').data('has-google-api')) {\n            maps();\n        } else {\n            $('.store-locator-no-apiKey').show();\n        }\n\n        if (!$('.results').data('has-results')) {\n            $('.store-locator-no-results').show();\n        }\n    },\n\n    detectLocation: function () {\n        // clicking on detect location.\n        $('.detect-location').on('click', function () {\n            $.spinner().start();\n            if (!navigator.geolocation) {\n                $.spinner().stop();\n                return;\n            }\n\n            navigator.geolocation.getCurrentPosition(function (position) {\n                var $detectLocationButton = $('.detect-location');\n                var url = $detectLocationButton.data('action');\n                var radius = $('.results').data('radius');\n                var urlParams = {\n                    radius: radius,\n                    lat: position.coords.latitude,\n                    long: position.coords.longitude\n                };\n\n                url = appendToUrl(url, urlParams);\n                $.ajax({\n                    url: url,\n                    type: 'get',\n                    dataType: 'json',\n                    success: function (data) {\n                        $.spinner().stop();\n                        updateStoresResults(data);\n                        $('.select-store').prop('disabled', true);\n                    }\n                });\n            });\n        });\n    },\n\n    search: function () {\n        $('.store-locator-container form.store-locator').submit(function (e) {\n            e.preventDefault();\n            search($(this));\n        });\n        $('.store-locator-container .btn-storelocator-search[type=\"button\"]').click(function (e) {\n            e.preventDefault();\n            search($(this));\n        });\n    },\n\n    changeRadius: function () {\n        $('.store-locator-container .radius').change(function () {\n            var radius = $(this).val();\n            var searchKeys = $('.results').data('search-key');\n            var url = $(this).data('action-url');\n            var urlParams = {};\n\n            if (searchKeys.postalCode) {\n                urlParams = {\n                    radius: radius,\n                    postalCode: searchKeys.postalCode\n                };\n            } else if (searchKeys.lat && searchKeys.long) {\n                urlParams = {\n                    radius: radius,\n                    lat: searchKeys.lat,\n                    long: searchKeys.long\n                };\n            }\n\n            url = appendToUrl(url, urlParams);\n            var dialog = $(this).closest('.in-store-inventory-dialog');\n            var spinner = dialog.length ? dialog.spinner() : $.spinner();\n            spinner.start();\n            $.ajax({\n                url: url,\n                type: 'get',\n                dataType: 'json',\n                success: function (data) {\n                    spinner.stop();\n                    updateStoresResults(data);\n                    $('.select-store').prop('disabled', true);\n                }\n            });\n        });\n    },\n    selectStore: function () {\n        $('.store-locator-container').on('click', '.select-store', (function (e) {\n            e.preventDefault();\n            var selectedStore = $(':checked', '.results-card .results');\n            var data = {\n                storeID: selectedStore.val(),\n                searchRadius: $('#radius').val(),\n                searchPostalCode: $('.results').data('search-key').postalCode,\n                storeDetailsHtml: selectedStore.siblings('label').find('.store-details').html(),\n                event: e\n            };\n\n            $('body').trigger('store:selected', data);\n        }));\n    },\n    updateSelectStoreButton: function () {\n        $('body').on('change', '.select-store-input', (function () {\n            $('.select-store').prop('disabled', false);\n        }));\n    }\n};\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js":
/*!****************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/util.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (include) {\n    if (typeof include === 'function') {\n        include();\n    } else if (typeof include === 'object') {\n        Object.keys(include).forEach(function (key) {\n            if (typeof include[key] === 'function') {\n                include[key]();\n            }\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/util.js?");

/***/ })

/******/ });