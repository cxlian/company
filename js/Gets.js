Ext.ns('Msw.interfaces');
/**
 * @param {String} name	与服务端对应的名称
 * @param {String} title	名称
 * @param {String} type	数据类型（string,int,object,objectDate,objectTime,date等）
 * @param {Function} renderer	列表显示时调用的方法
 * (若为空时
 * 	当type='object'时 renderer=function(val, m){return (val.title || val.name || '');}
 * 	当type='objectTime'时 renderer = Msw.getTime
 * 	当type='objectDate'时 renderer = Msw.getDate
 * 	)
 * @param {Boolean} inq 是否为查询列，默认为否
 * @param {Boolean} ht 是否隐藏查询列村里标题，默认为否
 * @param {Boolean} exc	是否不显示列，默认为否
 * @param {Object || Array} object	为查询列是所用的控件配置，默认为文本域
 * @param {String || Function} map
 * 	为控件赋值所使用的格式(map='name' 表示为object.name)或方法
 * 	当xtype='datefield'时 使用setRawValue(Msw.getDate(value))赋值
 * 	当xtype='newwindowsearch'时 使用setValue(value.title || value.name, value.id)赋值
 * @param {Boolean} sub	是否将该值提交到服务端，默认为是
 * @param {int} seq	查询列的排序
 */
Msw.interfaces.Gets = function(){
	this.object = {
		/*
		'object.id':{name:'object',title:'名称',mapping:'object.id',type:'string'}
		*/
	};
	this.myInquiry = {};
	this.inquiry = {
		/*
		'name':{name:'name',title:'名称',value:'值',object:object}
		*/
	};
	/**
	 * 初始化查询条件
	 * @param {object} query 查询条件{K:V}
	 */
	this.initInquiry = function(query){
		if(query){
			for(var i in this.inquiry){
				if(!Ext.isEmpty(query[i], true)) this.inquiry[i].value=query[i];
			}
			for(var i in this.getsParams){
				if(!Ext.isEmpty(query[i], true) && this.getsParams[i]!=undefined) this.getsParams[i]=query[i];
			}
		}
	}
	var _this = this;
	this.getInquiry = function(){
		var myi = {};
		for(var i in _this.inquiry){
			myi[i] = _this.inquiry[i].value;
		}
		Ext.apply(myi,_this.getsParams);
		return myi;
	}
	this.setInquiryObj = function(){
		var i;
		for(var inq in this.inquiry){
			i = this.tbarFind("name", inq);
			if(Ext.isEmpty(i)) i = this.tbarFind("hiddenName", inq);
			if(!Ext.isEmpty(i)){
				if(i[0].xtype=='datefield'){
					if(this.inquiry[inq].value!=undefined && i[0].format=='Y-m-d'){
						i[0].setRawValue(this.inquiry[inq].value.substring(0,10));
					}else{
						i[0].setRawValue('');
					}
				}else i[0].setValue(this.inquiry[inq].value);
			}
		}
	}
	/**
	 * 通过this.object获得Record
	 */
	this.getRecord = function(){
		var records = [];
		Msw.each(this.object,function(k, v){
			records.push({name:v.name,mapping:v.mapping,type:v.type});
		});
		this.record = Ext.data.Record.create(records);
		return this.record;
	};
	/**
	 * 创建单个列模型
	 * @param {String} k this.object的键
	 * @param {Boolean} sortable 是否服务器排序，默认是
	 * @param {Function} renderer renderer的方法
	 */
	this.createCM = function(k){
		var v = this.object[k], o;
		if(Ext.isEmpty(v)) return;
		o = {
			header:v.title,
			dataIndex:v.name,
			width:v.width,
			sortable:v.sortable===false?false:true
		};
		if(Ext.isFunction(v.renderer)) o.renderer = v.renderer;
		else if(v.type=='object') o.renderer = function(val, m){return val?(val.title || val.name || ''):'';};
		else if(v.type=='objectTime') o.renderer = Msw.getTime;
		else if(v.type=='objectDate') o.renderer = Msw.getDate;
		return o;
	};
	this.cmExc = {};
	this.csm = new Ext.grid.CheckboxSelectionModel({hidden:true});
	this.getCM = function(){
		var cms = [this.myPlugin?this.myPlugin:new Ext.grid.RowNumberer(),this.csm];
		for(var o in this.object){
			if(this.object[o].exc===true) continue;
			if(this.cmExc[o]) continue;
			if(!Ext.isEmpty(this.object[o].cm)){
				var mycm = this.object[o].cm;
				if(Ext.isArray(mycm))
					for(var i=0; i<mycm.length; i++) cms.push(mycm[i]);
				else cms.push(mycm);
			}else{
				cms.push(this.createCM(o));
			}
		}
		this.cm = new Ext.grid.ColumnModel(cms);
		return this.cm;
	};
	
	this.tbarW = 120;
	this.tbars = [];
	this.tbarFind = function(k, v){
		var o;
		for(var i=0; i<this.tbars.length; i++){
			o = this.tbars[i].find(k,v);
			if(!Ext.isEmpty(o)) return o;
		}
		return null;
	};
	this.getTbars = function(){
		var inte = this;
		this.tbars = [];
		var i = 0;
		var inq = this.myInquiry;
		var subInq = {};
		for(var b in inq){
			var  t = new Ext.Toolbar({items:[]});
			if(i%4==0) this.tbars.push(new Ext.Toolbar({items:[]}));
			if(!inq[b].ht===true) this.tbars[this.tbars.length-1].add('&nbsp;'+inq[b].title);
			if(inq[b].object){
				if(Ext.isArray(inq[b].object)){
					Ext.each(inq[b].object, function(obj){
						if(Ext.isString(obj)) inte.tbars[inte.tbars.length-1].add(obj);
						else{
							if(!obj.width) obj.width = inte.tbarW;
							if(obj.xtype!='hidden'){
								i++;
								inte.tbars[inte.tbars.length-1].add(obj);
							}else{
								if(inte.tbars[inte.tbars.length-1].items.length==0 && inte.tbars.length>1){
									inte.tbars[inte.tbars.length-2].add(obj);
								}
							}
							if(obj.name) subInq[obj.hiddenName || obj.name] = {value:inq[b].value || obj.value};
						}
					});
				}else{
					if(!inq[b].object.width) inq[b].object.width = inte.tbarW;
					if(inq[b].object.xtype!='hidden'){
						i++;
						this.tbars[this.tbars.length-1].add(inq[b].object);
					}else{
						if(this.tbars[this.tbars.length-1].items.length==0 && this.tbars.length>1){
							this.tbars[this.tbars.length-2].add(inq[b].object);
						}
					}
					if(inq[b].object.name) subInq[inq[b].object.hiddenName || inq[b].object.name] = {value:inq[b].value || inq[b].object.value};
				}
			}else{
				this.tbars[this.tbars.length-1].add({
					allowBlank:true,
					xtype:'textfield',
					name:inq[b].name,
					width:inte.tbarW
				});
				subInq[inq[b].name] = {value:inq[b].value};
				i++;
			}
		}
		for(var j in subInq){
			if(!inte.inquiry[j]) inte.inquiry[j]=subInq[j];
		}
		if(this.tbars.length>0){
			if(this.tbars[this.tbars.length-1].items.length==0){
				var myts = [];
				for(var i=0; i<this.tbars.length-1; i++){
					myts.push(this.tbars[i]);
				}
				this.tbars = myts;
			}
			
			this.tbars[this.tbars.length-1].add('-');
			this.tbars[this.tbars.length-1].add(new Ext.Action({
				iconCls:'select',
				text:'查询',
				id:inte.id+'select',
				handler:function(){
					for(var iy in inte.inquiry){
						Ext.each(inte.tbars,function(){
							i = this.find("name", iy);
							if(Ext.isEmpty(i)) i = this.find("hiddenName", iy);
							if(!Ext.isEmpty(i)){
								if(i[0].xtype=='datefield'){
									inte.inquiry[iy].value = i[0].getRawValue();
									if(i[0].startDateField && inte.inquiry[iy].value){
										inte.inquiry[iy].value = inte.inquiry[iy].value+' 23:59:59';
									}
								}else{
									inte.inquiry[iy].value = i[0].getValue();
								}
							}
						});
					}
                    inte.ds.load();
				}
			}));
			this.tbars[this.tbars.length-1].add('-');
			this.tbars[this.tbars.length-1].add(new Ext.Action({
				iconCls:'bin_empty',
				text:'清空',
				id:inte.id+'empty',
				handler:function(){
					for(var iy in inte.inquiry){
						inte.inquiry[iy].value = '';
					}
					inte.setInquiryObj();
					inte.ds.load();
				}
			}));
			if(this.tbars.length>1){
				this.tbars[this.tbars.length-1].add('-');
				this.tbars[this.tbars.length-1].add({
			        text: '更多查询',
			        iconCls: 'list-items',
			        pressed:this.tbarHide?false:true,
			        enableToggle: true,
			        toggleHandler: function(i,p){
			        	for(var j=0; j<inte.tbars.length-1; j++){
			        		p?inte.tbars[j].show():inte.tbars[j].hide();
			        	}
			        }
			    });
			}
			if(Ext.isFunction(this.addTbarsFn)) this.addTbarsFn(this.tbars);
		}
		this.initInquiry(this.query);
		return this.tbars;
	};
	this.exc = {};
	this.menu = {};
	/**
	 * 提供Store
	 * @param {Object} cof 相关配置
	 */
	this.getStore = function(cof){
		var inte = this;
		this.ds = {
			url:Msw.getUrl(this.menu.id),	//提交路径
			remoteSort:true,	//服务器排序
			autoLoad:true,	//自动加载
			pruneModifiedRecords:true,	//重新加载数据时清除修改记录
			reader:new Ext.data.JsonReader({
				totalProperty:'totalProperty',
				root:'data',
				idProperty:'id',
				id:'id'
			},inte.getRecord()),
			listeners:{
				'load':function(){
					inte.setInquiryObj();
					if(inte.exc){
						for(var i=0; i<this.exc.length; i++){
							inte.ds.remove(inte.ds.getById(inte.exc[i].id));
						}
					}
				},
				'beforeload':function(){
					inte.ds.baseParams=inte.getInquiry();
				}
			}
		};
		if(cof)Ext.apply(this.ds, cof);
		this.ds = Ext.extend(Ext.data.Store, this.ds);
		this.ds = new this.ds;
		return this.ds;
	};
	this.addBbarButton;
	this.getBbar = function(){
		var inte = this;
		var bbar = new Ext.PagingToolbar({
			pageSize:Msw.limit,
			store:inte.ds,
			displayInfo:true
		});
		var i = 0;
		if(!Ext.isEmpty(this.addBbarButton)){
			if(Ext.isFunction(this.addBbarButton)){
				this.addBbarButton(bbar);
			}else if(Ext.isArray(this.addBbarButton)){
				Ext.each(this.addBbarButton,function(){
					bbar.insertButton(i++,this);
					bbar.insertButton(i++,new Ext.Toolbar.Separator());
				});
			}
			return bbar;
		}else{
			var menuADD = Msw.Menu.fg(inte.menu, Msw.G.ADD.k);
			var menuDEL = Msw.Menu.fg(inte.menu, Msw.G.DEL.k);
			var menuEXC = Msw.Menu.fg(inte.menu, Msw.G.EXC.k);
			if(menuADD){
				bbar.insertButton(i++, new Ext.Action({
					iconCls:'add_o',
					text:'新 增',
					handler:function(b){
						if(Ext.isFunction(inte.addFN)){ if(inte.addFN(menuADD, menuADD.commandJs, inte.menu, null, inte.ds, b.id)!==true) return;}
						Msw.util.loadJS.load(menuADD.js, function(){
							Msw.Run(menuADD.commandJs, inte.menu, null, inte.ds, b.id, inte.myArgument).show();
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
						var ss = inte.grid.getSelectionModel().getSelections();
						if(Ext.isEmpty(ss)){
							Msw.Msg.Info("请选择要删除的内容", null, b);
							return;
						}
						if(Ext.isFunction(inte.delFN)){ if(inte.delFN(menuDEL, ss)!==true) return;}
						if(ss.length==1){
							Msw.Msg.Confirm('确定要删除'+((ss[0].data.title || ss[0].data.name)?' “'+(ss[0].data.title || ss[0].data.name)+'” ':'') +'吗？',function(e){
								if(e=='yes'){
									Ext.Ajax.request({
										url:Msw.getUrl(menuDEL.id),
										params:{id:ss[0].data.id},
				                		success: function(r,v){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除成功！');
				                			inte.ds.reload();
				                		},
				                		failure: function(r){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除失败！');
				                			inte.ds.reload();
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
				                			inte.ds.reload();
				                		},
				                		failure: function(r){
				                			var a = Ext.util.JSON.decode(r.responseText);
											Msw.tips('提示','{0}',a.msg ? a.msg : '删除失败！');
				                			inte.ds.reload();
				                		}
									});
								}
							}, b);
						}
					}
				}));
				bbar.insertButton(i++, new Ext.Toolbar.Separator());
			}
			if(menuEXC){
				bbar.insertButton(i++, new Msw.ExcButtonConfig(Msw.getUrl(menuEXC.id), inte.getInquiry, bbar));
				bbar.insertButton(i++, new Ext.Toolbar.Separator());
			}
			if(Ext.isFunction(inte.addBbarButtonFn)) inte.addBbarButtonFn(inte, bbar, i);
			return bbar;
		}
	}
	
	this.getGrid = function(){
		_this = this;
		var inte = this;
		this.grid = new Ext.grid.GridPanel({
//			autoHeight:true,	//自动高度
//			viewConfig:{
//				onLayout:function(vw, vh){
//					if(inte.grid.autoHeight){
//				        this.scroller.dom.style.overflow = 'auto';   
//				        if(this.innerHd){   
//				            this.innerHd.style.width = (vw)+'px';   
//				        } 
//					}
//				}
//			},
			stripeRows:true,	//奇偶行不同颜色
			ds:inte.getStore(),
			cm:inte.getCM(),
			sm:inte.csm,
			title:'',
			loadMask:true,
			region:'center',
			border:false,
			tbar:inte.getTbars()[0],
			bbar:inte.getBbar(),
			plugins:inte.myPlugin || null,
			listeners:{
				'celldblclick':function(g, row){
					var menuGET = Msw.Menu.fg(inte.menu, Msw.G.GET.k);
					if(!menuGET) return;
					if(Ext.isFunction(inte.selectFN)){ if(inte.selectFN(inte.ds.getAt(row).data,inte.menu,menuGET,inte.ds) !== true) return;}
					
					if(inte.celldblclickLoad===true){
						Ext.Ajax.request({
							url:Msw.getUrl(menuGET.id),
							params:{id:inte.ds.getAt(row).data.id},
							success:function(f){
								var a = Ext.util.JSON.decode(f.responseText);
								if(!a.success){
									if(a.msg) Ext.Msg.alert('提示',a.msg);
									return;
								}
								if(a.msg) Msw.tips('提示','{0}',a.msg, 3);
								if(Ext.isFunction(inte.selectLoadFN)){ if(inte.selectLoadFN(a.data) === true) return;}
								Msw.util.loadJS.load(menuGET.js, function(){
									Msw.Run(menuGET.commandJs, inte.menu, a.data, inte.ds).show();
								});
							},
							failure:function(f){
								var a = Ext.util.JSON.decode(f.responseText);
								if(a.msg) Ext.Msg.alert('提示',a.msg);
							}
						});
					}else{
						Msw.util.loadJS.load(menuGET.js, function(){
							Msw.Run(menuGET.commandJs, inte.menu, inte.ds.getAt(row).data, inte.ds, null, inte.myArgument).show();
						});
					}
				},
				'render': function(w){
					if(inte.tbars.length>1){
						for(var i=1; i<inte.tbars.length; i++){
							inte.tbars[i].render(this.tbar);
						}
					}
					new Ext.KeyNav(this.tbar.id,{
						'enter':function(){
							Ext.getCmp(inte.id+'select').handler();
						}
					});
				},
				'afterlayout':afterlayoutFn=function(){
					if(inte.tbarHide){
						if(inte.tbars.length>1){
							for(var i=0; i<inte.tbars.length-1; i++){
								inte.tbars[i].hide();
							}
						}
					};
					inte.grid.removeListener('afterlayout', afterlayoutFn);
				}
			}
		});
		
		if(this.upsequerce===true){
			var menuUP = Msw.Menu.fg(inte.menu, 'UP'),
				menuGET = Msw.Menu.fg(inte.menu, 'GET');
			if(menuUP){
				var subfn=function(id,seq,toId){
					Ext.Ajax.request({
						url:Msw.getUrl(menuUP.id),
						params:{id:id,upsequerce:seq,toId:toId},
	            		success: function(r,v){
	            			var a = Ext.util.JSON.decode(r.responseText);
	            			if(a.success){
								Msw.tips('提示','{0}',a.msg ? a.msg : '移动成功！');
	            				inte.ds.reload();
	            			}else{
								Msw.tips('提示','{0}',a.msg ? a.msg : '移动失败！');
	            			}
	            		},
	            		failure: function(r){
	            			var a = Ext.util.JSON.decode(r.responseText);
							Msw.tips('提示','{0}',a.msg ? a.msg : '移动失败！');
	            		}
					});
				},upfn=function(d,seq){
					if(seq=='move'){
						if(!upfn.menu){
							upfn.menu=Ext.apply({},inte.menu);
							upfn.menu.commandJs=upfn.menu.commandJs.substring(0,upfn.menu.commandJs.indexOf('.getWin'))+'_upsequerce.getWin';
						};
						var win = Msw.Window.getWin("双击选择移至其上方", Msw.Run(upfn.menu.commandJs, upfn.menu, null, function(o){
							win.close();
							if(!o) return;
							if(d.id==o.id){
								Msw.Msg.Error('不能选择自身!');
							}else{
								subfn(d.id,seq,o.id);
							}
						})).show();
					}else{
						subfn(d.id,seq);
					}
				};
	        	this.grid.on('cellcontextmenu',function(g, row, cell, e){
	        		e.preventDefault();
	        		g.getSelectionModel().selectRow(row,false);
	        		if(!g.cellMenu){
	        			g.cellMenu=new Ext.menu.Menu([{
			                text:'上移',
			                iconCls:'arrow_up',
			                handler:function(){
			                	upfn(g.cellMenu.d,'up');
			                }
			            },{
			                text:'下移',
			                iconCls:'arrow_down',
			                handler:function(){
			                	upfn(g.cellMenu.d,'down');
			                }
			            },{
			                text:'移至',
			                iconCls:'arrow_redo',
			                handler:function(){
			                	upfn(g.cellMenu.d,'move');
			                }
			            }]);
	        		};
	        		var d=g.getStore().getAt(row).data;
	        		g.cellMenu.d=d;
	        		g.cellMenu.showAt(e.getPoint());
	        	});
			}
		}
		
		if(this.csmHidden===false) this.grid.getColumnModel().setHidden(1, false);
		if(Ext.isFunction(this.gridInitFn)) this.gridInitFn(this.grid);
		return this.grid;
	}
	this.init = function(){
		if(Ext.isFunction(this.config)) this.config();
		if(Ext.isFunction(this.configEnd)) this.configEnd();
		if(this.getsParams) this._getsParams=Ext.apply({},this.getsParams);
		var inqs = [];
		for(var obj in this.object){
			var o = this.object[obj].hiddenName || this.object[obj].name || obj;
			if(!this.myInquiry[o] && this.object[obj].inq){
				this.myInquiry[o]={
					name:this.object[obj].name,
					title:this.object[obj].title,
					value:this.object[obj].value,
					object:this.object[obj].object,
					ht:this.object[obj].ht,
					seq:this.object[obj].seq || 0,
					o:o
				};
				inqs.push(this.myInquiry[o]);
			}
		}
		var myinq;
		for(var i=0; i<inqs.length; i++){
			for(var j=i+1; j<inqs.length; j++){
				if(inqs[i].seq > inqs[j].seq){
					myinq = inqs[i];
					inqs[i] = inqs[j];
					inqs[j] = myinq;
				}
			}
		}
		this.myInquiry = {};
		for(var i=0; i<inqs.length; i++){
			this.myInquiry[inqs[i].o] = inqs[i];
		}
		if(Ext.isFunction(this.initEnd)) this.initEnd();
	}
	this.getWin=function(menu, query, fn, exc){
		if(this._getsParams) this.getsParams=Ext.apply({},this._getsParams);
		this.inquiry = {};
		this.menu = menu;
		this.query = query;
		this.exc = exc;
		if(Ext.isFunction(fn)) this.selectFN = fn;
		if(Ext.isFunction(this.getsWinAction)) this.getsWinAction.apply(this, arguments);
		return this.getGrid();
	}
};