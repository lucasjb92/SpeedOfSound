$(document).ready(function() { 
    $('#playerScores').ajaxForm(function(data) { 
        $('#playerScore').html(data);
	});
	
	$('#submitScore').ajaxForm(function(data) { 
		if(data != "error"){
			alert(data);
        	$.ajax({
   				url: 'highscore.php',
   				success: function(data) {
     				$('#highScores').html(data);
     				$('#submitScore input[type="submit"]').prop('disabled',true);
   				}
			});
		}
		else{
			alert("Invalid score.");
		}
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