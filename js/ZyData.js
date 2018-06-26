//职业
window.ZyDatas=[];
window.ZyDatas.push(['01','销售/市场/客服/贸易']);
window.ZyDatas.push(['0101','销售管理']);
window.ZyDatas.push(['0102','销售人员']);
window.ZyDatas.push(['0103','销售行政及商务']);
window.ZyDatas.push(['0104','市场/策划/公关']);
window.ZyDatas.push(['0105','客服/技术支持']);
window.ZyDatas.push(['0106','贸易/采购']);

window.ZyDatas.push(['02','生产/质管/技工']);
window.ZyDatas.push(['0201','生产制造管理']);
window.ZyDatas.push(['0202','质量/安全管理']);
window.ZyDatas.push(['0203','技术工人']);

window.ZyDatas.push(['03','经营管理/人力资源/行政']);
window.ZyDatas.push(['0301','经营管理']);
window.ZyDatas.push(['0302','人力资源']);
window.ZyDatas.push(['0303','行政/后勤']);
window.ZyDatas.push(['0304','计算机应用']);
window.ZyDatas.push(['0305','互联网/网络']);
window.ZyDatas.push(['0306','计算机软硬件']);

window.ZyDatas.push(['04','计算机/电子/电器/仪表/通信']);
window.ZyDatas.push(['0401','IT管理']);
window.ZyDatas.push(['0402','IT品质/技术支持']);
window.ZyDatas.push(['0403','电子/半导体/电器/仪表']);
window.ZyDatas.push(['0404','通信']);

window.ZyDatas.push(['05','财务/金融/保险/银行']);
window.ZyDatas.push(['0501','财务/审计/税务']);
window.ZyDatas.push(['0502','证券/金融/投资/银行']);
window.ZyDatas.push(['0503','保险']);

window.ZyDatas.push(['06','建筑/房地产/物业管理']);
window.ZyDatas.push(['0601','建筑']);
window.ZyDatas.push(['0602','房地产']);
window.ZyDatas.push(['0603','物业管理']);

window.ZyDatas.push(['07','电气/电力/能源/化工']);
window.ZyDatas.push(['0701','电气']);
window.ZyDatas.push(['0702','电力/能源']);
window.ZyDatas.push(['0703','化工']);

window.ZyDatas.push(['08','汽车/机械/服装']);
window.ZyDatas.push(['0801','汽车']);
window.ZyDatas.push(['0802','机械']);
window.ZyDatas.push(['0803','服装/纺织品']);

window.ZyDatas.push(['09','教育/法律/咨询/翻译/医药']);
window.ZyDatas.push(['0901','教育']);
window.ZyDatas.push(['0902','法律']);
window.ZyDatas.push(['0903','咨询']);
window.ZyDatas.push(['0904','翻译']);
window.ZyDatas.push(['0905','医院/医疗']);
window.ZyDatas.push(['0906','制药/医疗器械']);

window.ZyDatas.push(['10','广告/媒体/艺术/出版']);
window.ZyDatas.push(['1001','广告']);
window.ZyDatas.push(['1002','影视/媒体']);
window.ZyDatas.push(['1003','艺术设计']);
window.ZyDatas.push(['1004','新闻/出版']);

window.ZyDatas.push(['11','服务业']);
window.ZyDatas.push(['1101','百货/零售']);
window.ZyDatas.push(['1102','保安/家政']);
window.ZyDatas.push(['1103','餐饮/旅游/娱乐']);
window.ZyDatas.push(['1104','美容/健身']);
window.ZyDatas.push(['1105','物流/交通/仓储']);

window.ZyDatas.push(['12','其他专业人员']);
window.ZyDatas.push(['1201','其他专业人员']);


window.ZyDatasJSON={};
window.ZyDatasTree=[];
(function(){
	var ts=['├ ','├─├ ','├─├─├ ','├─├─├─├ '],k,v;
	for(var i=0; i<window.ZyDatas.length; i++){
		k=window.ZyDatas[i][0];
		v=window.ZyDatas[i][1];
		window.ZyDatasJSON[k]=v;
		window.ZyDatasTree.push([k, ts[k.length/2-1]+v]);
	};
})();