var bgs = [
'http://adobe.github.com/web-platform-assets/texture-1.png',
'http://adobe.github.com/web-platform-assets/texture-2.png',
'http://adobe.github.com/web-platform-assets/texture-3.png',
'http://adobe.github.com/web-platform-assets/texture-4.png',
'http://adobe.github.com/web-platform-assets/texture-5.jpg',
'http://adobe.github.com/web-platform-assets/texture-6.jpg',
'http://adobe.github.com/web-platform-assets/texture-7.jpg',
'http://adobe.github.com/web-platform-assets/texture-8.jpg',
'http://adobe.github.com/web-platform-assets/texture-9.jpg',
'http://adobe.github.com/web-platform-assets/texture-10.jpg',
'http://adobe.github.com/web-platform-assets/texture-11.jpg'
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
		$('.blend-thumb').attr('src', bgs[current % bgs.length]);
		$(body).offsetWidth(); //hack to force reflow
	});

});