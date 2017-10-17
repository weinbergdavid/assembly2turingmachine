<?php
/**
 * this file is to sign in to the server with exists user. user
 */
session_start();

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 01 Jan 1996 00:00:00 GMT');

// The JSON standard MIME header.
header('Content-type: application/json');
/* Open a connection */
$con = mysqli_connect("localhost", "twodturi_da", "dwasel", "twodturi_2dtm");

/* check connection */
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}
/**
 * check if all the fields is filled.
 */
if (!isset($_POST["userName"])) {
	echo 'userName is missing';
	return;
}
$userName = $_POST["userName"];
if (!isset($_POST["password"])) {
	echo 'password is missing';
	return;
}
$password = $_POST["password"];
/**
 * if all the fields is filled try to connect.
 */
$command = "select * from  `users` where username='$userName' and password='$password'";
/* execute query */
$result = mysqli_query($con, $command);
if (!$result) {
	echo $con->error;
} else if (mysqli_num_rows($result) == 1) {
	echo 'connected';
	$_SESSION["userName"] = $userName;
} else {
	echo "count:" . mysqli_num_rows($result);
}
/* close connection */
mysqli_close($con);
?>