sap.ui.define([],function(){return{iamone:function(t){if(t){var r=t.split(" ")[1];return r}},numFormat:function(t){var r={maxFractionDigits:3};var a=sap.ui.core.format.NumberFormat.getFloatInstance(r);if(t){return a.format(t.split(" ")[0])+" "+t.split(" ")[1]}},numFormatftotal:function(t){var r={maxFractionDigits:3};var a=sap.ui.core.format.NumberFormat.getFloatInstance(r);if(t){return a.format(t)}}}});