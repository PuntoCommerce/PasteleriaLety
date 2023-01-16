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

    model.input_name = [
        {
            label: content.label_firstName,
            id: content.firstName_id,
            type: content.input_firstName_type
        },
        {
            label: content.label_lastName,
            id: content.lastName_id,
            type: content.input_lastName_type
        }
    ]

    model.input_email = [
        {
            label: content.label_email,
            id: content.email_id,
            type: content.input_email_type
        }
    ]

    model.label_selectTeme = content.label_selectTeme ? content.label_selectTeme : null;
    model.select_teme_id = content.select_teme_id ? content.select_teme_id : null;
    model.select_child_id = content.select_child_id ? content.select_child_id: null;

    model.textArea_id = content.textArea_id ? content.textArea_id : null;
    model.label_textArea = content.label_textArea ? content.label_textArea : null;

    return new Template('experience/components/commerce_assets/contactForm').render(model).text;
};
