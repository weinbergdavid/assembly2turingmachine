<?php
/**
 * save assembly program that the user upload to server.
 */
session_start();
if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
	echo 'you must login';
	return ;
}
$userName = $_SESSION["userName"] ;
$programName = $_POST["programName"];
$program = $_POST["program"];
$programDesc = $_POST["programDesc"];

if (strpos($program, "'") != null || strpos($program, ";;") != null || strpos(strtolower($program), "go") != null) {
	echo 'SQL Injection? Maniac!!!';
	return;
}
if (strpos($programName, "'") != null || strpos($programName, ";;") != null || strpos(strtolower($programName), "go") != null) {
	echo 'SQL Injection? Maniac!!!';
	return;
}

$con = mysqli_connect("localhost", "twodturi_da", "dwasel", "twodturi_2dtm");
// Check connection
if (mysqli_connect_errno($con)) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return;
}
$command = "insert into `assemblyprograms`(programID,programName,programDesc,program,userName)
			values(NULL,'$programName','$programDesc','$program','$userName')
ON DUPLICATE KEY UPDATE 
  program=VALUES(program),
  programDesc=VALUES(programDesc)";
$result = mysqli_query($con, $command);
//echo $command ;
if (!$result) {
	echo mysqli_error() . '\n\n';
	echo 'the program not saved';
} else {
	echo 'the program saved';
}

mysqli_close($con);
?>
