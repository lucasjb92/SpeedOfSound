<?php
	$target_path = "/afs/cs.unc.edu/project/courses/comp426-f13/public_html/ljboyer/final/songs/";
	
	$alt_path = "songs/";

	$target_path = $target_path . basename( $_FILES['uploadedfile']['name']); 
	
	$alt_path = $alt_path . basename( $_FILES['uploadedfile']['name']); 

	if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
   		echo "The file ".  basename( $_FILES['uploadedfile']['name']). 
    	" has been uploaded!\n";
    	
    	require_once('getID3-1.9.7/getid3/getid3.php');
    	$getID3 = new getID3;
    	$file = $target_path;
  
    	set_time_limit(30);
    	$ThisFileInfo = $getID3->analyze($file);
    	getid3_lib::CopyTagsToComments($ThisFileInfo);
   		
   		$artist = (!empty($ThisFileInfo['comments_html']['artist']) ? implode('<BR>', $ThisFileInfo['comments_html']['artist']) : '&nbsp;').'\n';
   		$title = (!empty($ThisFileInfo['comments_html']['title']) ? implode('<BR>', $ThisFileInfo['comments_html']['title'])  : '&nbsp;').'\n';
   		$length = (!empty($ThisFileInfo['playtime_string']) ? $ThisFileInfo['playtime_string']                          : '&nbsp;').'\n';
    	
    	$con=mysqli_connect("classroom.cs.unc.edu","eoverman","CH@ngemenow99Please!eoverman","eovermandb");
		// Check connection
		if (mysqli_connect_errno())
  		{
  			echo "Failed to connect to MySQL: " . mysqli_connect_error();
  		}
    	
    	$sql="INSERT INTO Song (Title, Artist, Length, Filename)
		VALUES
		('$title','$artist','$length','$alt_path')";

		if (!mysqli_query($con,$sql))
  		{
  			die('Error: ' . mysqli_error($con));
  		}
		echo "Song info added to database!";
		
		mysqli_close($con);
	} else{
    	echo "There was an error uploading the file, please try again!";
	}
?>