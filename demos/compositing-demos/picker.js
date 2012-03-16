// JavaScript Document
$(document).ready(function(){
	$('.picker').change(function(){
		$('.blendelement').css('-webkit-blend-mode', this.value);
	});
});