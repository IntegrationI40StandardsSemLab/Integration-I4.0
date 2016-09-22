<?php
	$target_dir = "files/";
	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	$uploadOk = 1;
	$fileType = pathinfo($target_file,PATHINFO_EXTENSION);
	/* Check if image file is a actual image or fake image
	if(isset($_POST["submit"])) {
		$check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
		if($check !== false) {
			echo "File is an image - " . $check["mime"] . ".";
			$uploadOk = 1;
		} else {
			echo "File is not an image. ";
			$uploadOk = 0;
		}
	}*/
	// Check if file already exists
	if (file_exists($target_file)) {
		echo "<font color='red' size='2'>File already exists. </red>";
		$uploadOk = 0;
	}
	// Check file size
	if ($_FILES["fileToUpload"]["size"] > 5000000) {
		echo "<font color='red' size='2'>File is too large. </red>";
		$uploadOk = 0;
	}
	// Allow certain file formats
	if($fileType != "xml" && $fileType != "aml" && $fileType != "opcua") {
		echo "<font color='red' size='2'>Only XML/AML/OPCUA files are allowed. </red>";
		$uploadOk = 0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		echo "<font color='red' size='2'>Your file was not uploaded. </red></font><p><a href='upload.html'>Try again </a>";
	// if everything is ok, try to upload file
	} else {
		if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
			echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded. <p > <a id='build' href='tree.html?name=". basename( $_FILES["fileToUpload"]["name"]). "' target='_blank'>Visualization</a>";
		} else {
			echo "<font color='red' size='2'>There was an error uploading your file. </red></font><p><a href='upload.html'>Try again </a>";
		}
	}
?>