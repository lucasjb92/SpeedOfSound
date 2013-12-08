<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="finalproject.css" type="text/css" />
		<link href='http://fonts.googleapis.com/css?family=Prosto+One' rel='stylesheet' type='text/css' />
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<title>Speed of Sound</title>
	    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js"></script> 
    	<script src="http://malsup.github.com/jquery.form.js"></script>
    	<script src="finalproject.js"></script>
    	<script>
    		function SelectSong() {
    			var selectedSong = document.getElementById('songSelect').value;
    		}
    	</script>
	</head>
	<body>	
		<div id="top">
			<h1>Speed of Sound</h1>
			<img alt="gamePlaceholder" width="800" height="480" src="http://www.androidtapp.com/wp-content/uploads/2012/12/Audio-Glow-Music-Visualizer-Various-themes-and-customisations-5.png" />
		</div>
		<div id ="instructions">
			<h2>Instructions:</h2>
			<ol>
				<li>Pick a song</li>
				<li>Use arrow keys to move</li>
				<li>Make your way through the maze</li>
				<li>Score points based on how far you get</li>
				<li>Bonus points awarded for each maze completed</li>
				<li>Pick another song to play again</li>
			</ol>
		</div>
		<div id="playlistEditor">
			<h2>Upload Song:</h2>
			<form id="uploadSong" action="uploader.php" method="POST" enctype="multipart/form-data">
				Choose a file to upload (must be under 2MB):<br>
				<input name="uploadedfile" type="file" />
				<input type="submit" value="Upload File" />
			</form>

			<h2>Available Songs:</h2>
			<div id="songs"></div>
		</div>
		<div id="scores">
			<br><h2>Submit Score:</h2>
			<form id="submitScore" action="score.php" method="POST">
				Name: <input type="text" name="player"><br>
				<input type="submit" value="Submit" />
			</form>
			
			<h2>High Scores:</h2>
			<div id="highScores"></div>
			
			<h2>Player Scores:</h2>
			<div id="playerScore"></div>
			<form id="playerScores" action="playerScore.php" method="POST"> 
    			Player: <input type="text" name="player" />
    			<input type="submit" value="Get Scores" /> 
			</form>
		</div>
	</body>
</html>