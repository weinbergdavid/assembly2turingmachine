<?php
/*
 * save assembly board(tape) in the DB
 */
session_start();
if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
	echo 'you must login';
	return ;
}
$userName = $_SESSION["userName"] ;

$boardName=$_POST["boardName"];
$board=$_POST["board"];

if(strpos($board,"'") != null || strpos($board,";;") != null || strpos(strtolower($board),"go") != null)
{
//	echo 'SQL Injection? Maniac!!!';
	return ;
}
if(strpos($boardName,"'") != null || strpos($boardName,";;") != null || strpos(strtolower($boardName),"go") != null)
{
//	echo 'SQL Injection? Maniac!!!';
	return ;
}

$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");
// Check connection
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return ;
}
$command = "insert into `board`(boardID,boardName,board,userName)
			values(NULL,'$boardName','$board','$userName')
ON DUPLICATE KEY UPDATE 
  board=VALUES(board)";
$result = mysqli_query($con,$command);
//echo $command ;
if(!$result)
{
	echo '\nfff\n';
	echo mysqli_error().'\nfff\n';
	echo 'the borad not saved';
}
else
{
	echo 'the borad saved';
}

mysqli_close($con);


?>
