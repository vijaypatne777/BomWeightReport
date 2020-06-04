sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/library",
	"com/bom/bomweight/util/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"
], function (oController, Export, ExportTypeCSV, CoreLibrary, format, Spreadsheet, MessageToast) {
	return oController.extend("com.bom.bomweight.controller.BaseController", {
		onInit: function () {},
		// supra: format,
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
					path: "/p"
				},
				columns: [{
					name: "Item",
					template: {
						content: "{itm}"
					}
				}, {
					name: "Father",
					template: {
						content: "{mat}"
					}
				}, {
					name: "BOM Component",
					template: {
						content: "{bmc}"
					}
				}, {
					name: "Is Assembly",
					template: {
						content: "{asm}"
					}
				}, {
					name: "Quantity",
					template: {
						content: "{qty}"
					}
				}, {
					name: "Net Weight",
					template: {
						content: "{net}"
					}
				}, {
					name: "Gross Weight",
					template: {
						content: "{gro}"
					}
				}, {
					name: "Total Net Weight",
					template: {
						content: "{tnt}"
					}
				}, {
					name: "Total Gross Weight",
					template: {
						content: "{tgt}"
					}
				}, {
					name: "Masterdata Net Weight",
					template: {
						content: {
							parts: [{path:"mnw"},{path: "asm"}],
							formatter: function (u, v, dv) {
								if (u) {
									if (v) {
										if(v.length > 0){
											return u;
										}
										else{
											return " ";
										}
									}
									// return " ";
								}
							}
						}
					}
				}, {
					name: "Masterdata Gross Weight",
					template: {
							content: {
							parts: ["mgw", "asm"],
							formatter: function (u, v) {
								if (u) {
									if (v) {
										if(v.length > 0){
											return u;
										}
										else{
											return " ";
										}
									}
								}
							}
						}
					}
				}]
			});
			oExport.saveFile().catch(function (oError) {
				sap.m.MessageToast.show("Error");
			}).then(function () {
				oExport.destroy();
			});
		}
		// onExcelDownload:function(o){
		// 		var aCols, aProducts, oSettings, oSheet;

		// aCols = o.createColumnConfig();
		// aProducts = o.getView().getModel("BRF").getProperty('/p');

		// oSettings = {
		// 	workbook: { columns: aCols },
		// 	dataSource: aProducts
		// };

		// oSheet = new Spreadsheet(oSettings);
		// oSheet.build()
		// 	.then( function() {
		// 		MessageToast.show("Spreadsheet export has finished");
		// 	})
		// 	.finally(function() {
		// 		oSheet.destroy();
		// 	});
		// },
		// 		createColumnConfig: function() {
		// 	return [
		// 		{
		// 			label: "Item",
		// 			property: "itm"

		// 		},
		// 		{
		// 			label: "Father",
		// 			property: "mat"

		// 		},
		// 		{
		// 			label: "BOM Component",
		// 			property: "bmc"

		// 		},
		// 		{
		// 			label: "Is Assembly",
		// 			property: "asm"

		// 		},
		// 		{
		// 			label: "Quantity",
		// 			property: "qty"

		// 		},
		// 		{
		// 			label: "Net Weight",
		// 			property: "net"

		// 		},
		// 		{
		// 			label: "Gross Weight",
		// 			property: "gro"

		// 		},
		// 		{
		// 			label: "Total Net Weight",
		// 			property: "tnt"

		// 		},
		// 		{
		// 			label: "Total Gross Weight",
		// 			property: "tgt"

		// 		},
		// 			{
		// 			label: "Masterdata Net Weight",
		// 			property: "mat"

		// 		},
		// 			{
		// 			label: "Masterdata Gross Weight",
		// 			property: "mat"

		// 		}];
		// }
	});
});