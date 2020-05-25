sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/util/Export","sap/ui/core/util/ExportTypeCSV","sap/ui/core/library"],function(t,e,n,o){return t.extend("com.demo.demo215.controller.BaseController",{onInit:function(){},onExcelDownload:function(t){var o=t.getView().getModel("BRF");var a=new e({exportType:new n({charset:"utf-8",fileExtension:"csv",separatorChar:",",mimeType:"application/csv"}),models:o,rows:{path:"/result"},columns:[{name:"Material",template:{content:"{Mat}"}},{name:"Quantity",template:{content:"{Qty}"}},{name:"Net Weight",template:{content:"{nwt}"}},{name:"Gross Weight",template:{content:"{gwt}"}},{name:"Total Net Weight",template:{content:"{tnwt}"}},{name:"Total Gross Weight",template:{content:"{tgwt}"}}]});a.saveFile().catch(function(t){sap.m.MessageToast.show("Error")}).then(function(){a.destroy()})}})});