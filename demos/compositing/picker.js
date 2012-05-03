var bgs = [
'http://www.sxc.hu/pic/l/e/ex/exian/456692_89727447.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Water%2006.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Rock%2002.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Leaf%2028.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Wide%20-%20Grass%2001.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Leaf%2010.jpg', 
];



// JavaScript Document
$(document).ready(function(){
	var current = 0, currentblendmode = $('#blend-modes button.active');	
	$('#blend-modes button').click(function(){
		if(currentblendmode != null) {
			currentblendmode.removeClass('active');			
		}

		currentblendmode = $(this);
		currentblendmode.addClass('active');		
		
		$('.blendelement').css('-webkit-blend-mode', this.value);
		$('.blendelement').css('blend-mode', this.value);
	
	});
	$('#action-change-texture').click(function() {		
		current++;
		$('.blendelement').attr('src', bgs[current % bgs.length]);
	});

});