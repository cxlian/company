//行业
window.HyDatas=[];
window.HyDatas.push(['01','IT/互联网/通信/电子']);
window.HyDatas.push(['0101','IT/互联网/通信/电子']);
window.HyDatas.push(['0102','计算机软件']);
window.HyDatas.push(['0103','计算机硬件']);
window.HyDatas.push(['0104','计算机服务(系统/数据/维护)']);
window.HyDatas.push(['0105','互联网/电子商务']);
window.HyDatas.push(['0106','网络游戏']);
window.HyDatas.push(['0107','通信(设备/运营/增值服务)']);
window.HyDatas.push(['0108','电子技术/半导体/集成电路']);

window.HyDatas.push(['02','金融/银行/证券/基金']);
window.HyDatas.push(['0201','投资']);
window.HyDatas.push(['0202','保险']);

window.HyDatas.push(['03','房产/建筑建设/物业']);
window.HyDatas.push(['0301','房地产开发']);
window.HyDatas.push(['0302','建筑/建材/工程']);
window.HyDatas.push(['0303','家居/室内设计/装饰装潢']);
window.HyDatas.push(['0304','物业管理/商业中心']);

window.HyDatas.push(['04','广告/传媒/印刷出版']);
window.HyDatas.push(['0401','广告/会展/公关']);
window.HyDatas.push(['0402','媒体/出版/影视/文化']);
window.HyDatas.push(['0403','印刷/包装/造纸']);

window.HyDatas.push(['05','消费零售/贸易/交通物流']);
window.HyDatas.push(['0501','零售/批发']);
window.HyDatas.push(['0502','贸易/进出口']);
window.HyDatas.push(['0503','快速消费品(饮食/烟酒/日化)']);
window.HyDatas.push(['0504','服饰/纺织/皮革']);
window.HyDatas.push(['0505','家具/家电']);
window.HyDatas.push(['0506','礼品/玩具/工艺品/收藏品']);
window.HyDatas.push(['0507','交通/运输/物流']);

window.HyDatas.push(['06','加工制造/设备仪表']);
window.HyDatas.push(['0601','机械/设备/重工']);
window.HyDatas.push(['0602','仪器仪表/工业自动化']);
window.HyDatas.push(['0603','汽车及零配件']);
window.HyDatas.push(['0604','办公用品及设备']);
window.HyDatas.push(['0605','原材料及加工']);

window.HyDatas.push(['07','咨询中介/教育科研/专业服务']);
window.HyDatas.push(['0701','教育/培训']);
window.HyDatas.push(['0702','学术/科研']);
window.HyDatas.push(['0703','中介服务']);
window.HyDatas.push(['0704','专业服务(咨询/财会/法律)']);
window.HyDatas.push(['0705','检验/检测/认证']);

window.HyDatas.push(['08','医药生物/医疗保健']);
window.HyDatas.push(['0801','制药/生物工程']);
window.HyDatas.push(['0802','医疗/卫生']);
window.HyDatas.push(['0803','医疗设备/器械']);

window.HyDatas.push(['09','服务业']);
window.HyDatas.push(['0901','酒店/旅游']);
window.HyDatas.push(['0902','餐饮业']);
window.HyDatas.push(['0903','娱乐/休闲/体育']);
window.HyDatas.push(['0904','美容/保健']);
window.HyDatas.push(['0905','生活服务']);

window.HyDatas.push(['10','能源/矿产/石油化工']);
window.HyDatas.push(['1001','电力/水利']);
window.HyDatas.push(['1002','能源/矿产/采掘/冶炼']);
window.HyDatas.push(['1003','石油/石化/化工']);

window.HyDatas.push(['11','政府/非赢利机构/其他']);
window.HyDatas.push(['1101','政府/公共事业/非营利机构']);
window.HyDatas.push(['1102','环保']);
window.HyDatas.push(['1103','农/林/牧/渔']);
window.HyDatas.push(['1104','跨行业多种经营']);
window.HyDatas.push(['1105','其他行业']);

window.HyDatasJSON={};
window.HyDatasTree=[];
(function(){
	var ts=['├ ','├─├ ','├─├─├ ','├─├─├─├ '],k,v;
	for(var i=0; i<window.HyDatas.length; i++){
		k=window.HyDatas[i][0];
		v=window.HyDatas[i][1];
		window.HyDatasJSON[k]=v;
		window.HyDatasTree.push([k, ts[k.length/2-1]+v]);
	};
})();