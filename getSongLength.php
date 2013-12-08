<?php
	$con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}

	$file = substr($_SERVER['PATH_INFO'], 1);
	$result = mysqli_query($con,"SELECT * FROM Song WHERE Filename='$file'");
	
	while($row = mysqli_fetch_array($result))
  	{
  		echo $row['Length'];
  	}
  	
	mysqli_close($con);
?>