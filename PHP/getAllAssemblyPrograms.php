<?php
session_start();
/*
 * send to client all the assmbly programs that exists in the DB
 */
$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return ;
}

$result = mysqli_query($con,"SELECT programName,program,programDesc,userName FROM assemblyprograms");

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
