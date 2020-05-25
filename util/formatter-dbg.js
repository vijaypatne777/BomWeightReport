sap.ui.define([], function () {
	return {
		iamone: function (oParam) {
			if (oParam) {
				var x = oParam.split(" ")[1];
				return x;
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

		},
				numFormatftotal: function (input) {
			var oFormatOptions = {
				maxFractionDigits: 3
			};
			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
			if (input) {
				return oFloatFormat.format(input);

			}

		}

	};
});