'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');

var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');


/**
 * Render logic for storefront.imageAndText component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();
    var content = context.content;

   // model.alt = content.alt ? content.alt : null;
    model.text_align = content.text_align;
    model.align = content.align ? content.align : "center";
    model.fontsize = content.fontsize ? content.fontsize : "medium"
    
    return new Template('experience/components/commerce_assets/text_align').render(model).text;
};
