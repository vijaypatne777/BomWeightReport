sap.ui.define([], function () {
	$.sap.myVar = true;
	$.sap.myVars = true;
	return {
		bold: function (oParam, oParamX) {
			if (oParam) {
				if (oParamX.length > 0) {
					return "<strong>" + oParam;
				}
				return oParam;
			}
		},
		flex: function (u, v) {
			if (u) {
				if (v.length > 0) {
					return  " ";
				}
				return " ";
			}
		},
		numFormatftotal: function (input) {
			var oFormatOptions = {
				maxFractionDigits: 3
			};
			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
			if (input) {
				return oFloatFormat.format(input);

			}

		},
		numFormat: function (input) {
			var oFormatOptions = {
				maxFractionDigits: 3
			};
			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
			if (input) {
				// return oFloatFormat.format(input.split(" ")[0]) + " " + input.split(" ")[1];
                      return oFloatFormat.format(input);
			}

		},
		fatrow: function (father) {
			// var a = sap.ui.getCore().byId("__identifier1-container-bomweight---View1--tab-0-txt").getValue();
			if ($.sap.myVar) {
				$.sap.myVar = false;
				// return "Father: " + father;
		
				return father;
			} else if ($.sap.n2){
				$.sap.n2 = false;
                  //return "Father: " + father;
             
                  return father;
			} else {
				
				return " ";
			}
		},
		fatnextrow: function (father) {
			if ($.sap.myVars) {
				$.sap.myVars = false;
				// return "Father: " + father;
				return father;
			} else if($.sap.n3) {
			   $.sap.n3 = false;
                  //return "Father: " + father;
                  return father;
			}else{
				return " ";
			}
		}

	};
});