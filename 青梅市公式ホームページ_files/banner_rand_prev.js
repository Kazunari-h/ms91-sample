/*
 * 広告バナーをランダム表示する
 */

var KoukokuPublish = function(){
	//ルートからのパス
	this.path   = '/banner';
	this.ADVERT_TEXT_BANNER_CLASS_TITLE = 'bnr_title';
	this.ADVERT_TEXT_BANNER_CLASS_DETAIL = 'bnr_detail';
	//CSVデータ
	this.AreaData = new Array();
	this.CsvData = new Array();
}

KoukokuPublish.prototype = {
	/**
	 * CSVデータをロードする
	 * CSVデータをAjaxを使いロードする
	 * @param banner_area_id バナー表示エリアのID
	 * @param area_id 広告エリアのID
	 */
	LoadData : function(banner_area_id,area_id){
		var class_id = this;
		var xmlhttp = createXMLHttpRequest();
		if(xmlhttp){
			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState == 4){
					if(xmlhttp.status == 200) class_id.getData(banner_area_id,xmlhttp.responseText);
				}
			}
		}
		else alert("ajax error");
		//リクエスト処理
		xmlhttp.open('GET',this.path + '/' + area_id + '/banner_data_' + area_id + '.csv',true);
		xmlhttp.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
		xmlhttp.send(null);
	},
	/**
	 * 広告表示切り替え用処理
	 * 広告の表示をランダムに切り替える
	 * @param banner_area_id バナー表示エリアのID
	 * @param txt CSVの内容
	 */
	getData : function(banner_area_id,txt){
		//引数のチェック
		if(!txt) return;

		//変数の初期化
		this.AreaData = new Array();
		this.CsvData = new Array();
		var tmp_area_data = new Array();
		var prev_number = new Array();

		//改行コードの統一
		txt = txt.replace(/\r\n/g,"\n");
		txt = txt.replace(/\r/g,"\n");
		//行データ数分分割
		var csv_dataArray = txt.split("\n");
		//エリア情報の取得
		for(var i = 0;i < 2;i++){
			tmp_area_data.push(csv_dataArray[0]);
			csv_dataArray.shift();
		}
		//エリア情報を配列で取得
		this.AreaData = getCsvData(tmp_area_data.join("\n"));
		this.AreaData = this.AreaData[0];
		//バナー情報を配列で取得
		this.CsvData = getCsvData(csv_dataArray.join("\n"));

		//表示順がランダムの場合
		if(this.AreaData['order_from'] == 0){
			//広告の件数を取得
			for(var i = 0,rand_num = 0;i < this.CsvData.length;i++){
				if(this.CsvData[i]['banner_type'] != 0) rand_num++;
			}
			//ランダムIDを取得
			do{
				if(rand_num == 0) break;
				//乱数の生成
				randam = getRand(("" + rand_num).length,0,(rand_num - 1));
				//重複データチェック
				for(var i = 0;i < prev_number.length;i++){
					if(randam == prev_number[i]) break;
				}
				//重複データが無い場合
				if(i == prev_number.length) prev_number.push(randam);
				//広告表示可能数が広告数を超えている場合
				if(prev_number.length >= this.CsvData.length) break;
			} while(prev_number.length < rand_num);
			//広告募集中バナーを追加
			if(this.AreaData['recruitment_from'] != 2){
				while(prev_number.length < this.CsvData.length){
					prev_number.push(rand_num++);
					if(this.AreaData['recruitment_from'] == 1) break;
				}
			}
		}
		//表示順が固定の場合
		else{
			for(var i = 0;i < this.CsvData.length;i++){
				prev_number.push(i);
			}
		}

		//表示の作成
		var obj=new Array();
		var img = new Array();
		var banner_id = new Array();
		var advert_area = document.getElementById('advert_area_' + banner_area_id);
		var tag_ul = "";
		//エリアの中を削除
		if(advert_area.firstChild) advert_area.removeChild(advert_area.firstChild);
		//エリアの中を作成
		for(var i = 0;i < this.AreaData['layout_line'] * this.AreaData['layout_row'];i++){
			//タグの作成
			if(i % this.AreaData['layout_row'] == 0) tag_ul = document.createElement('UL');
			//表示件数以下の場合のみ、タグを作成する
			if(i < prev_number.length){
				//バナーIDの取得
				var b_id = 'banner_' + banner_area_id + '_' + i;
				banner_id.push(b_id);
				//タグを作成
				var tag_li = document.createElement('LI');
				var tag_a = document.createElement('A');
				//IDを指定
				tag_li.id = b_id + '_li';
				tag_a.id = b_id + '_a';
				//LIタグにサイズを指定
				tag_li.style.width = this.AreaData['banner_width'] + 'px';
				//作成したタグを設置する
				tag_li.appendChild(tag_a);
				tag_ul.appendChild(tag_li);
			}
			//行を区切る
			if(i % this.AreaData['layout_row'] == (this.AreaData['layout_row'] - 1)){
				if(tag_ul.firstChild) advert_area.appendChild(tag_ul);
				tag_ul = "";
			}
		}

		//作成したタグにデータを埋め込む
		for(var i = 0;i < banner_id.length;i++){
			//データが存在するかチェック
			if(prev_number[i] === undefined || !this.CsvData[prev_number[i]]) break;

			//タグにデータをセット
			document.getElementById(banner_id[i] + '_a').href = this.CsvData[prev_number[i]]['a_href'];
			//画像バナーの場合
			if(this.CsvData[prev_number[i]]['banner_type'] == 0 || this.CsvData[prev_number[i]]['banner_type'] == 1){
				var tag_img = document.createElement('IMG');
				tag_img.id = banner_id[i] + '_img';
				tag_img.src = this.CsvData[prev_number[i]]['img_src'];
				tag_img.alt = this.CsvData[prev_number[i]]['img_alt'];
				tag_img.width = this.AreaData['banner_width'];
				tag_img.height = this.AreaData['banner_height'];
				document.getElementById(banner_id[i] + '_a').appendChild(tag_img);
				//画像のロード
				obj[i] = new Image;
				obj[i].id = 'tmp_' + tag_img.id;
				obj[i].src = this.CsvData[prev_number[i]]['img_src'];
				//画像のロードが完了したら、再度書き換えを行う
				obj[i].onload = obj[i].onerror = function(){
					document.getElementById(this.id.substr(4,this.id.length)).src = this.src;
				}
			}
			//テキストバナーの場合
			else{
				var tag_p = document.createElement('p');
				tag_p.id = banner_id[i] + '_p';
				tag_p.innerHTML = this.CsvData[prev_number[i]]['txt_details'];
				tag_p.className = this.ADVERT_TEXT_BANNER_CLASS_DETAIL;
				document.getElementById(banner_id[i] + '_a').innerHTML = this.CsvData[prev_number[i]]['txt_title'];
				document.getElementById(banner_id[i] + '_a').className = this.ADVERT_TEXT_BANNER_CLASS;
				document.getElementById(banner_id[i] + '_li').appendChild(tag_p);
			}
		}
	}
}
