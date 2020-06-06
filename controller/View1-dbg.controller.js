sap.ui.define([
	"com/bom/bomweight/controller/BaseController",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/m/SearchField",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"com/bom/bomweight/util/formatter"
], function (Controller, Sorter, Jm, SearchField, Filter, MessageBox, formatter) {
	"use strict";
	var oBusyDialog = new sap.m.BusyDialog(),
		flag = false;
	return Controller.extend("com.bom.bomweight.controller.View1", {
		onInit: function () {
			this.oColModel = new sap.ui.model.json.JSONModel("Columns/column.json");
			this.oColModelPlant = new sap.ui.model.json.JSONModel("Columns/columnPlant.json");
			var f = new Jm({
				worklistTableTitle: this.getView().getModel("i18n").getResourceBundle().getText("worklistTableTitle")
			});
			this.getView().setModel(f, "worklistView");
		},
		inox: formatter,
		onGo: function () {
			oBusyDialog.open();
			var that = this;
			MessageBox.show(
				" Do you want to proceed?.", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "          Search BOM",
					actions: ["OK", "Cancel"],
					onClose: function (oAction) {
						if (oAction === "OK") {
							that.onBOMSearch();
						}
						if (oAction === "Cancel") {
							oBusyDialog.close();
						}
					},
					initialFocus: "OK"
				}
			);
		},
		onBOMSearch: function () {
			var material = this.getView().byId("multiInput").getValue();
			$.sap.fm = material;
			var plant = this.getView().byId("idPlant").getValue(),
				bomusage = this.getView().byId("idBOMUsage").getValue();
			if (material.length === 0 || plant.length === 0 || bomusage.length === 0) {
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
				oBusyDialog.close();
			} else {
				// var dialog = new sap.m.BusyDialog({

				// 	text: 'Loading Data...'

				// });
				// dialog.open();
				$.sap.myVar = true;
				$.sap.myVars = true;
				var that = this;
				var ocModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(ocModel, "BRF");
				var m = [];
				var s = [];
				var M = false;
				var n = "";
				var v = 0;
				var u = true;
				var d = [];
				var g = 0;
				var y = 0;
				var S = "";
				var l = 0;
				var f = false;
				var i = new sap.ui.model.json.JSONModel();
				var o = new sap.ui.model.json.JSONModel();
				var r = new sap.ui.model.json.JSONModel();
				var pmt = [];
				var jee = 0;
				var t = "/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=0002";
				var b = new sap.ui.model.odata.ODataModel(t, true);
				b.setDefaultBindingMode("TwoWay");
				b.read("/MaterialBOM", {
					urlParameters: {
						"$filter": "BillOfMaterialVariantUsage eq '" + bomusage + "' and Plant eq '" + plant + "' and Material eq '" + material + "'",
						"$select": "Material"
					},
					async: false,
					success: function (t, a) {
						for (var r = 0; r < t.results.length; r++) {
							m[r] = t.results[r].Material;
						}
						if (t.results === undefined || t.results.length === 0) {
							oBusyDialog.close();
							sap.m.MessageToast.show("No Valid Records Found");
							return;
						}
						var c = "/OPENSAP/sap/opu/odata/sap/API_BILL_OF_MATERIAL_SRV;v=0002";
						var p = new sap.ui.model.odata.ODataModel(c, true);
						p.setDefaultBindingMode("TwoWay");
						g = m.length;
						do {
							d = [];
							d[0] = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, m[y]);
							d[1] = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, plant);
							p.read("/MaterialBOMItem", {
								filters: d,
								urlParameters: {
									"$select": "BillOfMaterialCategory,BillOfMaterialVariant,BillOfMaterialVersion,BillOfMaterialItemNodeNumber,Material,Plant,BillOfMaterialItemUUID,ValidityStartDate,ValidityEndDate,EngineeringChangeDocument,BillOfMaterialComponent,BillOfMaterialItemCategory,BillOfMaterialItemNumber,BillOfMaterialItemUnit,BillOfMaterialItemQuantity,IsAssembly,ComponentDescription,BOMItemIsSalesRelevant,IsProductionRelevant,BOMItemIsCostingRelevant,IsEngineeringRelevant,RequiredComponent,IsSubItem,BillOfMaterial,SpecialProcurementType"
								},
								async: false,
								success: function (e, t) {
									var a = e.results[0].BillOfMaterial;
									var r = e.results[0].BillOfMaterialCategory;
									var c = e.results[0].BillOfMaterialVariant;
									var g = e.results[0].BillOfMaterialVersion;
									var M = e.results[0].EngineeringChangeDocument;
									var h = e.results[0].Material;
									var T = e.results[0].Plant;
									var w = "/MaterialBOM(BillOfMaterial='" + a + "',BillOfMaterialCategory='" + r + "',BillOfMaterialVariant='" + c +
										"',BillOfMaterialVersion='" + g + "',EngineeringChangeDocument='" + M + "',Material='" + h + "',Plant='" + T + "')";
									p.read(w, {
										filters: d,
										urlParameters: {
											"$select": "BillOfMaterialVariantUsage,Material"
										},
										async: false,
										success: function (e, t) {
											S = e.BillOfMaterialVariantUsage;
										},
										error: function (uz) {
											oBusyDialog.close();
											// dialog.close();
											var err = JSON.parse(uz.response.body);
											sap.m.MessageBox.show(
												err.error.message.value, {
													icon: sap.m.MessageBox.Icon.WARNING,
													title: "Dear User",
													actions: [sap.m.MessageBox.Action.YES],
													onClose: function (oAction) {
														if (oAction === "YES") {
															return;
														}
													}
												}
											);
										}
									});
									if (!f) {} else {
										l = l + 1;
										f = false;
									}
									if (u) {
										//--------------------------- added fpr level
										for (var O = 0; O < e.results.length; O++) {
											e.results[O].IsSubItem = l;
										}
										//--------------------------- added fpr level
										o.setData(e);
										u = false;
									} else {
										//-----------------------------added for level
										for (var R = 0; R < e.results.length; R++) {
											e.results[R].IsSubItem = l;
										}
										//-----------------------------
										i.setData(e);
										for (var b = 0; b < i.getProperty("/results").length; b++) {
											o.getProperty("/results").push(i.getProperty("/results/" + b));
										}

									}
									for (var b = 0; b < e.results.length; b++) {
										if (e.results[b].IsAssembly.length > 0) {
											n = "X";
											s[v] = e.results[b].BillOfMaterialComponent;
											pmt[jee] = e.results[b].BillOfMaterialComponent;
											jee++;
											v++;
										}
									}
									if (s.length > 0) {
										n = "X";
									} else {
										n = "";
									}
								},
								error: function (Oo) {
									oBusyDialog.close();
									// dialog.close();
									var err = JSON.parse(Oo.response.body);
									sap.m.MessageBox.show(
										err.error.message.value, {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Dear User",
											actions: [sap.m.MessageBox.Action.YES],
											onClose: function (oAction) {
												if (oAction === "YES") {
													return;
												}
											}
										}
									);
								}
							});
							y = y + 1;
							if (y < m.length) {
								M = true;
							} else if (n.length > 0) {
								m = [];
								m = s;
								y = 0;
								f = true;
								v = 0;
								s = [];
								M = true;
							} else {
								M = false;
							}
						}
						while (M);
					},
					error: function (oError) {
						oBusyDialog.close();
						// dialog.close();
						var err = JSON.parse(oError.response.body);
						sap.m.MessageBox.show(
							err.error.message.value, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Dear User",
								actions: [sap.m.MessageBox.Action.YES],
								onClose: function (oAction) {
									if (oAction === "YES") {
										that.getView().byId("multiInput").setValue(null);
										that.getView().byId("idPlant").setValue(null);
										that.getView().byId("idBOMUsage").setValue(null);

										return;
									}
								}
							}
						);
					}
				});
				var data = o.getData();
				var compFilter = [];
				var gw = [];
				var nw = [];
				var wu = [];
				for (var q = 0; q < data.results.length; q++) { // var q
					compFilter.push(new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, data.results[q].BillOfMaterialComponent));
				}
				var ocompFilter = new sap.ui.model.Filter({
					filters: compFilter,
					and: false
				});
				var oFilter = new Array(new sap.ui.model.Filter({ // var oFilter
					filters: [ocompFilter]
				}));

				var k = {
					p: [],
					s: [],
					m: []
				};
				// var xx = "/OPENSAP/sap/opu/odata/sap/API_PRODUCT_SRV;v=0002";
				// var nm = new sap.ui.model.odata.ODataModel(xx, true);
				var model = this.getView().getModel("modelB");
				model.read("/A_Product", {
					filters: [oFilter],
					urlParameters: {
						"$select": "GrossWeight,NetWeight,WeightUnit,Product"
					},
					async: false,
					success: function (x, p) {
						for (i = 0; i < x.results.length; i++) {
							gw[i] = x.results[i].GrossWeight;
							nw[i] = x.results[i].NetWeight;
							wu[i] = x.results[i].WeightUnit;
						}
						if (i === x.results.length && x.results.length !== 0 && x.results.length !== undefined) {
							var addNQ = 0,
								addGQ = 0;
							// if (x.results.length === data.results.length) {
							var count = 0;
							for (g = 0; g < data.results.length; g++) {
								for (i = 0; i < x.results.length; i++) {
									if (x.results[i].Product === data.results[g].BillOfMaterialComponent) {
										count += 1;
										k.p.push({
											lvl: data.results[g].IsSubItem,
											asm: data.results[g].IsAssembly,
											itm: data.results[g].BillOfMaterialItemNumber,
											bmc: data.results[g].BillOfMaterialComponent,
											mat: data.results[g].Material,
											qty: data.results[g].BillOfMaterialItemQuantity,
											gro: x.results[i].GrossWeight,
											net: x.results[i].NetWeight,
											tgt: x.results[i].GrossWeight * data.results[g].BillOfMaterialItemQuantity,
											tnt: x.results[i].NetWeight * data.results[g].BillOfMaterialItemQuantity,
											mgw: x.results[i].GrossWeight + " " + x.results[i].WeightUnit,
											mnw: x.results[i].NetWeight + " " + x.results[i].WeightUnit,
											cmd: data.results[g].ComponentDescription,
											wun: x.results[i].WeightUnit,
											cnt: count,
											dia: "",
											gol: ""
										});
									}
								}
							}
							for (i = 0; i < k.p.length; i++) {
								if (k.p[i].asm.length === 0) {
									addNQ = addNQ + parseFloat(k.p[i].tnt);
									addGQ = addGQ + parseFloat(k.p[i].tgt);
								}
							}
							k.s.push({
								addNQ: addNQ,
								addGQ: addGQ,
								label: "Total"

							});
							model.read("/A_Product", {
								urlParameters: {
									"$select": "GrossWeight,NetWeight,WeightUnit",
									"$filter": "(Product eq '" + material + "')"
								},
								async: false,
								success: function (dx, xd) {
									var mmNW = dx.results[0].NetWeight,
										mmGW = dx.results[0].GrossWeight,
										mmWU = dx.results[0].WeightUnit;
									if (dx.results.length === 1) {
										k.m.push({
											mmNW: mmNW + " " + mmWU,
											mmGW: mmGW + " " + mmWU
										});
										// dialog.close();
										var ice = JSON.parse(JSON.stringify(k.p));
										ice[0].dia = mmNW + " " + mmWU;
										ice[0].gol = mmGW + " " + mmWU;
										var emod = new sap.ui.model.json.JSONModel();
										emod.setSizeLimit(ice.length);
										emod.setData(ice);
										that.getView().setModel(emod, "OPM");
										oBusyDialog.close();
										ocModel = new sap.ui.model.json.JSONModel();
										ocModel.setSizeLimit(k.p.length);
										ocModel.setData(k);
										that.getView().setModel(ocModel, "BRF");
									} else {
										sap.m.MMessageToast.show("Issue in fetched Data");
									}
								},
								error: function (oError) {
									oBusyDialog.close();
									// dialog.close();
									var err = JSON.parse(oError.responseText);
									sap.m.MessageBox.show(
										err.error.message.value, {
											icon: sap.m.MessageBox.Icon.WARNING,
											title: "Dear User",
											actions: [sap.m.MessageBox.Action.YES],
											onClose: function (oAction) {
												if (oAction === "YES") {
													return;
												}
											}
										}
									);
								}
							});

						}
					},
					error: function (oError) {
						oBusyDialog.close();
						// dialog.close();
						var err = JSON.parse(oError.responseText);
						sap.m.MessageBox.show(
							err.error.message.value, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Dear User",
								actions: [sap.m.MessageBox.Action.YES],
								onClose: function (oAction) {
									if (oAction === "YES") {
										return;
									}
								}
							}
						);
					}
				});
			}
		},
		onInitGrouping: function (o) {
			// var cmat = this.getView().byId("multiInput").getValue();
			var cmat = $.sap.fm;
			if (flag) {
				// var oTab = this.byId("tab");
				// var d = oTab.getBinding("items");
				// d.sort("itm",false);
				//start

				// var oSortByDescnd = oEvent.getParameters().sortDescending; // Get Sort By (Ascending/Descending)
				// var oSortObj = oEvent.getParameters().sortItem.getText(); // get the sort Obj Value (Mat No/Cust Name etc)
				var DESCENDING = false;
				var GROUP = false;
				var aSorter = [];
				var SORTKEY = "lvl";
				// if (oSortByDescnd) {
				// 	DESCENDING = true;
				// } else {
				// 	DESCENDING = false;
				// }

				var oView = this.getView();
				var oTable = oView.byId("tab");
				//var oBinding = oTable.getBinding("items");
				var oBinding = oTable.getBinding("items");
				// if (oSortObj === "Header Material") {
				// 	SORTKEY = "BillOfMaterialVersion";
				// } else if (oSortObj === "BOM Component") {
				// 	SORTKEY = "Material";
				// } else if (oSortObj === "Component Description") {
				// 	SORTKEY = "ComponentDescription";
				// } else if (oSortObj === "Level") {
				// 	SORTKEY = "IsSubItem";
				// } else if (oSortObj === "BOM Qty Item No") {
				// 	SORTKEY = "BillOfMaterialItemNumber";
				// }
				/*else if (oSortObj === "BOM Quantity") {
									SORTKEY = "BillOfMaterialItemQuantity";
								}*/
				aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
				oBinding.sort(aSorter);
				flag = false;

			} else {
				// this.mGroupFunctions = {
				// 	mat: function (oContext) {
				// 		var name = oContext.getProperty("mat");

				// 		// var kn = name.split(" ")[1];
				// 		// var tn = name.split(" ")[0] + " " + "(Father)";

				// 		if (name === cmat) {
				// 			var odgc = oContext.getModel().oData.m[0].mmGW,
				// 				odnc = oContext.getModel().oData.m[0].mmNW;
				// 			return {
				// 				key: name,
				// 				text: name + " " + "(Father)" + Array(241).fill('\xa0').join('') + odnc + Array(20).fill('\xa0').join('') + odgc
				// 					// renderWhitespace:true
				// 			};
				// 		}
				// 		// } else {
				// 		// 	return {
				// 		// 		key: name,
				// 		// 		text: name
				// 		// 	};
				// 		// }
				// 		else {
				// 			// var path = oContext.getPath().split("/")[2];

				// 			// var net = oContext.getModel().oData.p[path].net;
				// 			// var gro = oContext.getModel().oData.p[path].gro;
				// 			var arr = oContext.getModel().oData.p;
				// 			var arrOne = [];
				// 			for (var i = 0; i < arr.length; i++) {
				// 				arrOne.push(arr[i].bmc);
				// 			}
				// 			var k = arrOne.indexOf(name);
				// 			var net = arr[k].mnw;
				// 			var gro = arr[k].mgw;
				// 			// if(chk.length > 0){
				// 			return {
				// 				key: name,
				// 				text: name + Array(255).fill('\xa0').join('') + net + Array(20).fill('\xa0').join('') + gro
				// 					// renderWhitespace:true
				// 			};
				// 			// }else{
				// 			// 	return{
				// 			// 		key: name,
				// 			// 		text: name
				// 			// 	};
				// 			// }
				// 		}

				// 	}
				// };

				this.mGroupFunctions = {
					mat: function (oContext) {
						var name = oContext.getProperty("mat");
						flag = true;
						// var kn = name.split(" ")[1];
						// var tn = name.split(" ")[0] + " " + "(Father)";

						if (name === cmat) {
							var odgc = oContext.getModel().oData.m[0].mmGW,
								odnc = oContext.getModel().oData.m[0].mmNW;
							return {
								key: name,
								text: name + Array(33).fill('\xa0').join('') + odnc + Array(6).fill('\xa0').join('') + odgc + Array(5).fill('\xa0').join('') +
									"(Father Material)"
									// renderWhitespace:true
							};

						}
						// } else {
						// 	return {
						// 		key: name,
						// 		text: name
						// 	};
						// }
						else {
							// var path = oContext.getPath().split("/")[2];

							// var net = oContext.getModel().oData.p[path].net;
							// var gro = oContext.getModel().oData.p[path].gro;
							flag = true;
							var arr = oContext.getModel().oData.p;
							var arrOne = [];
							for (var i = 0; i < arr.length; i++) {
								arrOne.push(arr[i].bmc);
							}
							var k = arrOne.indexOf(name);
							var net = arr[k].mnw;
							var gro = arr[k].mgw;
							// if(chk.length > 0){
							return {
								key: name,
								text: name + Array(33).fill('\xa0').join('') + net + Array(6).fill('\xa0').join('') + gro
									// renderWhitespace:true
							};

							// }else{
							// 	return{
							// 		key: name,
							// 		text: name
							// 	};
							// }
						}

					}
				};
				var oTable = this.byId("tab"),
					// mParams = oEvent.getParameters(),
					oBinding = oTable.getBinding("items"),
					sPath,
					bDescending = false,
					vGroup,
					aGroups = [];
				// aGroupsn = [];
				if (o) {
					sPath = o;
					bDescending = false;
					vGroup = this.mGroupFunctions[sPath];
					aGroups.push(new Sorter(sPath, bDescending, vGroup));
					// aGroupsn.push(new Sorter(jj, null));
					// delete aGroups[0].bDescending;
					oBinding.sort(aGroups);

					// oBinding.sort(aGroupsn);
				}
			}
		},
		onUpdateFinished: function (e) {
			var t, a = e.getSource(),
				i = e.getParameter("total");
			if (i && a.getBinding("items").isLengthFinal()) {
				t = this.getView().getModel("i18n").getResourceBundle().getText("worklistTableTitleCount", [i]);
			} else {
				t = this.getView().getModel("i18n").getResourceBundle().getText("worklistTableTitle");
			}
			this.getView().getModel("worklistView").setProperty("/worklistTableTitle", t);

		},
		onFrag: function (oEvent) {
			if (!this._oFrag) {
				this._oFrag = sap.ui.xmlfragment("com.bom.bomweight.Fragments.Help", this);
			}
			var oTable = this._oFrag.getTable();
			this.fTable = oTable;
			// oTable.setSelectionMode('Single');
			oTable.setModel(this.oColModel, "columns");
			this._oFrag.setRangeKeyFields([{
				label: "Material",
				key: "Material"
			}]);
			var oFilterBar = this._oFrag.getFilterBar();
			this._oBasicSearchField = new SearchField({
				showSearchButton: true,
				search: this.onSearch.bind(this),
				placeholder: "Search by below 'Material'",
				enableSuggestions: true
					// suggest:this.onSuggest.bind(this)
			});
			oFilterBar.setBasicSearch(this._oBasicSearchField);

			this._oFrag.open();

		},
		onFragNext: function () {
			if (!this._oFragPlant) {
				this._oFragPlant = sap.ui.xmlfragment("com.bom.bomweight.Fragments.PlantHelp", this);
			}
			var oTablePlant = this._oFragPlant.getTable();
			this.fTablePlant = oTablePlant;
			// oTable.setSelectionMode('Single');
			oTablePlant.setModel(this.oColModelPlant, "columns");
			this._oFrag.setRangeKeyFields([{
				label: "Plant",
				key: "Plant"
			}]);
			// var oFilterBar = this._oFragPlant.getFilterBar();
			// this._oBasicSearchFieldPlant = new SearchField({
			// 	showSearchButton: true,
			// 	search: this.onSearch.bind(this),
			// 	placeholder: "Search by below 'Material'",
			// 	enableSuggestions: true
			// });
			// oFilterBar.setBasicSearch(this._oBasicSearchField);

			this._oFragPlant.open();
		},
		onValueHelpCancelPressPlant: function () {
			this._oFragPlant.close();
		},
		onFilterBarSearchPlant: function () {
			var moP = this.getView().getModel("modelC");
			var that = this;
			oBusyDialog.open();
			moP.read("/YY1_Plant_API", {
				async: false,
				success: function (x, y) {

					var mn = x.results.length;
					if (mn === x.results.length) {
						var rmoP = new sap.ui.model.json.JSONModel();
						rmoP.setData(x);
						var oTableN = that._oFragPlant.getTable();

						oTableN.setModel(rmoP);
						oBusyDialog.close();
						oTableN.bindRows("/results");

					} else {
						oBusyDialog.close();
						sap.m.MessageToast.show("Issue in Odata call");
					}
				},
				error: function (k) {
					oBusyDialog.close();

					var err = JSON.parse(k.responseText);
					sap.m.MessageBox.show(
						err.error.message.value, {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Dear User",
							actions: [sap.m.MessageBox.Action.YES],
							onClose: function (oAction) {
								if (oAction === "YES") {
									return;
								}
							}
						}
					);
				}
			});
		},
		onValueHelpOkPressPlant: function (oEvent) {
			var oInputFirst = sap.ui.getCore().byId("PlantId"),
				aTokens = oEvent.getParameter("tokens")[0].getKey();
			oInputFirst.updateInputField(aTokens);
			this._oFragPlant.close();
		},
		onValueHelpOkPress: function (oEvent) {
			var oInputFirst = this.getView().byId("multiInput"),
				aTokens = oEvent.getParameter("tokens")[0].getKey();
			oInputFirst.updateInputField(aTokens);
			this.getView().byId("idPlant").updateInputField(sap.ui.getCore().byId("PlantId").getValue());
			this.getView().byId("idBOMUsage").updateInputField(sap.ui.getCore().byId("BOMId").getValue());
			this._oFrag.close();

		},
		onValueHelpCancelPress: function () {
			this._oFrag.close();
		},
		onFilterBarSearch: function (oEvent) {
			var splant = sap.ui.getCore().byId("PlantId").getValue(),
				sBom = sap.ui.getCore().byId("BOMId").getValue();
			if (splant.length !== 0 || sBom.length !== 0) {
				oBusyDialog.open();
				var that = this,
					mod = this.getView().getModel("modelA"),
					oFragPlant = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, splant),
					oFragBomUsage = new sap.ui.model.Filter("BillOfMaterialVariantUsage", sap.ui.model.FilterOperator.EQ, sBom),
					oFirstFilter = new Array(new sap.ui.model.Filter({
						filters: [oFragPlant, oFragBomUsage],
						and: true
					}));

				mod.read("/MaterialBOM", {
					filters: oFirstFilter,
					urlParameters: {
						"$select": "Material,ProductDescription"
					},
					async: false,
					success: function (x, y) {

						var i = x.results.length;
						if (i === x.results.length) {
							var rmod = new sap.ui.model.json.JSONModel();
							rmod.setData(x);
							var oTableN = that._oFrag.getTable();

							oTableN.setModel(rmod);
							oBusyDialog.close();
							oTableN.bindRows("/results");

						} else {
							oBusyDialog.close();
							sap.m.MessageToast.show("Issue in Odata call");
						}
					},
					error: function (k) {
						oBusyDialog.close();

						var err = JSON.parse(k.responseText);
						sap.m.MessageBox.show(
							err.error.message.value, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Dear User",
								actions: [sap.m.MessageBox.Action.YES],
								onClose: function (oAction) {
									if (oAction === "YES") {
										sap.ui.getCore().byId("PlantId").setValue(null);
										sap.ui.getCore().byId("BOMId").setValue(null);
										return;
									}
								}
							}
						);
					}
				});
			} else {
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
			}
		},
		onSearch: function (oEvent) {
			var sSearchQuery = oEvent.getParameter("query"),
				sFilter = [];
			if (sSearchQuery) {
				sFilter.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sSearchQuery));
			}
			this.filterTable(new Filter({
				filters: sFilter,
				and: true
			}));

		},
		filterTable: function (oFilter) {
			var oValueHelpDialog = this._oFrag;

			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				oValueHelpDialog.update();
			});
		},
		onDataExport: function () {
			this.onExcelDownload(this);
		},
		// handleGroupButtonPressed: function () {
		// 	this._oDialog = sap.ui.xmlfragment("com.bom.bomweight.view.SettingsDialog", this);
		// 	this._oDialog.open();
		// },
		// handleGroupDialogConfirm: function (oEvent) {
		// 	if (oEvent.getParameter("groupItem") === undefined) {
		// 		var oTab = this.byId("tab");
		// 		var d = oTab.getBinding("items");
		// 		d.sort("itm",false);
		// 	} else {
		// 		var cmat = this.getView().byId("multiInput").getValue();
		// 		this.mGroupFunctions = {
		// 			mat: function (oContext) {
		// 				var name = oContext.getProperty("mat");

		// 				// var kn = name.split(" ")[1];
		// 				// var tn = name.split(" ")[0] + " " + "(Father)";

		// 				if (name === cmat) {
		// 					var odgc = oContext.getModel().oData.m[0].mmGW,
		// 						odnc = oContext.getModel().oData.m[0].mmNW;
		// 					return {
		// 						key: name,
		// 						text: name + " " + "(Father)" + Array(254).fill('\xa0').join('') + odnc + Array(13).fill('\xa0').join('') + odgc
		// 							// renderWhitespace:true
		// 					};
		// 				}
		// 				// } else {
		// 				// 	return {
		// 				// 		key: name,
		// 				// 		text: name
		// 				// 	};
		// 				// }
		// 				else {
		// 					// var path = oContext.getPath().split("/")[2];

		// 					// var net = oContext.getModel().oData.p[path].net;
		// 					// var gro = oContext.getModel().oData.p[path].gro;
		// 					var arr = oContext.getModel().oData.p;
		// 					var arrOne = [];
		// 					for (var i = 0; i < arr.length; i++) {
		// 						arrOne.push(arr[i].bmc);
		// 					}
		// 					var k = arrOne.indexOf(name);
		// 					var net = arr[k].mnw;
		// 					var gro = arr[k].mgw;
		// 					// if(chk.length > 0){
		// 					return {
		// 						key: name,
		// 						text: name + Array(268).fill('\xa0').join('') + net + Array(13).fill('\xa0').join('') + gro
		// 							// renderWhitespace:true
		// 					};
		// 					// }else{
		// 					// 	return{
		// 					// 		key: name,
		// 					// 		text: name
		// 					// 	};
		// 					// }
		// 				}

		// 			}
		// 		};
		// 		var oTable = this.byId("tab"),
		// 			mParams = oEvent.getParameters(),
		// 			oBinding = oTable.getBinding("items"),
		// 			sPath,
		// 			bDescending,
		// 			vGroup,
		// 			aGroups = [];
		// 		// aGroupsn = [];
		// 		if (mParams.groupItem) {
		// 			// sPath = o;
		// 			sPath = mParams.groupItem.getKey();
		// 			bDescending = mParams.groupDescending;
		// 			vGroup = this.mGroupFunctions[sPath];
		// 			aGroups.push(new Sorter(sPath, bDescending, vGroup));
		// 			// aGroupsn.push(new Sorter(jj, null));
		// 			// delete aGroups[0].bDescending;
		// 			oBinding.sort(aGroups);
		// 			// oBinding.sort(aGroupsn);
		// 		}
		// 	}
		// }
		handleGroupButtonPressed: function () {
			$.sap.n2 = true;
			$.sap.n3 = true;
			this.onInitGrouping("mat");

		},
		onLiveChange: function (oEvent) {
			var oPlant = oEvent.getSource().getValue();
			this.getView().byId("idPlant").setValue(oPlant.toUpperCase());
		}

	});
});