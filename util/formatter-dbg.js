sap.ui.define([], function () {
	return {
		bold:function(oParam,oParamX){
			if(oParam){
				if(oParamX.length > 0){
					return "<strong>" + oParam;
				}
				return oParam;
			}
		},
		flex:function(u,v){
			if(u){
				if(v.length > 0){
					return "<strong>" + u;
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
				return oFloatFormat.format(input.split(" ")[0]) + " " + input.split(" ")[1];

			}

		}
		
	};
});