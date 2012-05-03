var bgs = [
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Water%2006.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Rock%2002.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Leaf%2028.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Wide%20-%20Grass%2001.jpg',
'http://www.mikeswanson.com/wallpaper/images/MSwanson%20-%20Leaf%2010.jpg',
'textures/grungetext-005.jpg', 
'textures/grungetext-006.jpg',
'textures/grungetext-007.jpg',
'textures/grungetext-008.jpg',
'textures/grungetext-009.jpg',
'textures/grungetext-010.jpg',
'textures/grungetext-011.jpg',
'textures/grungetext-012.jpg',
'textures/grungetext-014.jpg',
'textures/grungetext-015.jpg' 
];



// JavaScript Document
$(document).ready(function(){
	var current = 0, currentblendmode = null;
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
		$('.box').css('background-image', 'url(' + bgs[current % bgs.length] + ')');
	});

});