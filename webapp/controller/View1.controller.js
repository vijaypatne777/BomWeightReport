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
	// var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
	// 	maxFractionDigits: 3,
	// 	decimalSeparator: ",",
	// 	groupingEnabled: false
	// });
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
			var plant = this.getView().byId("idPlant").getValue();
				// bomusage = this.getView().byId("idBOMUsage").getValue();
			if (material.length === 0 || plant.length === 0) {
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
				oBusyDialog.close();
			} else {

				//------------------old algorithm------------------------------
				$.sap.myVar = true;
				$.sap.myVars = true;
				var that = this;
				var ocModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(ocModel, "BRF");
			
				//---------------------  old alogorithm---------
				
				//---------------------new alogo----------------
				var newdata = new Promise(function (resolve, reject) {
					that.connectServer(resolve, reject);
				});
				newdata.then(function (scp) {
					var data = {
						results:""
					};
					data.results = scp;
						that.getView().byId("idBOMUsage").setValue(data.results[0].usg);
					var compFilter = [];
					var gw = [];
					var nw = [];
					var wu = [];
					for (var q = 0; q < data.results.length; q++) { // var q
						compFilter.push(new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, data.results[q].bom));
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
					var model = that.getView().getModel("modelB");
					model.read("/A_Product", {
						filters: [oFilter],
						urlParameters: {
							"$select": "GrossWeight,NetWeight,WeightUnit,Product"
						},
						async: false,
						success: function (x, p) {
							for (var i = 0; i < x.results.length; i++) {
								gw[i] = x.results[i].GrossWeight;
								nw[i] = x.results[i].NetWeight;
								wu[i] = x.results[i].WeightUnit;
							}
							if (i === x.results.length && x.results.length !== 0 && x.results.length !== undefined) {
								var addNQ = 0,
									addGQ = 0;
								// if (x.results.length === data.results.length) {
								var count = 0;
								for (var g = 0; g < data.results.length; g++) {
									for (i = 0; i < x.results.length; i++) {
										if (x.results[i].Product === data.results[g].bom) {
											count += 1;
											k.p.push({
												lvl: data.results[g].lvl,
												asm: data.results[g].asm,
												itm: data.results[g].itm,
												bmc: data.results[g].bom,
												mat: data.results[g].mat,
												qty: data.results[g].qty,
												gro: x.results[i].GrossWeight,
												net: x.results[i].NetWeight,
												tgt: x.results[i].GrossWeight * data.results[g].qty,
												tnt: x.results[i].NetWeight * data.results[g].qty,
												mgw: x.results[i].GrossWeight + " " + x.results[i].WeightUnit,
												mnw: x.results[i].NetWeight + " " + x.results[i].WeightUnit,
												cmd: data.results[g].des,
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
											// ice[0].dia = oNumberFormat.format(mmNW) + " " + mmWU;
											// ice[0].gol = oNumberFormat.format(mmGW) + " " + mmWU;
											   ice[0].dia = mmNW + " " + mmWU;
											   ice[0].gol = mmGW + " " + mmWU;
											// for (i = 0; i < ice.length; i++) {
											// 	ice[i].net = oNumberFormat.format(ice[i].net);
											// 	ice[i].gro = oNumberFormat.format(ice[i].gro);
											// 	ice[i].tnt = oNumberFormat.format(ice[i].tnt);
											// 	ice[i].tgt = oNumberFormat.format(ice[i].tgt);
											// }
										
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
				}, function () {

				});
				//---------------------new algo------------------
				// var data = o.getData();

			}
		},
		connectServer: function (resolve, reject) {
			var ocModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ocModel, "BRF");
			var j = 0,
				q = false,
				g,
				alt = [],
				p = true,
				rcdidx = 0,
				arr = [],
				// d = [],
				nd = [],
				// zFilter = [],
				nzFilter = [],
				count = 0;
			var oMateriaNo = this.getView().byId("multiInput").getValue();
			var oPlant = this.getView().byId("idPlant").getValue();
			var materialX = [];
			// for (var inputMatIndex = 0; inputMatIndex < oMateriaNo.length; inputMatIndex++) {
			materialX.push(oMateriaNo);
			// }
			var far = this.getView().getModel("modelA");
			$.sap.brk = far;
			var that = this;
			var oFunc = function (far, cry) { // eslint-disable-line
				if (cry === undefined || cry.length === 0 || far === null) {
					oBusyDialog.close();
					resolve(alt);
					// alert("abc");
					// ocModel = new sap.ui.model.json.JSONModel();
					// ocModel.setSizeLimit(alt.length);
					// ocModel.setData(alt);
					// that.getView().setModel(ocModel, "BRF");
					return (1);
				}
				for (var i = 0; i < cry.length; i++) {
					nd.push(new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, cry[i]),
							new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oPlant)
							// new sap.ui.model.Filter("ValidityEndDate", sap.ui.model.FilterOperator.GT, "datetime'2020-08-03T00:00:00'")
						],
						and: true
					}));
				}
				nzFilter.push(new sap.ui.model.Filter({
					filters: nd,
					and: false
				}));
				var pfunc = function (z) {
					return new Promise(
						function (resolve, reject) {
							far.read(z, {
								filters: nzFilter,
								urlParameters: {
									"$select": "BillOfMaterialComponent,Plant,IsAssembly,Material,BillOfMaterialItemNumber,ComponentDescription,BillOfMaterialItemQuantity",
									"$orderby": "BillOfMaterialItemNumber"
								},
								async: false,
								success: function (x) {
									resolve(x);
								},
								error: function (y) {
									reject(y);
								}
							});
						});
				};
				var qfunc = function (zz) {
					return new Promise(function (resolve, reject) {
						far.read(zz, {
							filters: nzFilter,
							urlParameters: {
								"$select": "BillOfMaterialVariantUsage,Material"
							},
							async: false,
							success: function (foo) {
								resolve(foo);
							},
							error: function (bar) {
								reject(bar);
							}
						});
					});

				};
				Promise.all([pfunc("/MaterialBOMItem"), qfunc("/MaterialBOM")]).then(function (x) {
					count += 1;
					for (var O = 0; O < x[0].results.length; O++) {
						for (var V = 0; V < x[1].results.length; V++) {
							if (x[0].results[O].Material === x[1].results[V].Material) {
								rcdidx += 1;
								arr.push({
									mat: x[0].results[O].Material,
									itm: x[0].results[O].BillOfMaterialItemNumber,
									bom: x[0].results[O].BillOfMaterialComponent,
									asm: x[0].results[O].IsAssembly,
									des: x[0].results[O].ComponentDescription,
									qty: x[0].results[O].BillOfMaterialItemQuantity,
									usg: x[1].results[V].BillOfMaterialVariantUsage,
									lvl: count,
									idx: rcdidx
								});
							}
						}
					}

					if (p) {
						for (var f = 0; f < materialX.length; f++) {
							for (var c = 0; c < arr.length; c++) {
								if (materialX[f] === arr[c].mat) {
									alt.push(arr[c]);
								}
							}
						}
					}
					if (x[0].results === undefined || x[0].results.length === 0 || x[1].results === undefined || x[1].results.length === 0) {
						alert(arr.length); // eslint-disable-line no-alert 
						oFunc(null, null);
					}
					if (q) {
						for (var u = 0; u < alt.length; u++) {
							for (var v = 0; v < arr.length; v++) {
								// if (alt[u].asm.length > 0) {
								if (alt[u].bom === arr[v].mat) {
									alt[u].asm = "X";
									j += 1;
									alt.splice(u + j, 0, arr[v]);
								}
								// }
							}
							j = 0;
						}
					}
					arr = [];
					p = false;
					q = true;
					g = [];
					var sapMaterial = x[0].results;
					// var patchMat = that.patch(sapMaterial);
					// -------------
					var sapnd = [],
						sapnzFilter = [];
					for (i = 0; i < sapMaterial.length; i++) {
						sapnd.push(new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, sapMaterial[i].BillOfMaterialComponent),
								new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, sapMaterial[i].Plant)
							],
							and: true
						}));
					}
					sapnzFilter.push(new sap.ui.model.Filter({
						filters: sapnd,
						and: false
					}));
					var oModel = that.getView().getModel("modelA");
					var prom = function (pz) {
						return new Promise(
							function (resolve, reject) {
								oModel.read(pz, {
									filters: sapnzFilter,
									urlParameters: {
										"$select": "Material"
									},
									success: function (k) {
										resolve(k);
									},
									error: function () {

									}
								});
							});
					};
					prom("/MaterialBOM").then(function (py) {
						for (var y = 0; y < py.results.length; y++) {
							// if (x[0].results[y].IsAssembly.length > 0) {
							g.push(py.results[y].Material);
							// }
						}
						nd = [];
						nzFilter = [];
						oFunc($.sap.brk, g);
					});
					// -------------

				});
			};
			oFunc($.sap.brk, materialX);
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
								text: name + Array(33).fill('\xa0').join('') + odnc + Array(6).fill('\xa0').join('') + odgc + Array(5).fill('\xa0').join('')
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
					aGroups = [],
					nPath = "cnt";
				// aGroupsn = [];
				if (o) {
					sPath = o;
					bDescending = false;
					vGroup = this.mGroupFunctions[sPath];
					aGroups.push(new Sorter(nPath, bDescending, vGroup));
					// aGroupsn.push(new Sorter(jj, null));
					// delete aGroups[0].bDescending;
					oBinding.sort(aGroups);
					// oBinding.sort(new Sorter("lvl",bDescending,null));

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