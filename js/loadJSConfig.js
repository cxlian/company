//哪个JS目录下有config.js文件，当在加载该目录下的JS文件时先加载这个config.js文件，不包括子目录
if(!window.Msw) Msw = {};
Msw.JSC = Msw.loadJSConfig = function(){
	var jscs = [];
	return {
		add:function(src){
			jscs.push(src);
		},
		is:function(path){
			if(!path || path.lastIndexOf('/config.js')!=-1) return false;
			path = path.substring(0, path.lastIndexOf('/'));
			for(var i=0; i<jscs.length; i++){
				if(jscs[i]==path) return path+'/config.js';
			}
			return false;
		},
		init:function(obj, con, type){
			if(!(Ext.isFunction(obj) && Ext.isFunction(con))) return;
			if(type=='gets'){
				obj.prototype = new Msw.interfaces.Gets();
			}else if(type=='get'){
				obj.prototype = new Msw.interfaces.Get();
			}else{
				return;
			}
			var c = new con();
			for(var o in c){
				obj.prototype[o] = c[o];
			}
			var o = new obj();
			return o;
		}
	}
}();
