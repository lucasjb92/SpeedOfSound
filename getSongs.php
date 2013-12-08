<?php
	$con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}

	$result = mysqli_query($con,"SELECT * FROM Song");

	echo "<select name='songSelect' id='songSelect'>";
	while($row = mysqli_fetch_array($result))
  	{
  		echo "<option value=\"" . $row['Filename'] . "\">" . $row['Title'] . " - ";
  		echo $row['Artist'] . "</option>";
  	}
  	echo "</select>";
  	echo "<button onclick='SelectSong()'>Select Song</button>";
  	
	mysqli_close($con);
?>