<?php
session_start();

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 01 Jan 1996 00:00:00 GMT');

// send to client via Json all the borads that storedin the DB.
header('Content-type: application/json');
//if(!isset($_SESSION) || !isset($_SESSION["userName"])) {
//	echo 'you must login';
//	return ;
//}
//$userName = $_SESSION["userName"] ;
/* Open a connection */
$con=mysqli_connect("localhost","twodturi_da","dwasel","twodturi_2dtm");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$command = 
	"SELECT boardName,board,boardDesc,userName
	from `twodturi_2dtm`.`board`";
if ($stmt = mysqli_prepare($con, $command)) {

    /* execute query */
	$result = mysqli_query($con,$command);
	if(!$result)
	{
		echo 'error';
	}
	else
	{
		$arr = array();
		$i = 0 ;
		while($row = mysqli_fetch_array($result))
		{
			//echo $row["boardName"]."\n";
			$arr[$i]=$row ;
			$i++;
		}
		echo json_encode($arr);

	}
}

/* close connection */
mysqli_close($con);
?>