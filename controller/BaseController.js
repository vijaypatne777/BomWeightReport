sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/util/Export","sap/ui/core/util/ExportTypeCSV","sap/ui/core/library","com/bom/bomweight/util/formatter","sap/ui/export/Spreadsheet","sap/m/MessageToast"],function(t,e,n,a,o,r,m){return t.extend("com.bom.bomweight.controller.BaseController",{onInit:function(){},onExcelDownload:function(t){var a=t.getView().getModel("BRF");var o=new e({exportType:new n({charset:"utf-8",fileExtension:"csv",separatorChar:",",mimeType:"application/csv"}),models:a,rows:{path:"/p"},columns:[{name:"Item",template:{content:"{itm}"}},{name:"Father",template:{content:"{mat}"}},{name:"BOM Component",template:{content:"{bmc}"}},{name:"Is Assembly",template:{content:"{asm}"}},{name:"Quantity",template:{content:"{qty}"}},{name:"Net Weight",template:{content:"{net}"}},{name:"Gross Weight",template:{content:"{gro}"}},{name:"Total Net Weight",template:{content:"{tnt}"}},{name:"Total Gross Weight",template:{content:"{tgt}"}},{name:"Masterdata Net Weight",template:{content:{parts:[{path:"mnw"},{path:"asm"}],formatter:function(t,e,n){if(t){if(e){if(e.length>0){return t}else{return" "}}}}}}},{name:"Masterdata Gross Weight",template:{content:{parts:["mgw","asm"],formatter:function(t,e){if(t){if(e){if(e.length>0){return t}else{return" "}}}}}}}]});o.saveFile().catch(function(t){sap.m.MessageToast.show("Error")}).then(function(){o.destroy()})}})});