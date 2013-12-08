//audio variables:
var context;
var source, sourceJs;
var analyser;
var buffer;
var array = new Array();
 
var request;

var audioLoaded = false;
var gameInProgress = false;
var songLength = 0;

//canvas
var gWindow;
var canv; 
var WIDTH = 900;
var HEIGHT = 650;
var barH;
var barW;
var barCenter = new Array();

var pieceStartX = 2;
var pieceStartY = HEIGHT/2;

var atFarRight = false;

var pieceX= pieceStartX;
var pieceY = pieceStartY;
var pieceSize;
var pieceColor = "#FFFFFF";

var leftMove = false;
var rightMove = false;
var upMove = false;
var downMove = false;

var gameBackgroundR = 0;
var gameBackgroundG = 0;
var gameBackgroundB = 0;
var gameBackgroundHex = "#000000"; //generate this dynamically from the above, or vice versa?

var score = 0;
var pointsPerPixel = 0.2;
var impactPenalty = 75;
var endBonus = 125;
var maxLeft = pieceStartX;

$(document).ready(function() {

	//loadAudio("http://wwwp.cs.unc.edu/~ljboyer/SpeedOfSound/mottoD.mp3");
	//songLength = 10;//181

});

//plays the game
function playGame() {
	//clear the canvas:
	canv.fillStyle = gameBackgroundHex;
	canv.fillRect(0,0,WIDTH,HEIGHT);
	
	//display ready text:
	canv.fillStyle="#FFFFFF";
	canv.font="70px Arial";
	canv.fillText("get ready!",WIDTH/3+10,HEIGHT/2,WIDTH/3-20);
	
	//set context depending on browser:
	if( typeof(webkitAudioContext) == 'function') { //webkit based browsers
		context = new webkitAudioContext();			
		}
	else { // non-webkit browsers:
		context = new AudioContext();		
	}
	
	
	context.decodeAudioData(
	request.response,
	function(buffer) {
	
		//check for errors with audio:
		if(!buffer) {
			alert("error with audio file :'(");
			return;
		}
		
		//set up audio source & analyser:
		sourceJs = context.createJavaScriptNode(2048);
		sourceJs.buffer = buffer;
		sourceJs.connect(context.destination);
		analyser = context.createAnalyser();
		analyser.smoothingTimeConstant = 0.6;
		analyser.fftSize = 128;
		source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(analyser);
		analyser.connect(sourceJs);
		source.connect(context.destination);
		
		//bar info:		
		var numBars = Math.ceil(analyser.frequencyBinCount * 0.35);
		var sideBuffer = WIDTH/numBars;
		barW = (WIDTH-sideBuffer) / numBars;
		pieceSize = barW/4;
		
		//randomize bar positions:
		for(var k = 0; k < numBars; k++) {
			barCenter[k] = Math.random();
		}
		
		//get canvas:
		gWindow = document.getElementById("gameWindow");
		canv = gWindow.getContext("2d");

		//audio variables:
		var currTime;
		var minutes;
		var seconds;
		var formattedTime;	 

		sourceJs.onaudioprocess = function(e) {
			if(!gameInProgress) return;
			array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);
			
			//check if the song is finished:
			currTime = context.currentTime;
			if( currTime > songLength) {
				source.noteOff(0);
				
				audioLoaded = false;
				gameInProgress = false;
				
				//clear the canvas:
				canv.fillStyle = gameBackgroundHex;
				canv.fillRect(0,0,WIDTH,HEIGHT);
				
				//put the score in the score form:
				$("#scoreField").val(score);
				
				//display loading text:
				canv.fillStyle="#FFFFFF";
				canv.font="60px Arial";
				canv.fillText("game complete!",WIDTH/3,HEIGHT/2-110,WIDTH/3);
				var scoreLine = "your final score was " + score;
				canv.fillText(scoreLine,WIDTH/3-15,HEIGHT/2-55,WIDTH/3+30);
				canv.fillText("enter your name in the",WIDTH/3-15,HEIGHT/2+55,WIDTH/3+30);
				canv.fillText("box below to submit your score",WIDTH/3-40,HEIGHT/2+110,WIDTH/3+80);
				return;
			}
			
			//display the time
			minutes = Math.floor(currTime/60);
			seconds = Math.floor(currTime % 60);
			if( seconds < 10)
				formattedTime = "Time: " + minutes + ":0" + seconds;
			else
				formattedTime = "Time: " + minutes + ":" + seconds;
			$("#songTime").html(formattedTime);
			
			//clear the canvas:
			canv.fillStyle = gameBackgroundHex;
			canv.fillRect(0,0,WIDTH,HEIGHT);		
							
			//draw the bars on the screen:
			var hue;
			var barColor;
			for ( var i = 0; i < numBars; i++) {
				hue = i/numBars * 290;
				barColor = 'hsl(' + hue + ',100%,50%)';
				canv.fillStyle = barColor;						
				barH = array[i] / 255 * HEIGHT * 0.9 + HEIGHT* 0.1 - pieceSize*2;						
				canv.fillRect(barW*i+sideBuffer*3/4,barCenter[i]*HEIGHT-barH/2,barW/2,barH);						
			}
			
			//move the piece:
			if(upMove) moveUp();
			if(downMove) moveDown();
			if(leftMove) moveLeft();
			if(rightMove) moveRight();
			
			//check whether a bar has impaled the game piece, move back to beginning if so
			canv.fillStyle = pieceColor;
			var img = canv.getImageData(pieceX,pieceY,pieceSize,pieceSize);
			var pixels = img.data;
			for( var j = 0; j < pixels.length; j += 4 ) {
				var r = pixels[j];
				var g = pixels[j+1];
				var b = pixels[j+2];
				if( (r != gameBackgroundR) || (g != gameBackgroundG) || (b != gameBackgroundB) ) {
					pieceX = pieceStartX;
					pieceY = pieceStartY;
					maxLeft = pieceStartX;
					score -= impactPenalty;
					if( score < 0 ) score = 0;
					break;
				}				
			}
			
			//add points for leftward movement:
			if( maxLeft < pieceX) {
				score += Math.round((pieceX-maxLeft)*pointsPerPixel);
				maxLeft = pieceX;
			}
			
			//give bonus for getting to the end and reset to start:
			if( atFarRight) {
				atFarRight = false;
				pieceX = pieceStartX;
				pieceY = pieceStartY;
				score += endBonus;
				maxLeft = pieceStartX;
				for(var k = 0; k < numBars; k++) {
					barCenter[k] = Math.random();
				}
			}
			
			//draw the piece:
			canv.fillRect(pieceX,pieceY,pieceSize,pieceSize);
			
			//display updated score:
			var scoreText = "Score: " + score;
			$("#score").html(scoreText);
		};

		//starts playing the audio:
		source.noteOn(0);
	},
	function(error) {
		alert("error decoding audio :(");
	}
);

}

//loads in the specified audio file:
function loadAudio(url) {

	//get canvas:
	gWindow = document.getElementById("gameWindow");
	canv = gWindow.getContext("2d");
	
	//clear the canvas:
	canv.fillStyle = gameBackgroundHex;
	canv.fillRect(0,0,WIDTH,HEIGHT);
	
	//display loading text:
	canv.fillStyle="#FFFFFF";
	canv.font="60px Arial";
	canv.fillText("loading song",WIDTH/3,HEIGHT/2,WIDTH/3);

	//set up AJAX request for the song:
	request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = "arraybuffer";

	//function called when the audio is loaded in:
	request.onload = function() {		
		//playGame();
		audioLoaded = true;
				
		//clear the canvas:
		canv.fillStyle = gameBackgroundHex;
		canv.fillRect(0,0,WIDTH,HEIGHT);
		
		//display loaded text:
		canv.fillStyle="#FFFFFF";
		canv.font="60px Arial";
		canv.fillText("song loaded!",WIDTH/3+15,HEIGHT/2,WIDTH/3-30);
		canv.fillText("press spacebar to play",WIDTH/3,HEIGHT/2 + 55,WIDTH/3);
	};

	//sends the request to get the song
	request.send();

}

$(document).keydown(function(e) {
	switch(e.which) {
		case 65: //a, moves left
			leftMove = true;
			break;
		case 83: //s, moves down
			downMove = true;
			break;
		case 68: //d, moves right
			rightMove = true;
			break;			
		case 87: //w, moves up
			upMove = true;
			break;
		case 32://space, starts game
			e.preventDefault();
			if(audioLoaded & !gameInProgress) {
				gameInProgress = true;
				playGame();
			}
			break;
	}	
});

$(document).keyup(function(e) {
	switch(e.which) {
		case 65: //a, moves left
			leftMove = false;
			break;
		case 83: //s, moves down
			downMove = false;
			break;
		case 68: //d, moves right
			rightMove = false;
			break;			
		case 87: //w, moves up
			upMove = false;
			break;
	}	
});

function moveLeft() {
	//grab canvas elements:
	gWindow = document.getElementById("gameWindow");
	canv = gWindow.getContext("2d");
	
	var movementAmt = 7;
	
	//canvas edge case:
	if( pieceX - movementAmt <= 0) {
		pieceX = 0;
		return;
	}
	//check for maze bar: (note, only checks collisions on topleft corner
	var img = canv.getImageData(pieceX-movementAmt,pieceY,movementAmt,1);
	var pixels = img.data;
	var barHit = false;
	var pixelNumber;
	for( var i = 0, n = 1; i < movementAmt*4; i += 4, n++ ) {
		var r = pixels[i];
		var g = pixels[i+1];
		var b = pixels[i+2];
		if( (r != gameBackgroundR) || (g != gameBackgroundG) || (b != gameBackgroundB) ) {
			barHit = true;
			pixelNumber = movementAmt; //for the case where piece is adjacent to bar;
		} else if (barHit == true) { //hit when the first white pixel after a bar is found
			pixelNumber = n-1;//tells how much to reduce movementAmt by
			break;
		}				
	}
	
	//decrement movementAmt if bar is hit:
	if( barHit ) movementAmt -= pixelNumber;
	
	//reduce piece by movementAmt
	pieceX -= movementAmt;
}

function moveRight() {
	//grab canvas elements:
	gWindow = document.getElementById("gameWindow");
	canv = gWindow.getContext("2d");
	
	var movementAmt = 7;
	
	//border case:
	if( pieceX + movementAmt + pieceSize >= WIDTH) {
		pieceX = WIDTH - pieceSize;
		atFarRight = true;
		return;
	}
	//check for maze bar: (note, only checks collisions on topright corner
	var img = canv.getImageData(pieceX+pieceSize+1,pieceY,movementAmt-1,1);
	var pixels = img.data;
	
	for( var i = 0, n = 1; i < pixels.length; i += 4, n++ ) {
		var r = pixels[i];
		var g = pixels[i+1];
		var b = pixels[i+2];
		if( (r != gameBackgroundR) || (g != gameBackgroundG) || (b != gameBackgroundB) ) {
			movementAmt = n-1;
			break;
		} 			
	}
	
	//move piece by movementAmt
	pieceX += movementAmt;
}

function moveUp() {
	//grab canvas elements:
	gWindow = document.getElementById("gameWindow");
	canv = gWindow.getContext("2d");
	
	var movementAmt = 7;
	
	//edge case
	if(pieceY - movementAmt  <= 0) {
		pieceY = 0;
		return;
	}
	
	//check for maze bar:// (note:only checks collisions with top-left corner)
	var img = canv.getImageData(pieceX, pieceY - movementAmt ,1,movementAmt);
	var pixels = img.data;
	var barHit = false;
	for( var i = 0, n = 1; i < movementAmt*4; i += 4, n++ ) {//movementAmt*4 used over pixels.length due to weirdness when touching an edge
		var r = pixels[i];
		var g = pixels[i+1];
		var b = pixels[i+2];
		if( (r != gameBackgroundR) || (g != gameBackgroundG) || (b != gameBackgroundB) ) {
			//restart in this case:
			barHit = true;
			break;
		}
	}
	if(barHit) {
		pieceX = pieceStartX;
		pieceY = pieceStartY;
		maxLeft = pieceStartX;
		score -= impactPenalty;
		if( score < 0) score = 0;
	} else
		pieceY -= movementAmt;

}

function moveDown() {
	//grab canvas elements:
	gWindow = document.getElementById("gameWindow");
	canv = gWindow.getContext("2d");
	
	var movementAmt = 7;
	
	//edge case
	if(pieceY + movementAmt + pieceSize >= HEIGHT) {
		pieceY = HEIGHT - pieceSize;
		return;
	}
	
	//check for maze bar:// (note:only checks collisions with bottom-left corner)
	var img = canv.getImageData(pieceX, pieceY + pieceSize + 1 ,1,movementAmt-1);
	var pixels = img.data;
	var barHit = false;
	for( var i = 0, n = 1; i < pixels.length; i += 4, n++ ) {
		var r = pixels[i];
		var g = pixels[i+1];
		var b = pixels[i+2];
		if( (r != gameBackgroundR) || (g != gameBackgroundG) || (b != gameBackgroundB) ) {
			//restart in this case:
			barHit = true;
			break;
		}
	}
	if(barHit) {
		pieceX = pieceStartX;
		pieceY = pieceStartY;
		maxLeft = pieceStartX;
		score -= impactPenalty;
		if( score < 0) score = 0;
	} else
		pieceY += movementAmt;
}