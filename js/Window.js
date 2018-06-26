Msw.Window = function(){
	var win = function(title, items, nofn, csmfn, selectData, animEl, width, modal){
		width=width?width:900;
		var id = new Date().getTime();
		var selectObjects = [];
		var w = new Ext.Window({
			iconCls:'edit',	//图标
			modal:(modal===false?false:true),
			title: title,
			//resizable:false,	//是否可拖动大小
			//collapsed:true,
			maximizable:true,
	        constrainHeader:true,
			collapsible:true,
			pageY:20,
			pageX : document.body.clientWidth / 2 - width / 2,
	        width: width,
			autoScroll: true,
			//autoHeight:true,	//自动高度
			height:400,
	        plain: true,
	        tbar:new Ext.Toolbar({id:id+'toolbar',hidden:true,items:['选中的项',{
		    	xtype:'textfield',
        		fieldLabel:'选中的项',
				//readOnly:true,
				//allowBlank:false,	//不能为空
			    disabled:true,	//是否禁用
			    readOnly:true,
			    width:515,
        		id:id+'values'
			}]}),
	        bodyStyle: 'padding:5px;',
	        buttonAlign: 'center',
			plain:true,	//强制颜色
	        items: [items],
	        //animateTarget:Ext.isObject(animEl)?animEl.id:animEl,
	        //animateTarget:Ext.getBody(),
	        id:Ext.id(),
	        listeners:{
	        	'beforerender':function(w){
	        		if(csmfn){
	        			if(!items.getColumnModel()) return;
	        			if(items.getColumnModel().isHidden(1)) items.getColumnModel().setHidden(1, false);
						items.purgeListeners()
		        		w.addButton({text:'确 定'},function(){
		        			if(csmfn) csmfn(selectObjects);
		        		});
	        		}
	        		if(nofn){
		        		w.addButton({text:'清空选择'},function(){
		        			if(nofn) nofn();
		        			w.close();
		        		});
	        		}
	        		w.addButton({text:'关 闭'},function(){
	        			w.close();
	        		});
	        		w.add
					
	        	},
	        	'show':function(){
					if(csmfn && items){
						selectObjects = selectData ? selectData : [];
						var addObj = function(o){
							for(var i=0; i<selectObjects.length; i++){
								if(selectObjects[i].id==o.id) return;
							}
							selectObjects.push(o);
							setValues();
						}
						var delObj = function(o){
							var myselectObjects=[];
							for(var i=0; i<selectObjects.length; i++){
								if(selectObjects[i].id!=o.id){
									myselectObjects.push(selectObjects[i]);
								}
							}
							selectObjects = myselectObjects;
							setValues();
						}
						var setValues = function(){
							var values = "";
							for(var i=0; i<selectObjects.length; i++){
								if(selectObjects[i].name){
									values+=("、"+selectObjects[i].name);
								}else if(selectObjects[i].title){
									values+=("、"+selectObjects[i].title);
								}else{
									values+=("、"+selectObjects[i].id);
								}
							}
							Ext.getCmp(id+'values').setValue(values=='' ? '' : values.substring(1, values.length));
						}
						items.getSelectionModel().on("rowdeselect",function(a, b){
							var ws = items.getStore().getAt(b).data;
							if(!ws) return;
							delObj(ws);
						})
						items.getSelectionModel().on("rowselect",function(a, b){
							var ws = items.getStore().getAt(b).data;
							if(!ws) return;
							addObj(ws);
						})
						setValues();
					}
					
	        		if(items.getStore()){
	        			items.autoHeight=false;
			            var getCssDIVEl = function(id, css){
			            	var objs = document.getElementById(items.getId()).getElementsByTagName('div');
			            	if(!(objs && objs.length>0)) return null;
			            	for(var i=0; i<objs.length; i++){
			            		if(objs[i].className && objs[i].className.indexOf(css)!=-1){
			            			return objs[i];
			            		}
			            	}
			            	return null;
			            }
			            items.getStore().on('load',function(ds){
				            var rowDIV = getCssDIVEl(items.getId(), 'x-grid3-row'),
					            row_div_h = rowDIV ? rowDIV.offsetHeight : 20,
					            hDIV = getCssDIVEl(items.getId(), 'x-grid3-header-offset'),
					            h_div_h = hDIV ? hDIV.offsetHeight : 0,
					            bbar_h = items.bbar ? items.bbar.getSize().height : 0,
					            tbar_h = items.tbar ? items.tbar.getSize().height : 0,
								h = h_div_h+row_div_h*ds.getCount()+bbar_h+tbar_h+20,
								wh = document.body.clientHeight;
							if(wh-100 < h){
								items.setSize({height: wh-100});
							}else{
								items.setSize({height: h});
							}
							if(csmfn && selectData){
								Ext.getCmp(id+"toolbar").show();
								var record;
								var records = [];
								for(var i=0; i<selectObjects.length; i++){
									record = items.getStore().getById(selectObjects[i].id);
									if(record) records.push(record);
								}
								items.getSelectionModel().selectRecords(records);
							}
							//w.center();
			            });
		        	}
	        	}
	        }
		});
		return w;
	}
	return {
		/**
		 * title 窗口标题
		 * items 在窗口子表格控件
		 * nofn 添加“不选择”按钮 通知事件 传选择中的对象
		 * csmfn 添加“选 择”按钮 通知事件 传入选择中的对象数组
		 * selectData 有csmfn方法时，表格中默认选中的项
		 * width 窗口宽度
		 */
		getWin:function(title, items, nofn, csmfn, selectData, animEl, width, modal){
			return new win(title, items, nofn, csmfn, selectData, animEl, width, modal);
		}
	}
}();