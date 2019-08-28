/* ==================================================

 * jQuery.gallery-slider.js
 *
 * Author:H.Gunji
 * Version: 1.1.2
 * Last Modified: 2012/10/22
 * Library&Plugin: jQuery 1.4.2-1.7.1 jquery.attrrep.js, jquery.easing.1.3.js jquery.timers-1.1.2.js
 *
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 
================================================== */
;(function($){

//jQueryの名前空間の定義
var ns = 'gallerySlider';

//pluginメンバ
$[ns] = {
	
	//デフォルト値の設定
	defaults: {
		sectionObj: null,																//ギャラリーで表示するjQueryObject
		boxClass: 'box_gallrey',														//sectionObjを格納するdiv（sectionBox）のclass名
		parentBoxClass: 'box_parent_gallrey',											//sectionBoxを格納する親divのclass名
		parentWrapBoxClass: 'box_wrap_parent_gallrey',									//parentBoxClassを格納する親divのclass名
		activeClass: 'active',															//activeになった時にsectionObj、orderNaviのlistに追加されるclass名
		auto: true,																		//自動再生するflg
		loopStop: false,																//ループを停止する回数及びflg false or 停止するループ数
		loopStopPoint: 'first',															//ループを停止する場所 'first' or 'last'
		timerId: ns,																	//自動再生時のtimerのID
		timerInterval: 5000,															//自動再生時の間隔
		duration: 600,																	//fadeのduration
		easing: 'easeInQuad',															//fadeのeasing
		sendNavi: true,																	//sendNaviを使用するflg
		prevNaviSource: '<p class="prev"><a href="javascript:void(0);">前へ</a></p>',	//sendNaviのprevのソース
		nextNaviSource: '<p class="next"><a href="javascript:void(0);">次へ</a></p>',	//sendNaviのnextのソース
		orderNavi: true,																//orderNaviを使用するflg
		orderNaviType: 'number',														//'number' or 'image' or [jQueryObject]
		orderNaviImagePath: 'images/onavi_',											//orderNaviのimageのパス
		orderNaviImageExtension: 'gif',													//orderNaviのimageの拡張子
		orderNaviImageWidth: null,														//orderNaviのimageの画像の幅
		orderNaviImageHeight: null,														//orderNaviのimageの画像の高さ
		orderNaviImageAltSuffixTxt: 'つめのスライドを表示',								//orderNaviのimageのaltの接尾につくテキスト
		orderNaviImageOnSuffix:'_on.',													//orderNaviのimageのオン画像の接尾詞
		orderNaviImageOffSuffix:'_off.',												//orderNaviのimageのオフ画像の接尾詞
		orderClass: 'list_order',														//orderNaviのclass名
		random: false,																	//random表示するflg
		chooseNum: 0,																	//sectionObjから表示する実個数
		sliderDistance: 0,																//スライドするpx数（指定しない場合selfの幅）
		sliderParentWidth: 0,															//parentWrapBoxClassの幅
		cloneClass: 'clone',															//cloneした要素に付与するclass名
		cloneNum: 1																		//前後複製されるsectionObj数
	},

	/* 配列をシャッフル
	/* ===================================================
	@return >>
		Array
		
	@argument >>
		array[Array]	 >>	シャッフルする配列
		num[Number]		 >>	取り出す配列の要素数 ※省略可
	=================================================== */
	arrayShuffle: function(array, num){
		var i = array.length;
		var newArray = array.slice(0, i);
		var chooseNum = num || i;
		
		while(--i) {
			var j = Math.floor(Math.random() * (i + 1));
			if(i == j) continue;
			var k = newArray[i];
			newArray[i] = newArray[j];
			newArray[j] = k;
		}
		
		return newArray.slice(0, chooseNum);
	},

	/* jQueryObjectをシャッフル
	/* ===================================================
	@return >>
		jQueryObject
		
	@argument >>
		jObj[jQueryObject]	>>	シャッフルするjQueryObject
		num[Number]			>>	取り出す配列の要素数 ※省略可
	=================================================== */
	jObjShuffle: function(jObj, num){
		var array = jObj.get();
		var newObj = {};
		array = $[ns].arrayShuffle(array, num);
		newObj = $(array);
		
		return newObj;
	},

	/* index番号がnextNumのsecitonBoxをactiveにする
	/* ===================================================
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
	=================================================== */
	moveBox: function(self, config, nextNum, event){	//1.1.0
		
		//ループカウンターが達したらreturn	//1.1.0
		if(config.loopStop){
			var loopStopFlg = self.data('loopStopFlg');
			
			if(event == 'click'){
				loopStopFlg = true;
				self.data('loopStopFlg', loopStopFlg);
			}else if(loopStopFlg){
				return false;				
			}
		}
		
		var parentBox = self.data('parentBox');	//1.1.0
		var secitonBox = self.data('secitonBox');	//1.1.0
		var slideWidth = self.data('slideWidth');	//1.1.0
		var activeIndexValue =  $[ns].getActiveIndexValue(self, config);	//1.1.0
		var activeBox = secitonBox.eq(activeIndexValue);
		var lastTofirst = ((secitonBox.length - 1) == activeIndexValue) && (nextNum == 0);
		var firstToLast = ((secitonBox.length - 1) == nextNum) && (activeIndexValue == 0);
		
		//最後のsecitonBoxから最初のsecitonBoxにmoveする場合、最後の要素をcloneしたsecitonBoxに移動
		//if(lastTofirst) parentBox.css({marginLeft: slideWidth + 'px'});
		if(lastTofirst) parentBox.css({marginLeft: slideWidth + 'px'});
		//最初のsecitonBoxから最後のsecitonBoxにmoveする場合、最初の要素をcloneしたsecitonBoxに移動
		if(firstToLast) parentBox.css({marginLeft: -((nextNum + 1) * slideWidth) + 'px'});
		
		//現在アクティブになっている番号以外の場合
		if(activeIndexValue != nextNum){
			var nextBox = secitonBox.eq(nextNum);
			var moveMarginValue = -(nextNum * slideWidth) + 'px';

			//activeだったボックスからactiveClassを削除
			activeBox
				.removeClass(config.activeClass);

			//次にactiveになるボックスにactiveClassを追加
			nextBox
				.addClass(config.activeClass);

			//animation
			parentBox
				/*
				ノンアクティブでノンアクティブタブに隠れた時にたまったキューが一度にはかれる
				バグ？を回避するため
				*/
				.stop(true, false)
				.animate({
						marginLeft: moveMarginValue
					},
					config.duration,
					config.easing
				);
			
			//orderNaviがtrueの場合	//1.1.0
			if(config.orderNavi){
				var orderList = null;
				var allList = null;
				var activeList = null;
				var nextList = null;

				orderList = self.find('.' + config.orderClass);
				if(config.orderNaviType.jquery){
					allList = self.data('orderNavi');
				}else{
					allList = orderList.find('li');
				}
				activeList = allList.filter(function(){
					return $(this).hasClass(config.activeClass);
				});
				nextList = allList.eq(nextNum);				
				allList.removeClass(config.activeClass);
				nextList.addClass(config.activeClass);
				
				//orderNaviTypeが'image'かjQueryオブジェクトの場合
				if(config.orderNaviType == 'image' || config.orderNaviType.jquery){
					var activeImg = activeList.find('img');
					var nextImg = nextList.find('img');
					
					activeImg.attrRep({
						ret: config.orderNaviImageOnSuffix,
						rep: config.orderNaviImageOffSuffix
					});
					nextImg.attrRep({
						ret: config.orderNaviImageOffSuffix,
						rep: config.orderNaviImageOnSuffix
					});
				}
			}
		}

		//ループストップフラグセット	//1.1.0
		if(config.loopStop){
			var loopCounter = self.data('loopCounter');	
			var loopStopNum = self.data('secitonBox').length * config.loopStop;

			loopCounter ++;
			self.data('loopCounter', loopCounter);
			
			if(config.loopStopPoint == 'first' && loopCounter == loopStopNum){
				loopStopFlg = true;
			}else if(config.loopStopPoint == 'last' && (loopCounter + 1) == loopStopNum){
				loopStopFlg = true;
			}
			
			self.data('loopStopFlg', loopStopFlg);
		}
		
		//タイマーを再起動
		if(config.auto){
			$(document).stopTime(config.timerId);
			$(document).everyTime(config.timerInterval, config.timerId, function(index){
				$[ns].moveNext(self, config);	//1.1.0
			});
		}

	},
	
	/* prev時のmove
	/* ===================================================
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
		event[String]		>>	何のイベントでmoveさせるかフラグ [click] ※省略可
	=================================================== */
	movePrev: function(self, config, event){	//1.1.0
		var prevIndex = $[ns].getPrevIndexValue(self, config);	//1.1.0
		
		$[ns].moveBox(self, config, prevIndex, event);	//1.1.0
	},

	/* next時のmove
	/* ===================================================
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
		event[String]		>>	何のイベントでmoveさせるかフラグ [click] ※省略可
	=================================================== */
	moveNext: function(self, config, event){	//1.1.0
		var nextIndex = $[ns].getNextIndexValue(self, config);	//1.1.0
		
		$[ns].moveBox(self, config, nextIndex, event);	//1.1.0
	},

	/* secitonBoxの中からactiveClassを持っているindex番号を返す
	/* ===================================================
	@return >>
		Number
		
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
	=================================================== */
	getActiveIndexValue: function(self, config){	//1.1.0
		var num = 0;
		var secitonBox = self.data('secitonBox');	//1.1.0
		
		secitonBox.each(function(index){
			if($(this).hasClass(config.activeClass)){
				num = index;
				
				return false;
			}
		});
		
		return num;
	},

	/* 前のsecitonBoxのindex番号を返す
	   （一番最初のobjの場合、一番最後のindex番号を返す）
	/* ===================================================
	@return >>
		Number
		
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
	=================================================== */
	getPrevIndexValue: function(self, config){	//1.1.0
		var num = 0;
		var secitonBox = self.data('secitonBox');	//1.1.0
		var minIndexValue = 0;
		var maxIndexValue = secitonBox.length - 1;
		var activeIndexValue = $[ns].getActiveIndexValue(self, config);	//1.1.0
		
		if(activeIndexValue == minIndexValue){
			num = maxIndexValue;
		}else{
			num = activeIndexValue - 1;
		}
		
		return num;
	},

	/* 次のsecitonBoxのindex番号を返す
	  （一番最後のobjの場合、一番最初のindex番号を返す）
	/* ===================================================
	@return >>
		Number
		
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
	=================================================== */
	getNextIndexValue: function(self, config){	//1.1.0
		var num = 0;
		var secitonBox = self.data('secitonBox');	//1.1.0
		var maxIndexValue = secitonBox.length - 1;
		var activeIndexValue = $[ns].getActiveIndexValue(self, config);	//1.1.0
		
		if(activeIndexValue == maxIndexValue){
			num = 0;
		}else{
			num = activeIndexValue + 1;
		}
		
		return num;
	},

	/* secitonBoxの最大の高さを返す
	/* ===================================================
	@return >>
		Number
		
	@argument >>
		self[jQueryObject]	>>	元のjQueryObject
		config[Object]		>>	jQueryOptionオブジェクト
	=================================================== */
	getSectionObjMaxHeight: function(self, config){	//1.1.0
		var sectionObjMaxHeight = 0;
		var secitonBox = self.data('secitonBox');	//1.1.0
		
		//高さ指定をリセット
		secitonBox
			.height('auto')
			.each(function(){
				var self = $(this);
				var thisHeight = self.height();
				
				//secitonBoxの最大の高さを算出
				if(thisHeight > sectionObjMaxHeight){
					sectionObjMaxHeight = thisHeight;	
				}						   
			});
		
		return sectionObjMaxHeight;
	}

};

//jQuery拡張
$.fn[ns] = function(options){

	//カスタムパラメータをオーバーライド
	var config =  $.extend({}, $[ns].defaults, options);

	//自身をelementsに格納
	var elements = this;

	//jQueryオブジェクトを返しつつ実行
	return this.each(function(num){
		
		var self = $(this);	//自身をselfに格納
		var slideWidth = null;	//1.1.1
		var parentWrapBox = null;	//1.1.1
		var parentBox = null;	//1.1.0
		var secitonBox = null;	//1.1.0
		var secitonBoxLength = 0;
		var sectionObj = null;	//1.1.0
		var firstSectionObj = null;	//1.1.0
		var sectionObjMaxHeight = 0;	//1.1.1
		var cloneNum = config.cloneNum;	//1.1.0
		var sliderParentWidth = null;	//1.1.1
		
		self.css({position: 'relative'});
		parentWrapBox = $('<div>')	//1.1.1
			.css({
				position: 'relative',
				overflow: 'hidden'
			})
			.addClass(config.parentWrapBoxClass);
		parentBox = $('<div>')
			.css({position: 'relative'})
			.addClass(config.parentBoxClass);
		//selfのdataに紐付
		self.data({parentBox: parentBox});	//1.1.0
		//sectionObj初期化
		sectionObj = config.sectionObj.clone(true) || self.children().clone(true);	//1.1.2

		//親ボックスをselfに置換
		self.empty().append(parentWrapBox);	//1.1.1
		parentWrapBox.append(parentBox);	//1.1.1
		//スライドする幅を指定	//1.1.1
		slideWidth = config.sliderDistance || parentWrapBox.width();
		//親ボックスの幅を指定	//1.1.1
		sliderParentWidth = config.sliderParentWidth || parentWrapBox.width();
		parentWrapBox.width(sliderParentWidth);
		
		//selfのdataに紐付
		self.data({slideWidth: slideWidth});	//1.1.0
		
		//sectionObjをシャッフル
		if(config.random){
			var chooseNum = config.chooseNum ? config.chooseNum: sectionObj.length;
			var sectionObj = $[ns].jObjShuffle(sectionObj, chooseNum);
		}
		
		//子ボックスset
		sectionObj
			.each(function(){
				var sectionData = $(this).children();
				var section = $('<div>')
					.addClass(config.boxClass)
					.width(slideWidth)
					.css({
						float: 'left'
					})
					.append(sectionData)	//1.1.0
					.appendTo(parentBox);
				
			});
		
		//secitonBox初期化
		secitonBox = parentBox.find('.' + config.boxClass);
		
		//selfのdataに紐付
		self.data({secitonBox: secitonBox});	//1.1.0
		secitonBoxLength = secitonBox.length;
		
		//sectionObjの数が1以下だった場合、return	//1.1.1
		if(!sectionObj.length || sectionObj.length == 1) return false;
				
		//1.1.0
		for(var i = 0; i < cloneNum; i++){
			var cloneLastObj = null;
			var cloneLastObjCss = null;
			var cloneFirstObj = null;
			var lastObjNum = secitonBoxLength - (i + 1);
			var firstObjNum = i;
			
			if(i == (cloneNum - 1)){
				cloneLastObjCss = 
					{
						marginLeft: -slideWidth * cloneNum + 'px',
						position: 'relative',
						zIndex: 1
					};
			}else{
				cloneLastObjCss = 
					{
						marginLeft: -slideWidth + 'px',
						position: 'relative'
					};
			}
			
			//最後から数えた要素を複製したボックス
			cloneLastObj = secitonBox
				.eq(lastObjNum)
				.clone()
				.addClass(config.cloneClass)
				.css(cloneLastObjCss)
				.prependTo(parentBox);
			
			//最初から数えた要素を複製したボックス
			cloneFirstObj = secitonBox
				.eq(firstObjNum)
				.clone()
				.addClass(config.cloneClass)
				.appendTo(parentBox);
		}
		
		//最初のsecitonBoxにactiveクラスを付与	//1.1.1
		firstSectionObj = secitonBox.eq(0);
		firstSectionObj.addClass(config.activeClass);
		
		//親の幅指定
		parentBox.width(slideWidth * (secitonBoxLength + cloneNum * 2));		

		//親とsecitonBoxの高さを子の最大の値にそろえる	//1.1.1
		sectionObjMaxHeight = $[ns].getSectionObjMaxHeight(self, config);
		secitonBox.height(sectionObjMaxHeight);
		parentBox.height(sectionObjMaxHeight);
		
		//「次へ」「前へ」Utility付与
		if(config.sendNavi){	//1.1.0
			var prev =$(config.prevNaviSource);
			var next =$(config.nextNaviSource);
			var prevA = prev.find('a');
			var nextA = next.find('a');

			prevA.bind('click.' + ns, function(){
				$[ns].movePrev(self, config, 'click');
			});
			
			nextA.bind('click.' + ns, function(){
				$[ns].moveNext(self, config, 'click');
			});

			prev.appendTo(self);
			next.appendTo(self);
		}
		
		//連番Utility付与
		if(config.orderNavi){
			if(!config.orderNaviType.jquery){	//1.1.0
				var ul = $('<ul>').addClass(config.orderClass).appendTo(self);
			}
			
			secitonBox
				.each(function(index){
					var fixedIndex = index + 1;
					var li = $('<li>').appendTo(ul);
					var a = $('<a href="javascript:void(0);"></a>')
						.bind('click.' + ns, function(){
							$[ns].moveBox(self, config, index, 'click');	//1.1.0
						})
						.appendTo(li);
					
					//orderNaviTypeがnumberのときのorderNaviのaのhtml
					if(config.orderNaviType == 'number'){
						a.append(fixedIndex);
					//orderNaviTypeがimageのときのorderNaviのaのhtml
					}else if(config.orderNaviType == 'image'){
						var offImgPath = config.orderNaviImagePath + fixedIndex + config.orderNaviImageOffSuffix + config.orderNaviImageExtension;
						var onImgPath = config.orderNaviImagePath + fixedIndex + config.orderNaviImageOnSuffix + config.orderNaviImageExtension;
						var imgAlt = fixedIndex + config.orderNaviImageAltSuffixTxt;
						var offImg = $('<img>').attr({src: offImgPath, alt: imgAlt});
						var onImg =	$('<img>').attr({src: onImgPath, alt: imgAlt});
						
						//画像の幅指定
						if(config.orderNaviImageWidth){
							offImg.attr({width: config.orderNaviImageWidth});
							onImg.attr({width: config.orderNaviImageWidth});
						}
						//画像の高さ指定
						if(config.orderNaviImageHeight){
							offImg.attr({height: config.orderNaviImageHeight});
							onImg.attr({height: config.orderNaviImageHeight});
						}
						
						//最初の要素をonImgに
						if(index == 0){
							a.append(onImg);
						}else{
							a.append(offImg);
						}
					//orderNaviTypeがjQueryオブジェクトのときのorderNaviのaのhtml	//1.1.0
					}else if(config.orderNaviType.jquery){
						var orderNavi = config.orderNaviType;
						var thisOrderNavi = orderNavi.eq(index);
						var thisOrderNaviOffImg = thisOrderNavi.find('img[src*="' + config.orderNaviImageOffSuffix + '"]');	//1.1.2
						var thisOrderNaviOnImgSrc = thisOrderNaviOffImg.attr('src').replace(config.orderNaviImageOffSuffix, config.orderNaviImageOnSuffix);	//1.1.2
						var preloadImg = $('<img>').attr({src: thisOrderNaviOnImgSrc});	//1.1.2
						
						//最初の要素をonImgに
						if(index == 0){
							var offImg = orderNavi.eq(0).find('img[src*="' + config.orderNaviImageOffSuffix + '"]')
								.attrRep({
									ret: config.orderNaviImageOffSuffix,
									rep: config.orderNaviImageOnSuffix
							});
						}

						//最初の要素にactiveClassを付与
						if(index == 0){
							thisOrderNavi.addClass(config.activeClass);
						}

						thisOrderNavi
							.find('a')
							.bind('click.' + ns, function(){
								$[ns].moveBox(self, config, index, 'click');
							});
						
						//selfのdataに紐付
						self.data('orderNavi', orderNavi);
						
					}
					
					//最初の要素にactiveClassを付与
					if(index == 0){
						li.addClass(config.activeClass);
					}
				});
		}
		
		//ループカウンターセット	//1.1.0
		if(config.loopStop){
			var loopStopFlg = false;
			var loopCounter	= 0;
			
			//selfのdataに紐付
			self.data('loopStopFlg', false);
			self.data('loopCounter', loopCounter);
		}
		
		//自動再生
		if(config.auto){
			$(document).everyTime(config.timerInterval, config.timerId, function(index){
				$[ns].moveNext(self, config);	//1.1.0
			});
		}
		
	});
	
};

})(jQuery);