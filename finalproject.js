$(document).ready(function() { 
    $('#playerScores').ajaxForm(function(data) { 
        $('#playerScore').html(data);
	});
	
	$('#submitScore').ajaxForm(function(data) { 
        alert(data);
        $.ajax({
   			url: 'highscore.php',
   			success: function(data) {
     			$('#highScores').html(data);
   			}
		});
	});
	
	$('#uploadSong').ajaxForm(function(data) { 
        alert(data);
        $.ajax({
   			url: 'getSongs.php',
   			success: function(data) {
     			$('#songs').html(data);
   			}
		});
	});
	
	$.ajax({
   		url: 'getSongs.php',
   		success: function(data) {
     		$('#songs').html(data);
   		}
	});
	
	$.ajax({
   		url: 'highscore.php',
   		success: function(data) {
     		$('#highScores').html(data);
   		}
	});
});