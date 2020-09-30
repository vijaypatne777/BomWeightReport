sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/library",
	"com/bom/bomweight/util/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	"sap/ui/core/util/ExportType",
	"sap/ui/export/library"
], function (oController, Export, ExportTypeCSV, CoreLibrary, format, Spreadsheet, MessageToast, ExportType, exportLibrary) {
	return oController.extend("com.bom.bomweight.controller.BaseController", {
		onInit: function () {},
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

			}, {
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