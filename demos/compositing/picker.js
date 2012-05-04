var bgs = [
'assets/texture-1.png',
'assets/texture-2.png',
'assets/texture-3.png',
'assets/texture-4.png'
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