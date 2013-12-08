<?php
    $con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}
    
    $sql="INSERT INTO Score (Player, Score)
	VALUES
	('$_POST[player]','999')";
	
	if (!mysqli_query($con,$sql))
  	{
  		die('Error: ' . mysqli_error($con));
  	}
	echo "Your score has been submitted!";
	
	mysqli_close($con);
?>