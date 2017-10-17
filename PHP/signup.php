<?php
/**
 * this file is to sign uo to the server a new user.
 */
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
if (!isset($_POST["userName"])) {
	echo 'userName is missing';
	return ;
}
$userName = $_POST["userName"] ;
if (!isset($_POST["password"])) {
	echo 'password is missing';
	return ;
}
$password = $_POST["password"] ;
if (!isset($_POST["email"])) {
	echo 'email is missing';
	return ;
}
$email = $_POST["email"] ;


$command = "INSERT INTO `users`(`userName`, `password`, `email`)
		VALUES ('$userName','$password','$email')";

/* execute query */
$result = mysqli_query($con, $command);
if (!$result) {
	echo $con->error;
} else {
	echo 'created';
}
$_SESSION["userName"] = $userName;
/* close connection */
mysqli_close($con);
?>