Ext.ns('Msw.interfaces');
Msw.interfaces.Get = function(){
	this.object = {};
	this.title = '';
	this.iconCls = 'edit';	//图标
	this.modal = true;
	this.resizable=true;	//是否可拖动大小
	this.collapsible = true;
	this.width = 500;
	this.height;
	this.minWidth = 400;
	this.maxWidth;
	this.minHeight;
	this.maxHeight;
	this.autoHeight = true;
	this.constrainHeader = true;
	this.plain = true;	//强制颜色
	this.bodyStyle='padding:5px;';
	this.buttonAlign='center';
	this.maximizable=true;
	this.form;
	this.menu = {};
	this.data;
	this.addButton;
	this.layout='fit';
	//由子类完成
	this.getForm = function(){
	/*
		this.form = new Ext.FormPanel({
			frame:true,
			labelWidth: 60,
			items:[{},{
				layout:'column',	//水平排版
				baseCls:'x-plain',
				border:false,
				items:[{
					layout:'form',	//垂直排版
					border:false,	//是否显示边框
					baseCls:'x-plain',
					columnWidth:.5,
					items:[]
				},{
					layout:'form',	//垂直排版
					border:false,	//是否显示边框
					baseCls:'x-plain',
					columnWidth:.5,
					items:[]
				}]
			}]
		});
		if(Ext.isFunction(this.initForm)) this.initForm(this.form);
		return this.form;
	*/
	};
	this.setValue = function(){
		if(this.form && this.object && this.data){
			var rec = this.object, obj;
			for(var i in rec){
				if(Ext.isEmpty(rec[i].name) || Ext.isEmpty(this.data[rec[i].name])) continue;
				obj = this.form.find('name', i);
				if(Ext.isEmpty(obj)) continue;
				for(var j=0; j<obj.length; j++){
					if(Ext.isEmpty(rec[i].map)){
						var xtype = obj[j].getXType?obj[j].getXType():'';
						if(xtype=='datefield'){
							obj[j].setRawValue(Msw.getDate(this.data[rec[i].name]));
						}else if(xtype=='newwindowsearch'){
							var id = this.data[rec[i].name].id,
								text = this.data[rec[i].name][obj[j].textname] || this.data[rec[i].name].name || this.data[rec[i].name].title || '';
							if(id && text)
								obj[j].setValue(text, id);
							else
								obj[j].setValue(this.data[rec[i].name]);
						}else if(xtype=='combo'){
							if(this.data[rec[i].name]) obj[j].setValue(this.data[rec[i].name].id || this.data[rec[i].name]);
						}else{
							if(rec[i].type=='object'){
								obj[j].setValue(this.data[rec[i].name][obj[j].textname] || this.data[rec[i].name].title || this.data[rec[i].name].name || '');
							}else if(rec[i].type=='objectTime'){
								obj[j].setRawValue(Msw.getTime(this.data[rec[i].name]));
							}else if(rec[i].type=='objectDate'){
								obj[j].setRawValue(Msw.getDate(this.data[rec[i].name]));
							}else{
								obj[j].setValue(this.data[rec[i].name]);
							}
						}
					}else if(Ext.isFunction(rec[i].map)){
						obj[j].setValue(rec[i].map.call(obj[j], this.data[rec[i].name], this.data));
					}else if(Ext.isString(rec[i].map)){
						var ms = rec[i].map.split('.'),
							val = this.data[rec[i].name];
						for (var n = 0; n < ms.length; n++) {
							val = val[ms[n]];
							if(Ext.isEmpty(val)) break;
						}
						obj[j].setValue((val || ''));
					}
				}
			}
		}
		if(Ext.isFunction(this.setValueEndFn)) this.setValueEndFn.call(this, this.form);
	};
	this.getParams=function(){
		var obj,bp={};
		for(var i in this.object){
			if(this.object[i].sub===false) continue;
			obj = this.form.find('name', i);
			if(Ext.isEmpty(obj)){
				if(this.data) bp[i] = this.data[i];
			}else{
				var ob;
				for(var j=0; j<obj.length; j++){
					if(obj[j].disable===true){
						ob = obj[j];
						break;
					}
				}
				if(!ob){
					ob = obj[obj.length-1];
					if(ob.xtype=='datefield') bp[i]=ob.getRawValue();
					else if(ob.xtype=='newwindowsearch'){
						bp[i]=ob.getValue();
						bp[ob.hiddenName]=ob.getValue();
					}else bp[i]=ob.getValue();
				}
			}
		}
		return bp;
	}
	this.getw = function(){
		var geto = this;
		var w = new Ext.Window({
			iconCls:geto.iconCls,
			modal:geto.modal,
			title:geto.title,
			resizable:geto.resizable,	//是否可拖动大小
	        minWidth:geto.minWidth,
	        maxWidth:geto.maxWidth,
	        minHeight:geto.minHeight,
	        maxHeight:geto.maxHeight,
			autoHeight:geto.height?null:geto.autoHeight,	//自动高度
			width:geto.width,
			height:geto.height,
	        constrainHeader:geto.constrainHeader,
	        plain: geto.plain,
	        bodyStyle: geto.bodyStyle,
	        buttonAlign:geto.buttonAlign,
	        //animateTarget:Ext.isObject(geto.animateTarget)?geto.animateTarget.id:geto.animateTarget,
	        //animateTarget:Ext.getBody(),
	        collapsible:geto.collapsible,
	        maximizable:geto.maximizable,
	        items:[geto.layoutColumn===true?geto.getForm():{
				xtype:'fieldset',
				style:'padding:0px',
				//autoHeight:true,
				layout:'fit',
				region:'center',
				border:false,
            	items:geto.getForm()
	        }],
			layout:geto.layout,
	        bbar:new Ext.ux.StatusBar({
	        	plugins:geto.form?new Ext.ux.ValidationStatus({form:geto.form.getId()}):null
	        })
		});
		if(Ext.isFunction(geto.addButton)){
			geto.addButton(w);
		}else if(geto.form){
			var menuADD, menuUP, menuDEL;
			menuADD = Msw.Menu.fg(this.menu, Msw.G.ADD.k);
			menuUP = Msw.Menu.fg(this.menu, Msw.G.UP.k);
			menuDEL = Msw.Menu.fg(this.menu, Msw.G.DEL.k);
			if(menuADD && !this.data){
				w.addButton({text:'保 存'},function(b){
					if(!geto.form.getForm().isValid()) return;
					var submit = function(){
						geto.form.getForm().submit({
							url:Msw.getUrl(menuADD.id),
							params:geto.getParams(),
							success:function(f, a){
								if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
								geto.father.reload();
								Msw.Msg.Confirm('保存成功，是否继续增加？',function(e){
									if(e!='yes') w.close();
								});
							},
							failure:function(f, a){
								if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
							}
						});
					};
					if(Ext.isFunction(geto.isValid)){
						geto.isValid(geto.form, submit, b);
					}else{
						submit();
					}
				});
			};
			if(menuUP && this.data){
				w.addButton({text:'修 改'},function(b){
					if(!geto.form.getForm().isValid()) return;
					var submit = function(){
						geto.form.getForm().submit({
							url:Msw.getUrl(menuUP.id),
							params:geto.getParams(),
							success:function(f, a){
								if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
								w.close();
							},
							failure:function(f, a){
								if(a.result.msg) Msw.tips('提示','{0}',a.result.msg, 3);
							}
						});
					}
					if(Ext.isFunction(geto.isValid)){
						geto.isValid(geto.form, submit, b);
					}else{
						submit();
					}
				});
			};
			if(menuDEL && this.data){
				w.addButton({text:'删 除'},function(b){
					Msw.Msg.Confirm('确定要删除吗？',function(e){
						if(e=='yes'){
							Ext.Ajax.request({
								url:Msw.getUrl(menuDEL.id),
								params:{id:geto.data.id},
		                		success: function(r,v){
		                			var a = Ext.util.JSON.decode(r.responseText);
		                			w.close();
									Msw.tips('提示','{0}',a.msg ? a.msg : '删除成功！');
		                		},
		                		failure: function(r){
		                			var a = Ext.util.JSON.decode(r.responseText);
									Msw.tips('提示','{0}',a.msg ? a.msg : '删除失败！');
		                		}
							});
						}
					}, b);
				});
			};
			if(Ext.isFunction(geto.addButtonToEnd)) geto.addButtonToEnd(w);
		}
		w.on('close',function(){
			if(geto.father && Ext.isFunction(geto.father.reload)) geto.father.reload();
		});
		w.on('show',function(){
			geto.setValue();
			if(geto.disableForm!==false){
				if((geto.data && !Msw.Menu.fg(geto.menu, Msw.G.UP.k)) || (!geto.data && !Msw.Menu.fg(geto.menu, Msw.G.ADD.k))){
					//geto.form.disable();
					geto.form.cascade(function(){
						if(!(Ext.isFunction(this.isXType) && (
								this.isXType('fieldset')
								|| this.isXType('panel')
								|| this.isXType('tabpanel')
								|| this.isXType('form')
							))){
							this.disable();
						}
					});
				}
			}
			if(Ext.isFunction(geto.onshow)){
				geto.onshow(w, geto.form);
			}
		});
		if(Ext.isFunction(this.action)){
			this.action(w, this.form);
		}
		//Msw.Tools.intoWinSuper(geto.menu, w);
		this.w = w;
		return w;
	};
	this.init = function(){
		this.config();
        if(Ext.isFunction(this.initEnd)) this.initEnd();
	};
	this.getWin=function(menu, data, father, animateTarget){
		this.menu = menu;
		this.data = data;
		this.father = father;
		this.animateTarget = animateTarget;
		if(Ext.isFunction(this.getWinAction)) this.getWinAction.apply(this, arguments);
		return this.getw();
	}
}