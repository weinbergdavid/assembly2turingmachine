<?php
/*
 * send to client specific board
 */
if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
	echo 'you must login';
	return ;
}
$userName = $_SESSION["userName"] ;

$boardName=$_GET["boardName"];

$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");
// Check connection
if (mysqli_connect_errno($con))
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	return ;
}

$command = 
	"
	SELECT board 
	from `twodturi_2dtm`.`board`
	where boardName='$boardName'";

$result = mysqli_query($con,$command);
if(!$result)
{
	echo 'error';
}
else
{
	
	while($row = mysqli_fetch_array($result))
	{
		echo $row["board"];
	}
}

mysqli_close($con);


?>


