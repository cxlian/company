//保持登陆
setInterval(function(){
	Ext.Ajax.request({
		url:Msw.getUrl('_25&organization.id=-1'),
		success: function(r,v){},
		failure: function(r){}
	});
},300000);
//禁止整个页面的右键
Msw.ExcNodes={
	'INPUT':'INPUT',
	'TEXTAREA':'TEXTAREA',
	'IMG':'IMG'
};
Ext.getDoc().on("contextmenu", function(e,a){
	if(!(a.nodeName && Msw.ExcNodes[a.nodeName.toUpperCase()])) e.stopEvent();
});
Msw.$ = function(id){return (typeof id!='string') ? id : document.getElementById(id);};
Msw.util.checkTime=4000;	//设置间隔时间验证是否已经登录（单位毫秒）
Msw.getUrl = function(id){
	return Msw.getUrl.url+'?msw='+id;
};
Msw.getUrl.url = 'run';
Msw.MenuActiveItem = 'xxgl';
Msw.urls={
    upload:function(){return Msw.basePath+'upload.msw?w=1180&&SESSIONID='+Msw.sessionId;}
};
Msw.jsfile={
	ext_base:'ext/adapter/ext/ext-base.js',
	ext_all:'ext/ext-all.js',
	main:'js/main.js',
	viewport:'js/Viewport.js',
	ext_zh:'js/ext-lang-zh_CN.js',
	util:'js/util.js',
	isLogin:'js/IsLogin.js',
	login:'js/Login.js',
	tabCloseMenu:'js/TabCloseMenu.js',
	dowFile:'js/DownloadFile.js',
	upPassword:'js/UpPassword.js',
	win:'js/Window.js',
	spinnerfield:'ext/ux/SpinnerField.js',
	todo:'js/admin/Todo.js',
	selectOrg:'js/admin/SelectOrganization.js'
};
Msw.Qx = {
    'myxjgl':'hdgl-04'  //我办理中的信件
};
Msw.LM = function(){
	return {
		'getData':function(){
			if(this.data)  return this.data;
			var d=[],getg=function(i){
				var a = '';
				for(var j=0; j<i; j++){
					a+='├─';
				}
				return a;
			},get = function(m, d, a){
				if(!m)return;
				if(m.children && m.children.length > 0){
					var g = getg(a),menu,mya = a+1;
					for(var i=0; i<m.children.length; i++){
						menu = m.children[i];
						d.push(['xws.msw?id='+menu.id, g+'├ '+menu.title]);
						get(menu, d, mya);
					}
				}
			};
			get(Msw.Menu.fi(Msw.User.get().role.children,'wzlm',true), d, 0);
			this.data = d;
			return this.data;
		}
	};
}();

Msw.cssfile={
	ext_all:'ext/resources/css/ext-all.css',
	main:'css/main.css',
	ext_patch:'css/ext-patch.css'
};
Msw.limit=-1;	//表格显示的行数,当然登录时从服务器中提取

Msw.dataSaveLength={};	//需要保存的数据
Msw.removeTab=false;	//是否可移除选项卡
Msw.Geanre = {};	//菜单类型
Msw.PublicMenu = [];	//开放菜单
Msw.Menu = function(){
	var cache = {};
	
	//对数组或对象下的children查找
	var getM = function(menus, fn){
		if(menus.length != undefined){
			for(var m in menus){
				if(fn(menus[m])) return menus[m];
			}
			return;
		}else{
			if(menus.children && menus.children.length>0){
				return getM(menus.children, fn);
			}
			return;
		}
	}
	//对数组或对象下的所有children查找
	var getMs = function(menus, fn){
		if(!menus) return;
		if(menus.length != undefined){
			var mym;
			for(var m in menus){
				if(fn(menus[m])) return menus[m];
				mym = getMs(menus[m].children, fn);
				if(mym) return mym;
			}
			return;
		}else{
			if(menus.children && menus.children.length>0){
				return getMs(menus.children, fn);
			}
		}
		return;
	}
	//查找父菜单
	var mfn = function(m){return m && m.id ? m.id==mfn.id : false;}
	var getParen = function(par, menus){
		mfn.id = menus.id;
		if(par && par.length != undefined){
			for(var i=0; i<par.length; i++){
				if(getM(par[i], mfn)) return par[i];
				var myp = getParen(par[i].children, menus);
				if(myp) return myp
			}
		}
		return;
	}
	var fi = function(menus, id, all){
		this.id = id;
		if(!this.fn) this.fn = function(m){return m && m.id ? m.id==this.id : false;};
		if(!menus) return undefined;
		if(all){
			if(!cache[id]) cache[id]=getMs(menus, this.fn);
			return cache[id];
		}else{
			return getM(menus, this.fn);
		}
		//return all ? getMs(menus, function(m){return m && m.id ? m.id==id : false;}) : getM(menus, function(m){return m && m.id ? m.id==id : false;});
	};
	var fg = function(menus, geanre, all){
		if(!menus) return undefined;
		return all ? getMs(menus, function(m){return m && m.geanre ? m.geanre==geanre : false;}) : getM(menus, function(m){return m && m.geanre ? m.geanre==geanre : false;});
	};
	
	return {
		findById:function(menus, id, all){
			if(typeof menus=='string') id=menus;
			return Msw.User.getKVMenus()[id];
			//return fi(menus, id, all);
		},
		findByGeanre:function(menus, geanre, all){
			return fg(menus, geanre, all);
		},
		findByParent:function(menus){
			return getParen(Msw.User.get().role.children, menus);
		}
	};
}();
Msw.Menu.fi = Msw.Menu.findById;
Msw.Menu.fg = Msw.Menu.findByGeanre;
Msw.Menu.fp = Msw.Menu.findByParent;

Msw.Run = function(){
	if(Ext.isEmpty(arguments) || Ext.isEmpty(arguments[0])) return;
	if(arguments.length == 1){
		return eval(arguments[0]+'()');
	}else{
		var liof = arguments[0].lastIndexOf('.');
		var sup = arguments[0];
		if(liof!=-1){
			sup = arguments[0].substring(0,liof);
		}
		try{
			var args = [];
			for(var i=1; i<arguments.length; i++){
				args.push(arguments[i]);
			}
			return eval(arguments[0]).apply(eval(sup),args);
		}catch(e){
		}
	}
}
//用户
Msw.User = function(){
	var user, title='后台管理',kvmenus;
	var getOrg = function(org){
		if(!org) return "";
		return getOrg(org.organization)+org.title+"<b> &gt;&gt; </b>";
	};
	var orgtype = function(org, orgType){
		if(!org) return null;
		if(org.orgType==orgType) return org;
		return orgtype(org.organization,orgType);
	};
	return {
		getName: function(){
			return user ? user.name : "";
		},
		set:function(u){
			user = u;
			var inf = Msw.$('_topUserName') ? Msw.$('_topUserName') : Msw.$('#_topUserName');
			if(user){
				if(inf) inf.innerHTML = "<span style='font-size:12px;'>"+getOrg(u.organization.organization)+u.organization.title
					+"<b> &gt;&gt; </b><span style='color:#F00; font-size:12px;'><b>"+user.name+"</b></span>（"+user.role.title+"）</span>";
				if(inf){
					var uTitle = document.all?inf.innerText:inf.textContent;
					uTitle = uTitle.replace(/\s>>\s/g,'→');
					window.document.title = title+" | "+uTitle;
				}
			}else{
				if(inf) inf.innerHTML = "尚未登录";
				window.document.title = title+"→尚未登录";
			}
		},
		get:function(){
			return user;
		},
		getKVMenus:function(){
			if(kvmenus) return kvmenus;
			kvmenus={};
			var fn=function(ms){
				if(!(ms && ms.length)) return;
				Ext.each(ms,function(m){
					kvmenus[m.id]=m;
					fn(m.children);
				});
			};
			fn(Msw.PublicMenu);
			fn(Msw.ProtectedMenuJSON);
			fn(user.role.children);
			return kvmenus;
		},
		getsNV:function(us){
			var nv = {};
			nv.n = "";
			nv.v = [];
			Ext.each(us,function(u){
				nv.n+= "、"+u.name;
				nv.v.push({'users.id':u.id});
			});
			if(!Ext.isEmpty(nv.n)) nv.n = nv.n.substring(1);
			nv.v = Ext.encode(nv.v);
			return nv;
		},
		getOrg:function(orgType, org){
			if(!user) return;
			return orgtype(org?org:user.organization, orgType);
		}
	}
}();

Msw.copy = function(sub, sup){
	if(!sup) return;
	if(Ext.isArray(sup)){
		for(var i=0; i<sup.length; i++){
			sub[i] = sup[i];
		}
	}else{
		Ext.apply(sub, sup);
	}
}

//不可编辑时显示的样式
Msw.getds=Msw.getdisabledStyle=function(v){
	return '<span style="color:#999;">' + v + '</span>';
};


Msw.getTime=function(v){
	if(!(v && v.time)) return '';
	var d=new Date();
	d.setTime(v.time);
	return !v || v=='' ? '' : Ext.util.Format.date(d,'Y-m-d H:i:s');
};
Msw.getDate=function(v){
	if(!(v && v.time)) return '';
	var d=new Date();
	d.setTime(v.time);
	return !v || v=='' ? '' : Ext.util.Format.date(d,'Y-m-d');
};
Msw.Date=function(){
	return (new Date()).format('Y-m-d');
}
Msw.Time=function(){
	return (new Date()).format('Y-m-d H:i:s');
}
Msw.Date.fDate=function(d){
	if(!d)d=new Date();
	return d.getFirstDateOfMonth().format('Y-m-d');
}
Msw.Date.lDate=function(d){
	if(!d)d=new Date();
	return d.getLastDateOfMonth().format('Y-m-d');
}
Msw.Date.fTime=function(d){
	if(!d)d=new Date();
	return d.getFirstDateOfMonth().format('Y-m-d H:i:s');
}
Msw.Date.lTime=function(d){
	if(!d)d=new Date();
	return d.getLastDateOfMonth().format('Y-m-d')+' 23:59:59';
}
Msw.ns("Msw.Msg");
Msw.Msg.Info = function(msg, fn, animEl){
	if(Ext.isString(fn) || Ext.isObject(fn)) animEl = fn;
	Ext.Msg.show({
		title:'提示',
		msg:msg,
		buttons:Ext.Msg.OK,
		//animEl:Ext.isObject(animEl)?animEl.id:animEl,
		fn:fn,
		icon:Ext.Msg.INFO
	});
};
Msw.Msg.alert = function(msg, fn, animEl){
	Msw.Msg.Info(msg, fn, animEl);
};
Msw.Msg.Warning = function(msg, fn, animEl){
	if(Ext.isString(fn) || Ext.isObject(fn)) animEl = fn;
	Ext.Msg.show({
		title:'禁止',
		msg:msg,
		buttons:Ext.Msg.OK,
		//animEl:Ext.isObject(animEl)?animEl.id:animEl,
		fn:fn,
		icon:Ext.Msg.WARNING
	});
};
Msw.Msg.Error = function(msg, fn, animEl){
	if(Ext.isString(fn) || Ext.isObject(fn)) animEl = fn;
	Ext.Msg.show({
		title:'出错',
		msg:msg,
		buttons:Ext.Msg.OK,
		//animEl:Ext.isObject(animEl)?animEl.id:animEl,
		fn:fn,
		icon:Ext.Msg.ERROR
	});
};
Msw.Msg.Progress = function(msg){
	Ext.Msg.show({
		msg : msg?msg:'请稍后...',
		title:'提示',
		width : 300,
		wait : true,
		progress : true,
		closable : true,
		waitConfig : {
			interval : 200
		},
		icon : Ext.Msg.INFO
	});
};
Msw.Msg.Confirm = function(msg, fn, animEl){
	if(Ext.isString(fn) || Ext.isObject(fn)) animEl = fn;
	Ext.Msg.show({
		title:'提示',
		msg:msg,
		buttons:Ext.Msg.YESNO,
		//animEl:Ext.isObject(animEl)?animEl.id:animEl,
		fn:fn,
		icon:Ext.Msg.QUESTION
	});
}

Msw.Msg.ync = function(msg, fn, animEl){
	if(Ext.isString(fn) || Ext.isObject(fn)) animEl = fn;
	Ext.Msg.show({
		title:'提示',
		msg:msg,
		buttons:Ext.Msg.YESNOCANCEL,
		//animEl:Ext.isObject(animEl)?animEl.id:animEl,
		fn:fn,
		icon:Ext.Msg.QUESTION
	});
}
/**
 * 
 * @param {String} url
 */
Msw.getThumbnail = function(url){
	if(!url || url.indexOf('userfiles')==-1) return;
	var type, currentFolder, FileName;
	url = url.substring(url.indexOf('userfiles')+10, url.length);
	var type = url.substring(0, url.indexOf('/'));
	type = type.substring(0,1).toUpperCase()+type.substring(1,type.length);
	url = url.substring(url.indexOf('/')+1, url.length);
	if(url.indexOf('/')==-1){
		currentFolder = '';
		FileName = url;
	}else{
		currentFolder = '/'+url.substring(0, url.lastIndexOf('/')+1);
		FileName = url.substring(url.lastIndexOf('/')+1, url.length);
	}
	return '../ckfinder/core/connector/java/connector.java?command=Thumbnail&type='+type+'&currentFolder='+currentFolder+'&langCode=zh-cn&hash=95dc94e3f24464fe8c26aeb9bee1220&FileName='+FileName;
}