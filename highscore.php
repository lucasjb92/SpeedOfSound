<?php
	$con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}

	$result = mysqli_query($con,"SELECT * FROM Score ORDER BY Score desc LIMIT 10");
	$lastIDresult = mysqli_query($con,"SELECT * FROM Score ORDER BY ID DESC LIMIT 1");
	$lastID = mysqli_fetch_array($lastIDresult);
	
	echo "<ol>";
	
	while($row = mysqli_fetch_array($result))
  	{
  		if($row == $lastID)
  		{
  			echo "<li class='newScore'>" . $row['Player'] . " - ";
  			echo $row['Score'] . "</li>";
  		}
  		else
  		{
  			echo "<li>" . $row['Player'] . " - ";
  			echo $row['Score'] . "</li>";
  		}
  	}
  	echo "</ol>";

	mysqli_close($con);
?>