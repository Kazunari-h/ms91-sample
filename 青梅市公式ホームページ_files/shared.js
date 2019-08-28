jQuery.noConflict();

(function($){

	$(function(){
		
		//アクティブリンク
		$.gd.activeLink({
			area: '#tmp_gnavi',
			level: 1
		});
		
		//スタイルシート切り替え
		$.gd.changeStyle({
			area: '#tmp_contents'	//ページ内に仕込む場合#tmp_contentsにする
		});
		
		//labelの中のimgをクリックした場合でも、任意のinputタグにfocusをあてる
		$.gd.labelClickable();
		
		//文字サイズ変更
		$.gd.textSize();
		
		//ロールオーバー
		$.gd.rollover({
			area: '#tmp_gnavi'
		});
		
		//max-width指定IE6.0用
		$.gd.wrapperWidth();
		
		//タブ切り替え
		$.gd.tab({
			area: '#tmp_maincontents'
		});	
		
		$.gd = {
			googleSearchImage: function(options){
				
				var c = $.extend({
					area: '#tmp_query',
					backgroundProperty: '#FFFFFF url(/shared/images/gsearch/google_custom_search_watermark.gif) no-repeat left center',
					focusBackgroundProperty: '#FFFFFF'
				},options);
				
				//
				$(c.area)
					.each(function(){
						
						var obj = $(this);
						
						obj
							.css({
								background: c.backgroundProperty
							})
							.bind('focus.googleSearchImage', function(){
								$(this)	.css({
									background: c.focusBackgroundProperty
								});			   
							})
							.bind('blur.googleSearchImage', function(){
								if($(this).val() == ''){
									$(this)	.css({
										background: c.backgroundProperty
									});
								}
							});	
							
						if(obj.val() != ''){
							obj.css({
								background: c.focusBackgroundProperty
							})
						}
						
					});
			}
		};
		
		$.gd.googleSearchImage({
			backgroundProperty: '#FFFFFF url(/shared/images/gsearch/google_custom_search_watermark.gif) no-repeat left center'
		});

	});

})(jQuery);

/*////// set Variable //////////////////////////////////////////////////////////////////////////*/

//var myMenuMaxValue = 3;
var myMenuNaviMaxValue = 5;
var myMenuDefaultTxt = "登録されたページはありません。";
var myMenuEntryBtn = '<p><input type="image" src="/shared/images/common/btn_toroku.gif" width="180" height="22" id="tmp_mymenu_btn" onclick="setMyMenu()" alt="このページを登録する" /></p>';
//var myMenuCantBtn = '/shared/images/common/mymenu-cant-btn.gif';
//var myMenuCantTxt = 'これ以上登録できません';
var myMenuAlreadyBtn = '/shared/images/common/mymenu_already_btn.gif';
var myMenuAlreadyTxt = 'このページはすでに登録されています';
var myMenuAllBtn = '<p><a href="/mymenu/index.html#tmp_list"><img src="/shared/images/common/mymenu_all_btn.gif" alt="登録されたページの一覧を見る" width="180" height="22" /></a></p>';

/*////// shared function ///////////////////////////////////////////////////////////////////////*/

//GetElementClass
var getElementsByClassName = function(className, pElement){
	var d = document, nodes = [];
	if(d.getElementsByClassName){
		nodes = (pElement||d).getElementsByClassName(className);
		return nodes.length > 0 ? nodes : null;
	}else{
		var cls, item;
		var items = (pElement || d).getElementsByTagName("*");
		for(var i = 0, l = items.length; i < l; i++){
			item = items[i];
			if(item.className){
				cls = item.className.split(/\s+/);
				for(var k = 0, kl = cls.length; k < kl; k++){
					if(cls[k]==className){
						nodes[nodes.length] = item; break;
					}
				}
			}
		}
		return nodes.length > 0 ? nodes : null;
	}
}
//配列判定
var isArray = function(obj){
	var flg;
	if(obj instanceof Array){
		flg = true;	
	}else{
		!flg;
	}
	return flg;
};
//プリロード
var preLoadImages = function(){
	for(var i = 0; i < arguments.length; i++){
		if(isArray(arguments[i])){
			var preImages = new Array(arguments[i].length);
			for(var j = 0; j < arguments[i].length; j++){
				preImages[j] = new Image();
				preImages[j].src = arguments[i][j];
			}
		}else{
			var preImages = new Image();
			preImages.src = arguments[i];
		}	
	}	
};

// cookie取得
function getCookie(name){
	if(!name) return;
	var val = "";
	var cookieName = name+"=";
	var tmpCookie = document.cookie + ";";
	var start = tmpCookie.indexOf(cookieName);
	if (start != -1) {
		var end = tmpCookie.indexOf(";", start);
		val = tmpCookie.substring(start + cookieName.length, end);
	}
	return val;
}

// cookie保存
function setCookie(name,value){
	if(!name || !value) return;
	var cookieName = name+"=";
	var exp = new Date();
	exp.setTime(exp.getTime() + 31536000000);
	document.cookie = cookieName + value + "; path=/" + "; expires=" + exp.toGMTString();
}
// cookie削除
function deleteCookie(name,value){
	var cookieName = name+"=";
	var deleteTime = new Date();
	deleteTime.setYear(deleteTime.getYear() - 1);
	document.cookie = cookieName + value + "; path=/" + ";expires=" + deleteTime.toGMTString();
}
// IE6.0の場合実行
function checkBrowser(){
	var uName = navigator.userAgent;
	if (uName.indexOf("MSIE 6.0") > -1){
		return true;
	}
	return false;
}

//マイメニュー
function myMenu() {
	
	var val = getCookie('my_menu');
	var ret = document.getElementById('tmp_linkbox_mymenu_list');
	var ret2 = document.getElementById('tmp_linkbox_mymenu_kanri_list');
	preLoadImages(myMenuAlreadyBtn,myMenuAllBtn);
	//

	if(!ret) return;
	ret.innerHTML = "";
	if(!val) {
		ret.innerHTML = '<p>' + myMenuDefaultTxt + '</p>';
		ret.innerHTML += myMenuEntryBtn;
		if(ret2) ret2.innerHTML = '<p>' + myMenuDefaultTxt + '</p>';
	}
	//
	var dat = eval(val);
	
	if(!dat) return;
	
	if(ret2){
		kanriListCreate(dat,ret2);
	}
	//
	listCreate(dat,ret);
	checkMenu(val);	
}
//
function checkMenu(val) {
	var addUI = document.getElementById('tmp_mymenu_btn');
	if(!val) return;
	var dat = eval(val);
	/*if(dat.length >= myMenuMaxValue && addUI) {	
		addUI.disabled = 'disabled';
		addUI.alt = myMenuAlreadyTxt;
		addUI.src = myMenuCantBtn;
	}*/
	var url = location.href;
	url = url.replace(/index\..*/,'');
	//
	for(var i=0;i<dat.length;i++) {
		if(dat[i][1] == url) {
			addUI.disabled = 'disabled';
			addUI.alt = myMenuAlreadyTxt;
			addUI.src = myMenuAlreadyBtn;
			addUI.style.cursor = "default";
			break;
		}
	}
}
//
function setMyMenu() {
	var title = document.title;	
	var url   = location.href;
	url = url.replace(/index\..*/,'');
	if(!title || !url) return;
	//
	var get_menu = getCookie('my_menu');
	if(get_menu) {
		get_menu = eval(get_menu);
	} else {
		get_menu = new Array();
	}
	//
	get_menu.push([escape(title),url]);	
	//
	var saveArray = new Array();
	var tmp;
	for(var i=0;i<get_menu.length;i++) {
		tmp = "['"+get_menu[i][0]+"','"+get_menu[i][1]+"']";
		saveArray.push(tmp);
	}
	//
	var saveText;
	saveText = "[" + saveArray.join(",") + "]";
	//
	setCookie('my_menu',saveText);
	//
	myMenu();
}
//
function delMenu(){
	var ret = document.getElementById('tmp_linkbox_mymenu_list');
	var ret2 = document.getElementById('tmp_linkbox_mymenu_kanri_list');
	var ul = ret2.getElementsByTagName("ul");
	var input = ul[0].getElementsByTagName("input");
	var get_menu = getCookie('my_menu');
	var checkNum = new Array();
	var set_menu = new Array();
	//
	if(get_menu) {
		get_menu = eval(get_menu);
	}else{
		get_menu = new Array();
	}
	//
	for(var i = 0; i < input.length; i++){
		if(input[i].checked){
			checkNum[i] = true;
		}else{
			checkNum[i] = false;
		}
	}
	//
	checkNum.reverse();
	for(var i = 0; i < get_menu.length; i++){
		if(!checkNum[i]){
			set_menu.push(get_menu[i]);
		}
	}
	checkNum.reverse();
	//
	listCreate(set_menu,ret)
	kanriListCreate(set_menu,ret2);
	//
	var saveArray = new Array();
	var tmp;
	for(var i = 0 ; i<set_menu.length; i++) {
		tmp = "['" + set_menu[i][0] + "','" + set_menu[i][1]+"']";
		saveArray.push(tmp);
	}
	//
	var saveText;
	saveText = "[" + saveArray.join(",") + "]";
	//
	setCookie('my_menu',saveText);
	//
}
//
function kanriListCreate(dat,ret2){

	var li ;
	var liAry = new Array();
	ret2.innerHTML = '<p>' + myMenuDefaultTxt + '</p>';
	if(dat == '' || dat == undefined) return;

	for(var i = 0; i < dat.length; i++){
		var title = unescape(dat[i][0]);
		var url  = dat[i][1];
		liAry.unshift('<li><input type="checkbox" name="del" value="'+ url +'" id="del'+ i +'" /><a href="'+ url +'">' + title+'</a></li>');
	}

	li = liAry.join([""]) ;

	if(li != ""){
		ret2.innerHTML = '<ul id="tmp_mylist">' + li + '</ul>';
	}
	ret2.innerHTML += '<p><a href="javascript:all_ui(true);">全選択</a> | <a href="javascript:all_ui(false);">全解除</a></p>';
	ret2.innerHTML += '<p><input type="button" value="削除" onclick="delMenu();" /></p>';	
}
//
function listCreate(dat,ret){
	var li = "";
	var liAry = new Array();
	for(var i = 0; i < dat.length; i++) {
		var title = unescape(dat[i][0]);
		var url  = dat[i][1];
		liAry.unshift('<li><a href="' + url + '">' + title + '</a></li>');
	}
	if(dat.length > myMenuNaviMaxValue){
		liAry.splice(myMenuNaviMaxValue,(dat.length - myMenuNaviMaxValue))
	}	
	li = liAry.join([""]) ;
	if(li == ""){
		ret.innerHTML = '<p>' + myMenuDefaultTxt + '</p>';
	}else{
		ret.innerHTML = '<ul>' + li + '</ul>';
	}
	ret.innerHTML += myMenuEntryBtn + myMenuAllBtn;
}
//
function all_ui(flg){
	var ret2 = document.getElementById('tmp_linkbox_mymenu_kanri_list');
	var input = ret2.getElementsByTagName("input");
	for(var i = 0; i < input.length; i++){
		input[i].checked = flg;
	}
}

/*////// event ////////////////////////////////////////////////////////////////////////////*/
// onload
window.onload = function() {

	myMenu();
}