sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/library",
	"com/bom/bomweight/util/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	"sap/ui/core/util/ExportType"
], function (oController, Export, ExportTypeCSV, CoreLibrary, format, Spreadsheet, MessageToast, ExportType) {
	return oController.extend("com.bom.bomweight.controller.BaseController", {
		onInit: function () {},
		// supra: format,
		// onExcelDownload: function (scope) {
		// 		var oModel = scope.getView().getModel("BRF");
		// 		var oExport = new Export({
		// 			exportType: new ExportTypeCSV({
		// 				charset: "utf-8",
		// 				fileExtension: "csv",
		// 				separatorChar: ",",
		// 				mimeType: "application/csv"
		// 					// mimeType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		// 			}),
		// 			models: oModel,

		// 			rows: {
		// 				path: "/p"
		// 			},
		// 			columns: [{
		// 					name: "Header Material",
		// 					template: {
		// 						content: "{mat}"
		// 					}
		// 				}, {
		// 					name: "Level",
		// 					template: {
		// 						content: "{lvl}"
		// 					}
		// 				}, {
		// 					name: "Masterdata Net Weight",
		// 					template: {
		// 						// content: "{path: '/m/0/mmNW'}"
		// 						content: {
		// 							parts: [{
		// 								path: "/m/0/mmNW"
		// 							}, {
		// 								path: "cnt"
		// 							}],
		// 							formatter: function (a, c) {
		// 								if (c === 1) {
		// 									return a;
		// 								} else {
		// 									return " ";
		// 								}

		// 							}
		// 						}
		// 					}
		// 				}, {
		// 					name: "Masterdata Gross Weight",
		// 					template: {
		// 						// content: "{path: '/m/0/mmGW'}"
		// 						content: {
		// 							parts: [{
		// 								path: "/m/0/mmGW"
		// 							}, {
		// 								path: "cnt"
		// 							}],
		// 							formatter: function (u, v) {
		// 								if (v === 1) {
		// 									return u;
		// 								} else {
		// 									return " ";
		// 								}
		// 							}
		// 						}
		// 					}
		// 				}, {
		// 					name: "BOM Item No",
		// 					template: {
		// 						content: "{itm}"
		// 					}
		// 				}, {
		// 					name: "BOM Component",
		// 					template: {
		// 						content: "{bmc}"
		// 					}
		// 				}, {
		// 					name: "Is Assembly",
		// 					template: {
		// 						content: "{asm}"
		// 					}
		// 				}, {
		// 					name: "Description",
		// 					template: {
		// 						content: "{cmd}"
		// 					}
		// 				}, {
		// 					name: "BOM Quantity",
		// 					template: {
		// 						content: "{qty}"
		// 					}
		// 				}, {
		// 					name: "Net Weight",
		// 					template: {
		// 						content: "{net}"
		// 					}
		// 				}, {
		// 					name: "Gross Weight",
		// 					template: {
		// 						content: "{gro}"
		// 					}
		// 				}, {
		// 					name: "Weight Unit",
		// 					template: {
		// 						content: "{wun}"
		// 					}
		// 				}, {
		// 					name: "Total Net Weight",
		// 					template: {
		// 						content: "{tnt}"
		// 					}
		// 				}, {
		// 					name: "Total Gross Weight",
		// 					template: {
		// 						content: "{tgt}"
		// 					}
		// 				}
		// 				// }, {
		// 				// 	name: "Masterdata Net Weight",
		// 				// 	template: {
		// 				// 		content: {
		// 				// 			parts: [{path:"mnw"},{path: "asm"}],
		// 				// 			formatter: function (u, v, dv) {
		// 				// 				if (u) {
		// 				// 					if (v) {
		// 				// 						if(v.length > 0){
		// 				// 							return u;
		// 				// 						}
		// 				// 						else{
		// 				// 							return " ";
		// 				// 						}
		// 				// 					}
		// 				// 					// return " ";
		// 				// 				}
		// 				// 			}
		// 				// 		}
		// 				// 	}
		// 				// }, {
		// 				// 	name: "Masterdata Gross Weight",
		// 				// 	template: {
		// 				// 			content: {
		// 				// 			parts: ["mgw", "asm"],
		// 				// 			formatter: function (u, v) {
		// 				// 				if (u) {
		// 				// 					if (v) {
		// 				// 						if(v.length > 0){
		// 				// 							return u;
		// 				// 						}
		// 				// 						else{
		// 				// 							return " ";
		// 				// 						}
		// 				// 					}
		// 				// 				}
		// 				// 			}
		// 				// 		}
		// 				// 	}
		// 				// }
		// 			]
		// 		});
		// 		oExport.saveFile().catch(function (oError) {
		// 			sap.m.MessageToast.show("Error");
		// 		}).then(function () {
		// 			oExport.destroy();
		// 		});
		// 	},
		onExcelDownload: function (o) {
			var aCols, aProducts, oSettings, oSheet;

			aCols = o.createColumnConfig();
			aProducts = o.getView().getModel("OPM").getProperty("/");
			var a = new Date();
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts,
				showProgress: false,
				fileName: "BOM Weight Report_" + a.getUTCDate() + "-" + (a.getUTCMonth() + 1) + "-" + a.getUTCFullYear()
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					MessageToast.show("Excel export has finished");
				})
				.finally(function () {
					oSheet.destroy();
				});
		},
		createColumnConfig: function () {
			return [{
				label: "Header Material",
				property: "mat"

			},{
				label: "Level",
				property: "lvl"

			}, {
				label: "Masterdata Net Weight",
				property: "dia"

			}, {
				label: "Masterdata Gross Weight",
				property: "gol"

			}, {
				label: "BOM Item No",
				property: "itm"

			}, {
				label: "BOM Component",
				property: "bmc"

			}, {
				label: "Is Assembly",
				property: "asm"

			}, {
				label: "Description",
				property: "cmd"

			}, {
				label: "BOM Quantity",
				property: "qty"

			}, {
				label: "Net Weight",
				property: "net"

			}, {
				label: "Gross Weight",
				property: "gro"

			}, {
				label: "Weight Unit",
				property: "wun"

			}, {
				label: "Total Net Weight",
				property: "tnt"

			}, {
				label: "Total Gross Weight",
				property: "tgt"

			}];
		}

	});
});