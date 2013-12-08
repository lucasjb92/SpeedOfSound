<?php
    $con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}
  	
  	if($_POST[score] > 0){
  		$sql="INSERT INTO Score (Player, Score)
		VALUES
		('$_POST[player]','$_POST[score]')";
		
		if (!mysqli_query($con,$sql))
  		{
  			die('Error: ' . mysqli_error($con));
  		}
		echo "Your score has been submitted!";
  	}
    else
    {
    	echo "error";
    }
	
	mysqli_close($con);
?>