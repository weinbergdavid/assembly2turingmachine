<?php
/**
 * send to client all turing programs via JSON
 */
session_start();
//if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
//	echo 'you must login';
//	return ;
//}
//$userName = $_SESSION["userName"] ;


// Create connection
$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");
// Check connection---
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return ;
}

$result = mysqli_query($con,"SELECT programName,program,programDesc,userName FROM programs");

if (!$result) {
    die('Invalid query: ' . mysqli_error($con));
	return ;
}
$arr = array();
$i = 0 ;
while($row = mysqli_fetch_array($result))
{
	$rowOb = new stdClass();
	$rowOb->programName = $row["programName"] ;
	$rowOb->program = $row["program"] ;
	$rowOb->programDesc = $row["programDesc"] ;
	$rowOb->userName = $row["userName"] ;
	$arr[$i] = $rowOb ;
	$i++;
}
echo json_encode($arr);

mysqli_close($con);

//echo 'the request is succeeded '.$programID ;

?>
