sap.ui.define(["com/bom/bomweight/controller/BaseController","sap/ui/model/Sorter","sap/ui/model/json/JSONModel","sap/m/SearchField","sap/ui/model/Filter","sap/m/MessageBox","com/bom/bomweight/util/formatter"],function(e,t,s,a,r,l,i){"use strict";var o=new sap.m.BusyDialog,n=false;var u=sap.ui.core.format.NumberFormat.getFloatInstance({maxFractionDigits:3,decimalSeparator:",",groupingEnabled:false});return e.extend("com.bom.bomweight.controller.View1",{onInit:function(){this.oColModel=new sap.ui.model.json.JSONModel("Columns/column.json");this.oColModelPlant=new sap.ui.model.json.JSONModel("Columns/columnPlant.json");var e=new s({worklistTableTitle:this.getView().getModel("i18n").getResourceBundle().getText("worklistTableTitle")});this.getView().setModel(e,"worklistView")},inox:i,onGo:function(){o.open();var e=this;l.show(" Do you want to proceed?.",{icon:sap.m.MessageBox.Icon.INFORMATION,title:"          Search BOM",actions:["OK","Cancel"],onClose:function(t){if(t==="OK"){e.onBOMSearch()}if(t==="Cancel"){o.close()}},initialFocus:"OK"})},onBOMSearch:function(){var e=this.getView().byId("multiInput").getValue();$.sap.fm=e;var t=this.getView().byId("idPlant").getValue();if(e.length===0||t.length===0){sap.m.MessageBox.warning("Please enter all mandatory fields.");o.close()}else{$.sap.myVar=true;$.sap.myVars=true;var s=this;var a=new sap.ui.model.json.JSONModel;this.getView().setModel(a,"BRF");var r=new Promise(function(e,t){s.connectServer(e,t)});r.then(function(t){var r={results:""};r.results=t;s.getView().byId("idBOMUsage").setValue(r.results[0].usg);var l=[];var i=[];var n=[];var g=[];for(var m=0;m<r.results.length;m++){l.push(new sap.ui.model.Filter("Product",sap.ui.model.FilterOperator.EQ,r.results[m].bom))}var d=new sap.ui.model.Filter({filters:l,and:false});var c=new Array(new sap.ui.model.Filter({filters:[d]}));var f={p:[],s:[],m:[]};var h=s.getView().getModel("modelB");h.read("/A_Product",{filters:[c],urlParameters:{$select:"GrossWeight,NetWeight,WeightUnit,Product"},async:false,success:function(t,l){for(var m=0;m<t.results.length;m++){i[m]=t.results[m].GrossWeight;n[m]=t.results[m].NetWeight;g[m]=t.results[m].WeightUnit}if(m===t.results.length&&t.results.length!==0&&t.results.length!==undefined){var d=0,c=0;var p=0;for(var v=0;v<r.results.length;v++){for(m=0;m<t.results.length;m++){if(t.results[m].Product===r.results[v].bom){p+=1;f.p.push({lvl:r.results[v].lvl,asm:r.results[v].asm,itm:r.results[v].itm,bmc:r.results[v].bom,mat:r.results[v].mat,qty:r.results[v].qty,gro:t.results[m].GrossWeight,net:t.results[m].NetWeight,tgt:t.results[m].GrossWeight*r.results[v].qty,tnt:t.results[m].NetWeight*r.results[v].qty,mgw:t.results[m].GrossWeight+" "+t.results[m].WeightUnit,mnw:t.results[m].NetWeight+" "+t.results[m].WeightUnit,cmd:r.results[v].des,wun:t.results[m].WeightUnit,cnt:p,dia:"",gol:""})}}}for(m=0;m<f.p.length;m++){if(f.p[m].asm.length===0){d=d+parseFloat(f.p[m].tnt);c=c+parseFloat(f.p[m].tgt)}}f.s.push({addNQ:d,addGQ:c,label:"Total"});h.read("/A_Product",{urlParameters:{$select:"GrossWeight,NetWeight,WeightUnit",$filter:"(Product eq '"+e+"')"},async:false,success:function(e,t){var r=e.results[0].NetWeight,l=e.results[0].GrossWeight,i=e.results[0].WeightUnit;if(e.results.length===1){f.m.push({mmNW:r+" "+i,mmGW:l+" "+i});var n=JSON.parse(JSON.stringify(f.p));n[0].dia=u.format(r)+" "+i;n[0].gol=u.format(l)+" "+i;for(m=0;m<n.length;m++){n[m].net=u.format(n[m].net);n[m].gro=u.format(n[m].gro);n[m].tnt=u.format(n[m].tnt);n[m].tgt=u.format(n[m].tgt)}var g=new sap.ui.model.json.JSONModel;g.setSizeLimit(n.length);g.setData(n);s.getView().setModel(g,"OPM");o.close();a=new sap.ui.model.json.JSONModel;a.setSizeLimit(f.p.length);a.setData(f);s.getView().setModel(a,"BRF")}else{sap.m.MMessageToast.show("Issue in fetched Data")}},error:function(e){o.close();var t=JSON.parse(e.responseText);sap.m.MessageBox.show(t.error.message.value,{icon:sap.m.MessageBox.Icon.WARNING,title:"Dear User",actions:[sap.m.MessageBox.Action.YES],onClose:function(e){if(e==="YES"){return}}})}})}},error:function(e){o.close();var t=JSON.parse(e.responseText);sap.m.MessageBox.show(t.error.message.value,{icon:sap.m.MessageBox.Icon.WARNING,title:"Dear User",actions:[sap.m.MessageBox.Action.YES],onClose:function(e){if(e==="YES"){return}}})}})},function(){})}},connectServer:function(e,t){var s=new sap.ui.model.json.JSONModel;this.getView().setModel(s,"BRF");var a=0,r=false,l,i=[],n=true,u=0,g=[],m=[],d=[],c=0;var f=this.getView().byId("multiInput").getValue();var h=this.getView().byId("idPlant").getValue();var p=[];p.push(f);var v=this.getView().getModel("modelA");$.sap.brk=v;var w=this;var M=function(t,s){if(s===undefined||s.length===0||t===null){o.close();e(i);return 1}for(var f=0;f<s.length;f++){m.push(new sap.ui.model.Filter({filters:[new sap.ui.model.Filter("Material",sap.ui.model.FilterOperator.EQ,s[f]),new sap.ui.model.Filter("Plant",sap.ui.model.FilterOperator.EQ,h)],and:true}))}d.push(new sap.ui.model.Filter({filters:m,and:false}));var v=function(e){return new Promise(function(s,a){t.read(e,{filters:d,urlParameters:{$select:"BillOfMaterialComponent,Plant,IsAssembly,Material,BillOfMaterialItemNumber,ComponentDescription,BillOfMaterialItemQuantity",$orderby:"BillOfMaterialItemNumber"},async:false,success:function(e){s(e)},error:function(e){a(e)}})})};var b=function(e){return new Promise(function(s,a){t.read(e,{filters:d,urlParameters:{$select:"BillOfMaterialVariantUsage,Material"},async:false,success:function(e){s(e)},error:function(e){a(e)}})})};Promise.all([v("/MaterialBOMItem"),b("/MaterialBOM")]).then(function(e){c+=1;for(var t=0;t<e[0].results.length;t++){for(var s=0;s<e[1].results.length;s++){if(e[0].results[t].Material===e[1].results[s].Material){u+=1;g.push({mat:e[0].results[t].Material,itm:e[0].results[t].BillOfMaterialItemNumber,bom:e[0].results[t].BillOfMaterialComponent,asm:e[0].results[t].IsAssembly,des:e[0].results[t].ComponentDescription,qty:e[0].results[t].BillOfMaterialItemQuantity,usg:e[1].results[s].BillOfMaterialVariantUsage,lvl:c,idx:u})}}}if(n){for(var o=0;o<p.length;o++){for(var h=0;h<g.length;h++){if(p[o]===g[h].mat){i.push(g[h])}}}}if(e[0].results===undefined||e[0].results.length===0||e[1].results===undefined||e[1].results.length===0){alert(g.length);M(null,null)}if(r){for(var v=0;v<i.length;v++){for(var b=0;b<g.length;b++){if(i[v].bom===g[b].mat){i[v].asm="X";a+=1;i.splice(v+a,0,g[b])}}a=0}}g=[];n=false;r=true;l=[];var F=e[0].results;var P=[],y=[];for(f=0;f<F.length;f++){P.push(new sap.ui.model.Filter({filters:[new sap.ui.model.Filter("Material",sap.ui.model.FilterOperator.EQ,F[f].BillOfMaterialComponent),new sap.ui.model.Filter("Plant",sap.ui.model.FilterOperator.EQ,F[f].Plant)],and:true}))}y.push(new sap.ui.model.Filter({filters:P,and:false}));var B=w.getView().getModel("modelA");var I=function(e){return new Promise(function(t,s){B.read(e,{filters:y,urlParameters:{$select:"Material"},success:function(e){t(e)},error:function(){}})})};I("/MaterialBOM").then(function(e){for(var t=0;t<e.results.length;t++){l.push(e.results[t].Material)}m=[];d=[];M($.sap.brk,l)})})};M($.sap.brk,p)},onInitGrouping:function(e){var s=$.sap.fm;if(n){var a=false;var r=false;var l=[];var i="lvl";var o=this.getView();var u=o.byId("tab");var g=u.getBinding("items");l.push(new sap.ui.model.Sorter(i,a,r));g.sort(l);n=false}else{this.mGroupFunctions={mat:function(e){var t=e.getProperty("mat");n=true;if(t===s){var a=e.getModel().oData.m[0].mmGW,r=e.getModel().oData.m[0].mmNW;return{key:t,text:t+Array(33).fill(" ").join("")+r+Array(6).fill(" ").join("")+a+Array(5).fill(" ").join("")}}else{n=true;var l=e.getModel().oData.p;var i=[];for(var o=0;o<l.length;o++){i.push(l[o].bmc)}var u=i.indexOf(t);var g=l[u].mnw;var m=l[u].mgw;return{key:t,text:t+Array(33).fill(" ").join("")+g+Array(6).fill(" ").join("")+m}}}};var u=this.byId("tab"),g=u.getBinding("items"),m,d=false,c,f=[],h="cnt";if(e){m=e;d=false;c=this.mGroupFunctions[m];f.push(new t(h,d,c));g.sort(f)}}},onUpdateFinished:function(e){var t,s=e.getSource(),a=e.getParameter("total");if(a&&s.getBinding("items").isLengthFinal()){t=this.getView().getModel("i18n").getResourceBundle().getText("worklistTableTitleCount",[a])}else{t=this.getView().getModel("i18n").getResourceBundle().getText("worklistTableTitle")}this.getView().getModel("worklistView").setProperty("/worklistTableTitle",t)},onFrag:function(e){if(!this._oFrag){this._oFrag=sap.ui.xmlfragment("com.bom.bomweight.Fragments.Help",this)}var t=this._oFrag.getTable();this.fTable=t;t.setModel(this.oColModel,"columns");this._oFrag.setRangeKeyFields([{label:"Material",key:"Material"}]);var s=this._oFrag.getFilterBar();this._oBasicSearchField=new a({showSearchButton:true,search:this.onSearch.bind(this),placeholder:"Search by below 'Material'",enableSuggestions:true});s.setBasicSearch(this._oBasicSearchField);this._oFrag.open()},onFragNext:function(){if(!this._oFragPlant){this._oFragPlant=sap.ui.xmlfragment("com.bom.bomweight.Fragments.PlantHelp",this)}var e=this._oFragPlant.getTable();this.fTablePlant=e;e.setModel(this.oColModelPlant,"columns");this._oFrag.setRangeKeyFields([{label:"Plant",key:"Plant"}]);this._oFragPlant.open()},onValueHelpCancelPressPlant:function(){this._oFragPlant.close()},onFilterBarSearchPlant:function(){var e=this.getView().getModel("modelC");var t=this;o.open();e.read("/YY1_Plant_API",{async:false,success:function(e,s){var a=e.results.length;if(a===e.results.length){var r=new sap.ui.model.json.JSONModel;r.setData(e);var l=t._oFragPlant.getTable();l.setModel(r);o.close();l.bindRows("/results")}else{o.close();sap.m.MessageToast.show("Issue in Odata call")}},error:function(e){o.close();var t=JSON.parse(e.responseText);sap.m.MessageBox.show(t.error.message.value,{icon:sap.m.MessageBox.Icon.WARNING,title:"Dear User",actions:[sap.m.MessageBox.Action.YES],onClose:function(e){if(e==="YES"){return}}})}})},onValueHelpOkPressPlant:function(e){var t=sap.ui.getCore().byId("PlantId"),s=e.getParameter("tokens")[0].getKey();t.updateInputField(s);this._oFragPlant.close()},onValueHelpOkPress:function(e){var t=this.getView().byId("multiInput"),s=e.getParameter("tokens")[0].getKey();t.updateInputField(s);this.getView().byId("idPlant").updateInputField(sap.ui.getCore().byId("PlantId").getValue());this.getView().byId("idBOMUsage").updateInputField(sap.ui.getCore().byId("BOMId").getValue());this._oFrag.close()},onValueHelpCancelPress:function(){this._oFrag.close()},onFilterBarSearch:function(e){var t=sap.ui.getCore().byId("PlantId").getValue(),s=sap.ui.getCore().byId("BOMId").getValue();if(t.length!==0||s.length!==0){o.open();var a=this,r=this.getView().getModel("modelA"),l=new sap.ui.model.Filter("Plant",sap.ui.model.FilterOperator.EQ,t),i=new sap.ui.model.Filter("BillOfMaterialVariantUsage",sap.ui.model.FilterOperator.EQ,s),n=new Array(new sap.ui.model.Filter({filters:[l,i],and:true}));r.read("/MaterialBOM",{filters:n,urlParameters:{$select:"Material,ProductDescription"},async:false,success:function(e,t){var s=e.results.length;if(s===e.results.length){var r=new sap.ui.model.json.JSONModel;r.setData(e);var l=a._oFrag.getTable();l.setModel(r);o.close();l.bindRows("/results")}else{o.close();sap.m.MessageToast.show("Issue in Odata call")}},error:function(e){o.close();var t=JSON.parse(e.responseText);sap.m.MessageBox.show(t.error.message.value,{icon:sap.m.MessageBox.Icon.WARNING,title:"Dear User",actions:[sap.m.MessageBox.Action.YES],onClose:function(e){if(e==="YES"){sap.ui.getCore().byId("PlantId").setValue(null);sap.ui.getCore().byId("BOMId").setValue(null);return}}})}})}else{sap.m.MessageBox.warning("Please enter all mandatory fields.")}},onSearch:function(e){var t=e.getParameter("query"),s=[];if(t){s.push(new sap.ui.model.Filter("Material",sap.ui.model.FilterOperator.Contains,t))}this.filterTable(new r({filters:s,and:true}))},filterTable:function(e){var t=this._oFrag;t.getTableAsync().then(function(s){if(s.bindRows){s.getBinding("rows").filter(e)}if(s.bindItems){s.getBinding("items").filter(e)}t.update()})},onDataExport:function(){this.onExcelDownload(this)},handleGroupButtonPressed:function(){$.sap.n2=true;$.sap.n3=true;this.onInitGrouping("mat")},onLiveChange:function(e){var t=e.getSource().getValue();this.getView().byId("idPlant").setValue(t.toUpperCase())}})});