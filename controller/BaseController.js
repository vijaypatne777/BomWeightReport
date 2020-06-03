sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/util/Export","sap/ui/core/util/ExportTypeCSV","sap/ui/core/library","com/bom/bomweight/util/formatter","sap/ui/export/Spreadsheet","sap/m/MessageToast"],function(e,t,o,r,l,a,n){return e.extend("com.bom.bomweight.controller.BaseController",{onInit:function(){},supra:l,onExcelDownload:function(e){var t,o,r,l;t=e.createColumnConfig();o=e.getView().getModel("BRF").getProperty("/p");r={workbook:{columns:t},dataSource:o};l=new a(r);l.build().then(function(){n.show("Spreadsheet export has finished")}).finally(function(){l.destroy()})},createColumnConfig:function(){return[{label:"Item",property:"itm"},{label:"Material",property:"bmc"},{label:"Quantity",property:"qty"},{label:"Net Weight",property:"net"},{label:"Gross Weight",property:"gro"},{label:"Total Net Weight",property:"tnt"},{label:"Total Gross Weight",property:"tgt"}]}})});