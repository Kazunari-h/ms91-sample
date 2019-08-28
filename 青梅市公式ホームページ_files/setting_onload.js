(function($){

	$(function(){
		
		var bodyObj = $('body');
		var wrapperObj = $('#tmp_wrapper');
		var ie6Flg = $.browser.msie && $.browser.version < 7;

		//ギャラリー
		if($.gallery){
			
			var galleryObj = $('#tmp_gallery');
			var sectionObj = $('#tmp_gallery li');
			
			galleryObj.gallery({
				sectionObj: sectionObj,
				sendNavi: false,
				prevNaviSource: '<p class="prev"><a href="javascript:void(0);"><img src="/shared/images/main/gallery/prev_btn.gif" alt="前へ" width="9" height="13" /></a></p>',	//sendNaviのprevのソース
				nextNaviSource: '<p class="next"><a href="javascript:void(0);"><img src="/shared/images/main/gallery/next_btn.gif" alt="次へ" width="9" height="13" /></a></p>',	//sendNaviのnextのソース
				orderNavi: true,
				timerId: 'gallery',
				orderNaviType: 'image',
				orderNaviImagePath: '/shared/images/main/gallery/onavi_',
				orderNaviImageWidth: 65,
				orderNaviImageHeight: 16,
				timerInterval: 4000
			});
			
			galleryObj.css({
				visibility: 'visible'
			});

			//再生、停止処理
			var listOrderObj = $('#tmp_gallery .list_order');
			var playerObj = $('<div id="tmp_gallery_player"></div>');
			var stopBtnObj = $('<p class="stop_btn"><a href="javascript:void(0);"><img src="/shared/images/main/gallery/stop_btn.gif" alt="画像切り替え動作の停止" width="65" height="16" /></a></p>');
			var playBtnObj = $('<p class="play_btn"><a href="javascript:void(0);"><img src="/shared/images/main/gallery/play_btn.gif" alt="画像切り替え動作の再生" width="65" height="16" /></a></p>');
			var stopFlag = false;
			galleryObj.after(playerObj);
			var stopBtnAObj = stopBtnObj.find('a');
			var playBtnAObj = playBtnObj.find('a');
			
			stopBtnObj.appendTo(playerObj);

			stopBtnAObj.on('click', function(){
				$(document).stopTime('gallery');
				stopBtnObj.detach();
				playBtnObj.appendTo(playerObj);
				stopFlag = true;
			});
			playBtnAObj.on('click', function(){
				listOrderObj.find('.active a').trigger('click');
				playBtnObj.detach();
				stopBtnObj.appendTo(playerObj);
			});	
			
			listOrderObj.on('click', function(){
				if(stopFlag){
					playBtnObj.detach();
					stopBtnObj.appendTo(playerObj);
				};
			});
		}
	
		
				//ギャラリースライダー
		if($.gallerySlider){
			
			var gallery2Obj = $('#tmp_galleryslider');
			var section2Obj = $('#tmp_galleryslider li');
			
			gallery2Obj.gallerySlider({
				sectionObj: section2Obj,
				sendNavi: true,
				prevNaviSource: '<p class="prev"><a href="javascript:void(0);"><img src="/shared/images/main/galleryslider/prev_btn.gif" alt="前へ" width="8" height="10" /></a></p>',	//sendNaviのprevのソース
				nextNaviSource: '<p class="next"><a href="javascript:void(0);"><img src="/shared/images/main/galleryslider/next_btn.gif" alt="次へ" width="8" height="10" /></a></p>',	//sendNaviのnextのソース
				orderNavi: false,
				timerId: 'gallery2',
				orderNaviType: 'image',
				orderNaviImagePath: '/shared/images/main/galleryslider/onavi_',
				orderNaviImageWidth: 40,
				orderNaviImageHeight: 10,
				timerInterval: 4000
			});
			
			gallery2Obj.css({
				visibility: 'visible'
			});

			//再生、停止処理
			var listOrder2Obj = $('#tmp_galleryslider .list_order');
			var player2Obj = $('<div id="tmp_galleryslider_player"></div>');
			var stopBtn2Obj = $('<p class="stop_btn"><a href="javascript:void(0);"><img src="/shared/images/main/galleryslider/stop_btn.gif" alt="画像切り替え動作の停止" width="65" height="16" /></a></p>');
			var playBtn2Obj = $('<p class="play_btn"><a href="javascript:void(0);"><img src="/shared/images/main/galleryslider/play_btn.gif" alt="画像切り替え動作の再生" width="65" height="16" /></a></p>');
			var stop2Flag = false;
			gallery2Obj.after(player2Obj);
			var stopBtnA2Obj = stopBtn2Obj.find('a');
			var playBtnA2Obj = playBtn2Obj.find('a');
			
			stopBtn2Obj.appendTo(player2Obj);

			stopBtnA2Obj.on('click', function(){
				$(document).stopTime('gallery2');
				stopBtn2Obj.detach();
				playBtn2Obj.appendTo(player2Obj);
				stopFlag = true;
			});
			playBtnA2Obj.on('click', function(){
				listOrder2Obj.find('.active a').trigger('click');
				playBtn2Obj.detach();
				stopBtn2Obj.appendTo(player2Obj);
			});	
			
			listOrder2Obj.on('click', function(){
				if(stop2Flag){
					playBtn2Obj.detach();
					stopBtn2Obj.appendTo(player2Obj);
				};
			});
		}
				
	});

})(jQuery);