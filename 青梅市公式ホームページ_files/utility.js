//** Utility Func ********************************************************************************//
//* getElementById
function $(obj_id) {
	var element = document.getElementById(obj_id);
	return (element!=false)? element:false;
}

//* オブジェクトの拡張
function extendObj(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

/**
 * Ajax用オブジェクトの作成
 * Ajax用にHTTP通信を行うためのオブジェクトを作成する
 * @return XMLhttpObjectオブジェクト
 */
function createXMLHttpRequest(){
	var XMLhttpObject = null;
	try{ XMLhttpObject = new XMLHttpRequest(); }
	catch(e){
		try{ XMLhttpObject = new ActiveXObject("Msxml2.XMLHTTP"); }
		catch(e){
			try{ XMLhttpObject = new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e){ return null; }
		}
	}
	return XMLhttpObject;
}

/**
 * CSV文字列を配列に変更
 * @param csv_txt CSV文字列
 * @return CSVを配列化したデータ
 */
function getCsvData(csv_txt){
	//データのチェック
	if(csv_txt.search(/\n$/i) == -1) csv_txt += "\n";
	//文中にある改行を変換
	var tmp_1 = "";
	var tmp_2 = "";
	//改行がある場合はループ
	while(csv_txt.search(/\n/i) != -1){
		tmp_1 = "";
		//取得文字列のダブルクォーテーションの数が偶数になるまでループ
		while(csv_txt != "" && (tmp_1 == "" || (tmp_1.split('"').length - 1) % 2 != 0)){
			//先頭から改行までを取得
			var tmp = csv_txt.substr(0, csv_txt.search(/\n/i) + 1);
			csv_txt = csv_txt.slice(tmp.length);
			tmp_1 += tmp;
		}
		//全ての改行を変換する
		tmp_1 = tmp_1.replace(/\r?\n/ig,"@@javascript_csv_enter@@");
		//最後の改行のみ元に戻す
		tmp_1 = tmp_1.replace(/@@javascript_csv_enter@@$/ig,"\n");
		tmp_2 += tmp_1;
	}
	//csv_txtを更新
	csv_txt = tmp_2;
	//行データ数分分割
	var dataArray = csv_txt.split("\n");
	//行データ数分ループ
	var csv_data = new Array();
	var item = new Array();
	var data = new Array();
	var tmp_data = "";
	var tmp_data = new Object();
	for(i = 0;i < dataArray.length;i++){
		//行データが空で無い場合
		if(dataArray[i] != ""){
			data = new Array();
			while(dataArray[i] != ""){
				tmp_data = "";
				//行データに含まれる「,」で区切り、列データを抽出する
				while(dataArray[i] != "" && (tmp_data == "" || (tmp_data.split('"').length - 1) % 2 != 0)){
					var tmp = dataArray[i].substr(0, dataArray[i].search(/(,|\n|$)/i) + 1);
					dataArray[i] = dataArray[i].slice(tmp.length);
					tmp_data += tmp;
				}
				tmp_data = tmp_data.replace(/(,|\n)$/i,"");
				data[data.length] = tmp_data;
			}
			//一時データ
			tmp_data = new Object();
			//列データ分ループ
			for(j = 0;j < data.length;j++){
				//改行データのみの行を空白にする
				if(data[j].match(/^\s$/i)) data[j] = "";
				//列データが空白でない場合
				if(data[j] != ""){
					//「"」を取り除く
					data[j] = data[j].replace(/(^\"|\"\r?\n?$)/ig,"");
					//改行を元に戻す
					data[j] = data[j].replace(/@@javascript_csv_enter@@/ig,"\n");
					//項目名の取得
					if(i == 0) item[j] = data[j];
					//データの取得＆エスケープ解除「""」->「"」
					else tmp_data[item[j]] = data[j].replace(/\"\"/ig,"\"");
				}
			}
			//配列に入れる
			if(i != 0) csv_data[csv_data.length] = tmp_data;
		}
	}
	return csv_data;
}

/**
 * 乱数の生成
 * 乱数を生成する。numかmin・maxのどちらかは必須。
 * @param num 生成する乱数の桁数
 * @param min 生成する乱数の最小値
 * @param max 生成する乱数の最大値
 * @return 生成した乱数。生成に失敗した場合は、falseを返す。
 */
function getRand(num,min,max){
	var ret = 0;
	if(num == '' && (min == '' && min != 0 || max == '' && max != 0)) return false;
	if(num == '') num = 0;
	//桁数にあわせた乱数の取得
	for(var i = 0;i < num;i++){
		ret = ret * 10 + (Math.floor(Math.random() * 10));
	}
	//最小値・最大値の指定がある場合
	if((min != '' || min == 0) && (max != '' || max == 0)){
		//最大値を内包する桁数の取得
		var max_cnt = 1;
		var max_num = 0;
		while(max_cnt < max){
			max_cnt *= 10;
		}
		max_num = ("" + max_cnt).length;
		//最小値から最大値までの乱数の取得
		while(ret < min || ret > max){
			//retが0以下になった場合、乱数再取得
			if(ret == 0) ret = getRand(max_num,"","");
			ret = ret % (max + 1);
		}
	}
	return ret;
}

/**
 * HTMLエスケープ
 * 文字列中のHTML特殊文字をエスケープする。
 * @param ch エスケープする文字列
 * @return エスケープ処理後の文字列
 */
function htmlspecialchars(ch){
	ch = ch.replace(/&/g,"&amp;");
	ch = ch.replace(/"/g,"&quot;");
	ch = ch.replace(/'/g,"&#039;");
	ch = ch.replace(/</g,"&lt;");
	ch = ch.replace(/>/g,"&gt;");
	return ch;
}

//* デバック
function Debug(msg, area) {
	($(area))? $(area).innerHTML += msg+"<br>" : alert(msg);
}

var $A = Array.from = function(iterable) {
	if (!iterable) return [];
	if (iterable.toArray) {
		return iterable.toArray();
	}
	else {
		var results = [];
		for (var i = 0, length = iterable.length; i < length; i++)
			results.push(iterable[i]);
		return results;
	}
}

Function.prototype.bind = function() {
	var __method = this, args = $A(arguments), object = args.shift();
	return function() {
		return __method.apply(object, args.concat($A(arguments)));
	}
}

Function.prototype.bindAsEventListener = function(object) {
	var __method = this, args = $A(arguments), object = args.shift();
	return function(event) {
		return __method.apply(object, [event || window.event].concat(args));
	}
}