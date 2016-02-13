"use strict";

define(function () {
    let create = function(elementName, opts) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', elementName);

        for (let attribute in opts) {
            let value = opts[attribute];
            element.setAttribute(attribute, value);
        }

        return element;
    };

    return {
        create
    }
});