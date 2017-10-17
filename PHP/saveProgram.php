
<?php
/*
 * save turing program in the DB
 */
session_start();
if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
	echo 'you must login';
	return ;
}
$userName = $_SESSION["userName"] ;
$programName=$_POST["name"];
$program=$_POST["program"];
$programDesc=$_POST["programdDesc"];
/*if(strpos($board,"'") != null || strpos($board,";;") != null || strpos(strtolower($board),"go") != null)
{
	echo 'SQL Injection? Maniac!!!';
	return ;
}
if(strpos($boardName,"'") != null || strpos($boardName,";;") != null || strpos(strtolower($boardName),"go") != null)
{
	echo 'SQL Injection? Maniac!!!';
	return ;
}*/

$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");
// Check connection
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return ;
}
$command = "insert into `twodturi_2dtm`.`programs`(programID,programName,programDesc,program,userName)
			values(NULL,'$programName','$programDesc','$program','$userName')
ON DUPLICATE KEY UPDATE 
  program=VALUES(program)";
$result = mysqli_query($con,$command);
if(!$result)
{
	echo mysqli_error($con);
	echo 'the program not saved';
}
else
{
	echo 'the program saved';
}

mysqli_close($con);


?>
