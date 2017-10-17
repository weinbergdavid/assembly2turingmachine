<?php
/*
 * send to client specific assembly program.
 */
session_start();
if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
	echo 'you must login';
	return ;
}
$userName = $_SESSION["userName"] ;

$programID=$_GET["id"];

/*if(strpos($programID,"'") !== null || strpos($programID,";") !== null || strpos(strtolower($programID),"go") !== null)
{
	echo 'SQL Injection? Maniac !!!!!!';
	return ;
}*/
// Create connection
$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");
// Check connection---
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return ;
}

$result = mysqli_query($con,"SELECT programName,program,userName FROM programs where ".($programID=='-1'?"":"ProgramID = $programID"));

while($row = mysqli_fetch_array($result))
{
	echo $row[1];
}

mysqli_close($con);

//echo 'the request is succeeded '.$programID ;

?>
