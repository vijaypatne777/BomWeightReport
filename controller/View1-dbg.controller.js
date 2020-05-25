sap.ui.define([
	"com/demo/demo215/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"com/demo/demo215/util/formatter",
	"sap/ui/model/type/String",
	"sap/m/SearchField"
], function (Controller, MessageBox, Sorter, Filter, formatter, typeString, SearchField) {
	"use strict";
	var oBusyDialog = new sap.m.BusyDialog(),
		oValidBOM = [];
	return Controller.extend("com.demo.demo215.controller.View1", {
		onInit: function () {
			this.oColModel = new sap.ui.model.json.JSONModel("Columns/column.json");
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
		// onEnterMatNo: function (sValue) {
		// 	var allTokens = this.getView().byId("multiInput").getValue();
		// 	this.getView().byId("multiInput").addToken(new sap.m.Token({
		// 		text: allTokens
		// 	}));
		// 	this.getView().byId("multiInput").setValue("");
		// },
		onFrag: function (oEvent) {
			if (!this._oFrag) {
				this._oFrag = sap.ui.xmlfragment("com.demo.demo215.Fragments.Help", this);
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
				enableSuggestions:true
				// suggest:this.onSuggest.bind(this)
			});
			oFilterBar.setBasicSearch(this._oBasicSearchField);

			this._oFrag.open();

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
		// onSuggest:function(){
			
		// },
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
		onBOMSearch: function () {
			// var oMateriaNo = this.getView().byId("multiInput").getTokens();
			var oMateriaNo = this.getView().byId("multiInput").getValue(),
				oPlant = this.getView().byId("idPlant").getValue().toString(),
				oBomUsage = this.getView().byId("idBOMUsage").getValue().toString();
			if (oMateriaNo.length === 0 || oPlant.length === 0 || oBomUsage.length === 0) {
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
				oBusyDialog.close();
			} else {
				var ocModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(ocModel, "BRF");
				var wu = [],
					gw = [],
					nw = [],
					data = {
						result: [],
						totalSum: []
					},
					oValidBOMitemQuant = [],
					oValidBOMitemComp = [],
					oValidBOMitemMat = [],
					that = this,
					oFilter = [],
					// oMatInputNo = 1,
					pr = [],
					AP1 = this.getView().getModel("modelA");
				AP1.attachBatchRequestSent(function () {
					oBusyDialog.close();
				});
				if (oMateriaNo.length === 0 || oPlant.length === 0) {
					sap.m.MessageBox.warning("Please enter all mandatory fields.");
					this.oBusyDialog.close();
				} else {
					//	oBusyDialog.open();
					var Text = this.getView().byId("multiInput").getValue();
					oFilter[0] = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oPlant);
					oFilter[1] = new sap.ui.model.Filter("BillOfMaterialVariantUsage", sap.ui.model.FilterOperator.EQ, oBomUsage);
					oFilter[2] = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Text);
					// for (var inputMatIndex = 0; inputMatIndex < oMateriaNo.length; inputMatIndex++) {
					// oMatInputNo++;
					// var Fkey = this.getView().byId("multiInput").getValue().getProperty("key"),
					// Text = this.getView().byId("multiInput").getValue().getProperty("text");
					// if (Fkey.length === 0 && 0 < Text.length) {
					// 	oFilter[2] = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Text);
					// } else if (Fkey.length > 0 && Text.length > Fkey.length) {
					// 	oFilter[2] = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Fkey);
					// } else {
					// 	oBusyDialog.close();
					// 	sap.m.MessageToast.show("No Records Found");

					// }
					// var oInpurMatNo = this.getView().byId("multiInput").getTokens()[inputMatIndex].getProperty("key");
					// oFilter[oMatInputNo] = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, oInpurMatNo);
					//	}
				}
				var dialog = new sap.m.BusyDialog({

					text: 'Loading Data...'

				});
				dialog.open();
				AP1.read("/MaterialBOM", {
					filters: oFilter,
					urlParameters: {
						"$select": "BillOfMaterial"
					},
					async: false,
					success: function (x, y) {
						var loop = x.results.length;
						for (var n = 0; n < x.results.length; n++) {
							oValidBOM[n] = x.results[n].BillOfMaterial;
						}
						if (loop === n && loop !== 0 && loop !== undefined) {
							var oPlantx = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oPlant),
								oPlantFilter = new sap.ui.model.Filter({
									filters: [oPlantx],
									and: true
								}),
								BOMFilter = [];
							for (var q = 0; q < oValidBOM.length; q++) {
								BOMFilter.push(new sap.ui.model.Filter("BillOfMaterial", sap.ui.model.FilterOperator.EQ, oValidBOM[q]));
							}
							var oBOMFilter = new sap.ui.model.Filter({
								filters: BOMFilter,
								and: false
							});
							oFilter = new Array(new sap.ui.model.Filter({ //var oFilter
								filters: [oPlantFilter, oBOMFilter],
								and: true
							}));
							AP1 = that.getView().getModel("modelA"); //var AP1
							AP1.read("/MaterialBOMItem", {
								filters: [oFilter],
								urlParameters: {
									"$select": "BillOfMaterialItemQuantity,BillOfMaterialComponent,Material,BillOfMaterial"
								},
								async: false,
								success: function (oData, oResponse) {
									for (var i = 0; i < oData.results.length; i++) {
										oValidBOMitemComp[i] = oData.results[i].BillOfMaterialComponent;
										oValidBOMitemQuant[i] = oData.results[i].BillOfMaterialItemQuantity;
										oValidBOMitemMat[i] = oData.results[i].Material;
									}
									if (i === oData.results.length && oData.results.length !== 0 && oData.results.length !== undefined) {
										AP1 = that.getView().getModel("modelB"); //var AP1
										var compFilter = [];
										for (q = 0; q < oValidBOMitemComp.length; q++) { // var q
											compFilter.push(new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, oValidBOMitemComp[q]));
										}
										var ocompFilter = new sap.ui.model.Filter({
											filters: compFilter,
											and: false
										});
										oFilter = new Array(new sap.ui.model.Filter({ // var oFilter
											filters: [ocompFilter]
										}));
										AP1.read("/A_Product", {
											filters: [oFilter],
											urlParameters: {
												"$select": "GrossWeight,NetWeight,WeightUnit,Product"
											},
											async: false,
											success: function (r, l) {
												dialog.close();
												for (i = 0; i < r.results.length; i++) {
													gw[i] = r.results[i].GrossWeight;
													nw[i] = r.results[i].NetWeight;
													wu[i] = r.results[i].WeightUnit;
													pr[i] = r.results[i].Product;
												}
												if (i === r.results.length && r.results.length !== 0 && r.results.length !== undefined) {
													var addNQ = 0,
														addGQ = 0;
													// for (var m = 0; m < oData.results.length; m++) {
													// 	addNQ = addNQ + nw[m] * oValidBOMitemQuant[m];
													// 	addGQ = addGQ + gw[m] * oValidBOMitemQuant[m];
													// }
													// data.totalSum.push({
													// 	addNQ: addNQ,
													// 	addGQ: addGQ,
													// 	Label: "Total"
													// });
													for (var m = 0; m < r.results.length; m++) {
														data.result.push({
															// Mat: oValidBOMitemComp[m],
															Mat: pr[m],
															FatMat: oValidBOMitemMat[m], //added for testing
															// Qty: oValidBOMitemQuant[m],
															Qty: "",
															nwt: nw[m] + " " + wu[m],
															gwt: gw[m] + " " + wu[m],
															// tnwt: nw[m] * oValidBOMitemQuant[m] + " " + wu[m],
															// tgwt: gw[m] * oValidBOMitemQuant[m] + " " + wu[m]
															tnwt: "",
															tgwt: ""
														});
													}

													for (m = 0; m < data.result.length; m++) {
														for (var z = 0; z < oValidBOMitemComp.length; z++) {
															if (data.result[m].Mat === oValidBOMitemComp[z]) {
																data.result[m].Qty = oValidBOMitemQuant[z];
																data.result[m].tnwt = nw[m] * oValidBOMitemQuant[z] + " " + wu[m];
																data.result[m].tgwt = gw[m] * oValidBOMitemQuant[z] + " " + wu[m];
																// addNQ = addNQ + nw[m] * oValidBOMitemQuant[z];
																// addGQ = addGQ + gw[m] * oValidBOMitemQuant[z];
															}
														}
													}
													for (m = 0; m < data.result.length; m++) {
														addNQ = addNQ + parseFloat(data.result[m].tnwt.split(" ")[0]);
														addGQ = addGQ + parseFloat(data.result[m].tgwt.split(" ")[0]);
													}
													data.totalSum.push({
														addNQ: addNQ,
														addGQ: addGQ,
														Label: "Total"
													});

													//	oBusyDialog.close();
													ocModel = new sap.ui.model.json.JSONModel();
													ocModel.setData(data);
													that.getView().setModel(ocModel, "BRF");
												}
											},
											error: function (u) {
												oBusyDialog.close();
												dialog.close();
												var err = JSON.parse(u.responseText);
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
								error: function (o) {
									oBusyDialog.close();
									dialog.close();
									var err = JSON.parse(o.responseText);
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
						} else {
							oBusyDialog.close();
							dialog.close();
							sap.m.MessageToast.show("No Records Found");
						}
					},
					error: function (oError) {
						oBusyDialog.close();
						dialog.close();
						var err = JSON.parse(oError.responseText);
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
			}
		},
		onDataExport: function () {
			this.onExcelDownload(this);
		},
		handleGroupButtonPressed: function () {
			this._oDialog = sap.ui.xmlfragment("com.demo.demo215.view.SettingsDialog", this);
			this._oDialog.open();
		},
		handleFilterButtonPressed: function () {
			this._oDialog = sap.ui.xmlfragment("com.demo.demo215.view.FilterDialog", this);
			this._oDialog.open();
		},
		// handleSortButtonPressed: function () {
		// 	this._oDialog = sap.ui.xmlfragment("com.demo.demo215.view.SortDialog", this);
		// 	this._oDialog.open();
		// },
		handleGroupDialogConfirm: function (oEvent) {
			this.mGroupFunctions = {
				FatMat: function (oContext) {
					var name = oContext.getProperty("FatMat");
					// var a = name.split(" ")[0] + " " + "(Father)";
					// var b = name.split(" ")[1];
					return {
						key: name,
						text: name + " " + "(Father)"
					};
				}
			};
			var oTable = this.byId("tab"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				oBinding.sort(aGroups);
			}
		},
		handleFilterDialogConfirm: function (oEvent) {
				var oTable = this.byId("tab"),
					mParams = oEvent.getParameters(),
					oBinding = oTable.getBinding("items"),
					aFilters = [];

				mParams.filterItems.forEach(function (oItem) {
					var aSplit = oItem.getKey().split("___"),
						sPath = aSplit[0],
						sOperator = aSplit[1],
						sValue1 = parseInt(aSplit[2], 10),
						sValue2 = aSplit[3],
						oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
					aFilters.push(oFilter);
				});
				oBinding.filter(aFilters);
				this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
				this.byId("vsdFilterLabel").setText(mParams.filterString);
			}
			// handleSortDialogConfirm: function (oEvent) {
			// 	var oTable = this.byId("tab"),
			// 		mParams = oEvent.getParameters(),
			// 		oBinding = oTable.getBinding("items"),
			// 		sPath,
			// 		bDescending,
			// 		aSorters = [];
			// 	sPath = mParams.sortItem.getKey();
			// 	bDescending = mParams.sortDescending;
			// 	aSorters.push(new Sorter(sPath, bDescending));
			// 	oBinding.sort(aSorters);
			// }
	});
});