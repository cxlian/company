Ext.ns('Msw.Tools');
Msw.Tools = function() {
	/**
	 * 在工具栏中插入默认的按钮
	 * @param {Ext.grid.GridPanel} grid 数据表
	 * @param {Object} menu 系统菜单
	 * @param {Object} inquiry 导出Excel的查询条件
	 * @param {Function} insertButton 插入完按钮后调用的方法
	 * @param {Int} i 插入的开始位置，可选，默认为0
	 * @param {Function} addFn 点击新增前执行的方法
	 * @param {Function} delFn 点击删除前执行的方法
	 * @param {Function} excFn 点击导出前执行的方法
	 */
	var bbarInsertButtons = function(grid, menu, inquiry, insertButton, i, addFn, delFn, excFn, kj) {
		bbarInsertButton(grid, null, null, menu, inquiry, insertButton, i, addFn, delFn, excFn, kj);
	}
	/**
	 * 在工具栏中插入默认的按钮
	 * @param {Ext.grid.GridPanel} grid 数据表
	 * @param {Ext.PagingToolbar} bbar 工具栏
	 * @param {Ext.data.Store} ds 数据源
	 * @param {Object} menu 系统菜单
	 * @param {Object} inquiry 导出Excel的查询条件
	 * @param {Function} insertButton 插入完按钮后调用的方法
	 * @param {Int} i 插入的开始位置，可选，默认为0
	 * @param {Function} addFn 点击新增前执行的方法
	 * @param {Function} delFn 点击删除前执行的方法
	 * @param {Function} excFn 点击导出前执行的方法
	 */
	var bbarInsertButton = function(grid, bbar, ds, menu, inquiry, insertButton, i, addFn, delFn, excFn, kj) {
		if(Ext.isEmpty(grid)) return;
		if(Ext.isEmpty(bbar)) bbar = grid.getBottomToolbar();
		if(Ext.isEmpty(ds)) ds = grid.getStore();
		if(Ext.isEmpty(bbar) || Ext.isEmpty(ds) || Ext.isEmpty(menu)) return;
		if(Ext.isEmpty(i)) i=0;
		var menuADD = Msw.Menu.fg(menu, Msw.G.ADD.k),
			menuDEL = Msw.Menu.fg(menu, Msw.G.DEL.k),
			menuEXC = Msw.Menu.fg(menu, Msw.G.EXC.k);
			menuEXCTO = Msw.Menu.fg(menu, Msw.G.EXCTO.k);
		bbar.addListener('render', function(g){
			if(menuADD){
				bbar.insertButton(i++, new Ext.Action({
					iconCls:'add_o',
					text:'新 增',
					handler:function(b){
						if(Ext.isFunction(addFn)) if(addFn.call(this, b, menuADD)===false) return;
						Msw.util.loadJS.load(menuADD.js, function(){
							if(kj===true) Msw.Run(menuADD.commandJs, menu, null, ds, g).show();
							else Msw.Run(menuADD.commandJs, null, ds, menu).show();
						});
					}
				}));
				bbar.insertButton(i++, new Ext.Toolbar.Separator());
			}
			if(menuDEL){
				bbar.insertButton(i++, new Ext.Action({
					iconCls:'delete_o',
					text:'删 除',
					handler:function(b){
						var ss = grid.getSelectionModel().getSelections();
						if(Ext.isEmpty(ss)){
							Msw.Msg.Info("请选择要删除的内容", null, b);
							return;
						}
						if(Ext.isFunction(delFn)) if(delFn.call(this, ss[0].data, b, menuDEL)===false) return;
						if(ss.length==1){
							Msw.Msg.Confirm('确定要删除'+((ss[0].data.title || ss[0].data.name)?' “'+(ss[0].data.title || ss[0].data.name)+'” ':'') +'吗？',function(e){
								if(e=='yes'){
									Ext.Ajax.request({
										url:Msw.getUrl(menuDEL.id),
										params:{id:ss[0].data.id},
				                		success: function(r,v){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除成功！');
				                			ds.reload();
				                		},
				                		failure: function(r){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除失败！');
				                			ds.reload();
				                		}
									});
								}
							}, b);
						}else{
							Msw.Msg.Confirm('确定要删除<b>'+ss.length+'</b>条数据吗？',function(e){
								if(e=='yes'){
									var ids = "";
									Ext.each(ss,function(){
										ids+=(";"+this.data.id);
									});
									if(ids.length>0) ids=ids.substring(1);
									Ext.Ajax.request({
										url:Msw.getUrl(menuDEL.id),
										params:{ids:ids},
				                		success: function(r,v){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除成功！');
				                			ds.reload();
				                		},
				                		failure: function(r){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除失败！');
				                			ds.reload();
				                		}
									});
								}
							}, b);
						}
					}
				}));
				bbar.insertButton(i++, new Ext.Toolbar.Separator());
			}
			if(menuEXC && inquiry){
				bbar.insertButton(i++, Msw.ExcButtonConfig(Msw.getUrl(menuEXC.id), inquiry, bbar));
				bbar.insertButton(i++, new Ext.Toolbar.Separator());
			}
			if(menuEXCTO){
				bbar.insertButton(i++, Msw.ExcToButtonConfig(Msw.getUrl(menuEXCTO.id), bbar, ds));
				bbar.insertButton(i++, new Ext.Toolbar.Separator());
			}
			if(Ext.isFunction(insertButton)){
				insertButton(i, grid, bbar, ds, menu, inquiry);
			}
		});
	}
	/**
	 * 将win（窗口）放入父选项卡中
	 * @param {Object} menu 当前菜单
	 * @param {Ext.Window} win 要放入的窗口
	 */
	var intoWinSuper = function(menu, win){
		if(menu && menu.id){
			var sup = Ext.getCmp('_subMenu'+menu.id);
			if(sup){
				sup.add(win);
				sup.doLayout();
			}
		}
	}
	/**
	 * 在查询工具栏取得查询值
	 * @param {Ext.Toolbar} tbar 工具条
	 * @param {Object} inquiry 查询条件
	 */
	var getTbarSelectValue = function(tbar, inquiry){
		var i;
		if(Ext.isArray(tbar)){
			Ext.each(tbar, function(){
				for(var iy in inquiry){
					i = this.find("name", iy);
					if(Ext.isEmpty(i)) i = this.find("hiddenName", iy);
					if(!Ext.isEmpty(i)){
						if(i[0].xtype=='datefield'){
							inquiry[iy] = i[0].getRawValue();
							if(i[0].startDateField && inquiry[iy]){
								inquiry[iy] = inquiry[iy]+' 23:59:59';
							}
						}else{
							inquiry[iy] = i[0].getValue();
						}
					}
				}
			});
			return inquiry;
		}else{
			for(var iy in inquiry){
				i = tbar.find("name", iy);
				if(Ext.isEmpty(i)) i = tbar.find("hiddenName", iy);
				if(!Ext.isEmpty(i)){
					if(i[0].xtype=='datefield'){
						inquiry[iy] = i[0].getRawValue();
						if(i[0].startDateField && inquiry[iy]){
							inquiry[iy] = inquiry[iy]+' 23:59:59';
						}
					}else{
						inquiry[iy] = i[0].getValue();
					}
				}
			}
			return inquiry;
		}
	}
	
	/**
	 * 在查询工具栏设置查询值
	 * @param {Ext.Toolbar} tbar 工具条
	 * @param {Object} inquiry 查询条件
	 */
	var setTbarSelectValue = function(tbar, inquiry){
		var i;
		if(Ext.isArray(tbar)){
			Ext.each(tbar, function(){
				for(var inq in inquiry){
					i = this.find("name", inq);
					if(Ext.isEmpty(i)) i = this.find("hiddenName", inq);
					if(!Ext.isEmpty(i)){
						if(i[0].xtype=='datefield'){
							if(inquiry[inq]!=undefined && i[0].format=='Y-m-d'){
								i[0].setRawValue(inquiry[inq].substring(0,10));
							}else{
								i[0].setRawValue('');
							}
						}else i[0].setValue(inquiry[inq]);
					}
				}
			});
		}else{
			for(var inq in inquiry){
				i = tbar.find("name", inq);
				if(Ext.isEmpty(i)) i = tbar.find("hiddenName", inq);
				if(!Ext.isEmpty(i)){
					if(i[0].xtype=='datefield'){
						if(inquiry[inq]!=undefined && i[0].format=='Y-m-d'){
							i[0].setRawValue(inquiry[inq].substring(0,10));
						}else{
							i[0].setRawValue('');
						}
					}else i[0].setValue(inquiry[inq]);
				}
			}
		}
	}
	
	/**
	 * 在查询工具栏清空查询值
	 * @param {Ext.Toolbar} tbar 工具条
	 * @param {Object} inquiry 查询条件
	 */
	var clearTbarSelectValue = function(tbar, inquiry){
		for(var iy in inquiry){
			inquiry[iy] = '';
		}
		setTbarSelectValue(tbar, inquiry);
	}
	
	/**
	 * 为表单填值
	 * @param {Ext.FormPanel} form 表单
	 * @param {Object} data 值对象
	 */
	var setFormValue = function(form, data, sup){
		if(Ext.isEmpty(form)||Ext.isEmpty(data)) return;
		var sup = sup?sup+'.':'';
		for(var d in data){
			var obj = form.find('name', sup+d);
			if(!Ext.isEmpty(obj)){
				Ext.each(obj,function(){
					setFormValue.setValue(this, data[d]);
				})
			}
			if(Ext.isObject(data[d])){
				setFormValue(form, data[d], sup+d);
			}
		}
	}
	setFormValue.setValue = function(obj, data){
		if(Ext.isEmpty(obj) || Ext.isEmpty(data) || !Ext.isFunction(obj.getXType)) return;
		if(Ext.isFunction(obj.valuefn)){
			obj.valuefn.call(obj, data, obj);
			return;
		}
		var xtype = obj.getXType();
		if(xtype=='datefield'){
			obj.setRawValue(Msw.getDate(data));
		}else if(xtype=='newwindowsearch'){
			if(!Ext.isObject(data)) return;
			var id = data.id,
				text = data[obj.textname] || data.title || data.name || '';
			if(id && text) obj.setValue(text, id);
		}else if(xtype=='combo'){
			obj.setValue(data);
			if(obj.store){
				obj.store.on('load',function(){
					obj.setValue(data);
				});
			}
		}else{
			if(obj.format=='Y-m-d H:i:s'){
				obj.setValue(Msw.getTime(data));
			}else if(obj.format=='Y-m-d'){
				obj.setValue(Msw.getDate(data));
			}else{
				obj.setValue(data);
			}
		}
	}
	
	/**
	 * 获得对象的属性值
	 * @param {Object} obj 对象
	 * @param {String} ns名称(可以为sub.value)
	 */
	var getValue = function(obj, ns){
		if(!Ext.isObject(obj) || !Ext.isString(ns)) return;
		var ss = ns.split('.'), val=obj;
		for (var n = 0; n < ss.length; n++) {
			val = val[ss[n]];
			if(Ext.isEmpty(val)) break;
		}
		return val;
	}
	/**
	 * 封装数据
	 * @param {Array} objs 数据
	 * @param {String} v 值的名称（默认为name或title）
	 * @param {String} k 键的名称（默认为id）
	 * return {Array}
	 */
	var getKV = function(objs, v, k, kname, g){
		if(!(Ext.isArray(objs) && !Ext.isEmpty(objs))) return {k:'',v:'',getK:function(){return this.k;},getV:function(){return this.v;}};
		v = v || (objs[0].name?'name':'') || (objs[0].title?'title':'');
		k = k || (objs[0].id?'id':'');
		g = g || '、';
		if(Ext.isEmpty(v) || Ext.isEmpty(k)) return {k:'',v:'',getK:function(){return this.k;},getV:function(){return this.v;}};
		
		var ks = [], vs = '';
		ks[0] = {};
		//ks[0][kname||k] = objs[0][k];
		ks[0][kname||k] = getValue(objs[0], k);
		//vs = objs[0][v];
		vs = getValue(objs[0], v);
		for(var i=1; i<objs.length; i++){
			var myk = {};
			//myk[kname||k] = objs[i][k];
			myk[kname||k] = getValue(objs[i], k);
			ks.push(myk);
			//vs+=g+objs[i][v];
			vs+=g+getValue(objs[i], v);
		}
		var kv = [Ext.encode(ks), vs];
		kv.k = Ext.encode(ks);
		kv.v = vs;
		kv.getK = function(){
			return kv.k;
		}
		kv.getV = function(){
			return kv.v;
		}
		return kv;
	}
	
	/**
	 * 禁用组件
	 * @param {Ext.Component} obj 组件
	 */
	var disable = function(obj){
		if(Ext.isEmpty(obj) || !Ext.isFunction(obj.cascade)) return;
		obj.cascade(function(){
			if(Ext.isFunction(this.getXType)){
				var xtype = this.getXType();
				if(!(xtype=='fieldset' || xtype=='form' || xtype=='panel' || xtype=='tabpanel')) this.disable();
			}
		});
	};
	/**
	 * 双击列表时
	 * @param {Object} menu 菜单
	 * @param {Ext.grid.GridPanel} grid 列表
	 * @param {Ext.data.Store} ds 数据源
	 * @param {Integer} row 选择中的行号
	 * @param {Function} fn 选择调用的方法
	 */
	var celldblclickGrid = function(menu, grid, ds, row, fn){
		var menuGET = Msw.Menu.fg(menu, Msw.G.GET.k);
		if(!menuGET) return;
		Ext.Ajax.request({
			url:Msw.getUrl(menuGET.id),params:{id:ds.getAt(row).data.id},
			success:function(f){
				var a = Ext.util.JSON.decode(f.responseText);
				if(!a.success){
					if(a.msg) Ext.Msg.alert('提示',a.msg);
					return;
				}
				if(a.msg) Msw.tips('提示','{0}',a.msg, 3);
				if(Ext.isFunction(fn)){
					fn(a.data);
					return;
				}
				Msw.util.loadJS.load(menuGET.js, function(){
					Msw.Run(menuGET.commandJs, a.data, ds, menu).show();
				});
			},
			failure:function(f){
				var a = Ext.util.JSON.decode(f.responseText);
				if(a.msg) Ext.Msg.alert('提示',a.msg);
			}
		});
		
	}
	
	/**
	 * 为管理窗口增加保存、修改、删除按钮
	 * @param {Ext.Window} win 窗口
	 * @param {Ext.FormPanel} form 表单
	 * @param {Object} menu	菜单
	 * @param {Object} data 对象数据
	 */
	var addSaveUpDelButton = function(win, form, menu, data){
		if(Ext.isEmpty(win) || Ext.isEmpty(form) || Ext.isEmpty(menu)) return;
		var menuADD=Msw.Menu.fg(menu, Msw.G.ADD.k), 
			menuUP=Msw.Menu.fg(menu, Msw.G.UP.k), 
			menuDEL=Msw.Menu.fg(menu, Msw.G.DEL.k);
		if(!Ext.isEmpty(menuADD) && Ext.isEmpty(data)){
			win.addButton({text:'保 存'},function(){
				if(!form.getForm().isValid()) return;
				form.getForm().submit({
					url:Msw.getUrl(menuADD.id),
					success:function(f, a){
						if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
						win.close();
					},
					failure:function(f, a){
						if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
					}
				});
			});
		};
		if(!Ext.isEmpty(menuUP) && !Ext.isEmpty(data)){
			win.addButton({text:'保 存'},function(){
				if(!form.getForm().isValid()) return;
				form.getForm().submit({
					url:Msw.getUrl(menuUP.id),
					params:{id:data.id},
					success:function(f, a){
						if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
						win.close();
					},
					failure:function(f, a){
						if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
					}
				});
			});
			win.addButton({text:'删 除'},function(){
				Ext.Msg.confirm('提醒','确定要删除吗？',function(e){
					if(e=='yes'){
						Ext.Ajax.request({
							url:Msw.getUrl(menuDEL.id),
							params:{id:data.id},
	                		success: function(r,v){
	                			var a = Ext.util.JSON.decode(r.responseText);
	                			win.close();
								Msw.tips('提示','{0}',a.msg ? a.msg : '删除成功！');
	                		},
	                		failure: function(r){
	                			var a = Ext.util.JSON.decode(r.responseText);
								Msw.tips('提示','{0}',a.msg ? a.msg : '删除失败！');
	                		}
						});
					}
				});
			});
		};
	}
	/**
	 * 获得在整个树中的结构名称
	 * @param {Object} 树对象
	 * @param {String} 父名称
	 * @param {String} 名称字符
	 * @param {String} 间隔字符
	 */
	var getSupNames = function(o,sup,n,g){
		if(!Ext.isObject(o)) return;
		if(Ext.isEmpty(n)) n=o.title?'title':'name';
		if(Ext.isEmpty(g)) g=" > ";
		var getN = function(d){
			if(!d) return '';
			return getN(d[sup])+d[n]+g;
		}
		var ns = getN(o);
		if(ns) ns = ns.substring(0,ns.length-g.length);
		return ns;
	}
	return {
		bbarInsertButton: bbarInsertButton,
		bbarInsertButtons: bbarInsertButtons,
		intoWinSuper: function(menu, win){
			return;
			intoWinSuper(menu, win);
		},
		getTbarSelectValue: getTbarSelectValue,
		setTbarSelectValue: setTbarSelectValue,
		clearTbarSelectValue: clearTbarSelectValue,
		setFormValue: setFormValue,
		getKV: getKV,
		disable: disable,
		celldblclickGrid: celldblclickGrid,
		addSaveUpDelButton: addSaveUpDelButton,
		getSupNames:getSupNames,
		getValue:getValue
	}
}();