sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/library"
], function (oController, Export, ExportTypeCSV, CoreLibrary) {
	return oController.extend("com.demo.demo215.controller.BaseController", {
		onInit: function () {
		},
		onExcelDownload: function (scope) {
			var oModel = scope.getView().getModel("BRF");
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					charset: "utf-8",
					fileExtension: "csv",
					separatorChar: ",",
					mimeType: "application/csv"
				}),
				models: oModel,

				rows: {
					path: "/result"
				},
				columns: [{
					name: "Material",
					template: {
						content: "{Mat}"
					}
				}, {
					name: "Quantity",
					template: {
						content: "{Qty}"
					}
				}, {
					name: "Net Weight",
					template: {
						content: "{nwt}"
					}
				}, {
					name: "Gross Weight",
					template: {
						content: "{gwt}"
					}
				}, {
					name: "Total Net Weight",
					template: {
						content: "{tnwt}"
					}
				}, {
					name: "Total Gross Weight",
					template: {
						content: "{tgwt}"
					}
				}]
			});
			oExport.saveFile().catch(function (oError) {
				sap.m.MessageToast.show("Error");
			}).then(function () {
				oExport.destroy();
			});
		}
	});
});