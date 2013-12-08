<?php
	$con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
	// Check connection
	if (mysqli_connect_errno())
  	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  	}

	$result = mysqli_query($con,"SELECT * FROM Score WHERE Player='$_POST[player]' ORDER BY Score desc");

	echo "<ol>";
	while($row = mysqli_fetch_array($result))
  	{
  		echo "<li>" . $row['Player'] . " - ";
  		echo $row['Score'] . "</li>";
  	}
  	echo "</ol>";

	mysqli_close($con);
?>