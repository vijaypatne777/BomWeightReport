sap.ui.define([],function(){return{bold:function(t,r){if(t){if(r.length>0){return"<strong>"+t}return t}},flex:function(t,r){if(t){if(r.length>0){return"<strong>"+t}return" "}},numFormatftotal:function(t){var r={maxFractionDigits:3};var n=sap.ui.core.format.NumberFormat.getFloatInstance(r);if(t){return n.format(t)}},numFormat:function(t){var r={maxFractionDigits:3};var n=sap.ui.core.format.NumberFormat.getFloatInstance(r);if(t){return n.format(t.split(" ")[0])+" "+t.split(" ")[1]}}}});