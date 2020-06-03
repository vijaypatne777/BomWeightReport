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
		supra: format,
		// onExcelDownload: function (scope) {
		// 	var oModel = scope.getView().getModel("BRF");
		// 	var oExport = new Export({
		// 		exportType: new ExportTypeCSV({
		// 			charset: "utf-8",
		// 			fileExtension: "csv",
		// 			separatorChar: ",",
		// 			mimeType: "application/csv"
		// 		}),
		// 		models: oModel,

		// 		rows: {
		// 			path: "/p"
		// 		},
		// 		columns: [{
		// 			name: "Item",
		// 			template: {
		// 				content: "{itm}"
		// 			}
		// 		}, {
		// 			name: "Material",
		// 			template: {
		// 				content: "{bmc}"
		// 			}
		// 		}, {
		// 			name: "Quantity",
		// 			template: {
		// 				content: "{qty}"
		// 			}
		// 		}, {
		// 			name: "Net Wt",
		// 			template: {
		// 				content: "{net}"
		// 			}
		// 		}, {
		// 			name: "Gross Wt",
		// 			template: {
		// 				content: "{gro}"
		// 			}
		// 		}, {
		// 			name: "Total Net Wt",
		// 			template: {
		// 				content: "{tnt}"
		// 			}
		// 		}, {
		// 			name: "Total Gross Wt",
		// 			template: {
		// 				content: "{tgt}"
		// 			}
		// 		}, {
		// 			name: "Masterdata Net Wt",
		// 			template: {
		// 				content: "{parts:[{ path: 'mnw'}, { path: 'asm' }] , formatter:'.supra.flex'}"
		// 			}
		// 		}, {
		// 			name: "Masterdata Gross Wt",
		// 			template: {
		// 				content: "{parts:[{ path: 'mgw'}, { path: 'asm' }] , formatter:'.supra.flex'}"
		// 			}
		// 		}]
		// 	});
		// 	oExport.saveFile().catch(function (oError) {
		// 		sap.m.MessageToast.show("Error");
		// 	}).then(function () {
		// 		oExport.destroy();
		// 	});
		// },
			onExcelDownload:function(o){
					var aCols, aProducts, oSettings, oSheet;

			aCols = o.createColumnConfig();
			aProducts = o.getView().getModel("BRF").getProperty('/p');

			oSettings = {
				workbook: { columns: aCols },
				dataSource: aProducts
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show("Spreadsheet export has finished");
				})
				.finally(function() {
					oSheet.destroy();
				});
			},
				createColumnConfig: function() {
			return [
				{
					label: "Item",
					property: "itm"
				
				},
				{
					label: "Material",
					property: "bmc"
					
				},
				{
					label: "Quantity",
					property: "qty"
				
				},
				{
					label: "Net Weight",
					property: "net"
				
				},
				{
					label: "Gross Weight",
					property: "gro"
					
				},
				{
					label: "Total Net Weight",
					property: "tnt"
					
				},
				{
					label: "Total Gross Weight",
					property: "tgt"
					
				}];
		}
	});
});