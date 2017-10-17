<?php
/*
 * the navigator panel.
 */

/*
 * return the prefix of url (local host and Production)
 */
function baseUrl() {
	if (strpos(curPageURL(), 'PhpProject') !== false) {
		$baseUrl = "http://localhost/PhpProject1";
	} else {
		$baseUrl = "";
	}
	return $baseUrl;
}
/*
 * return the URL that running now.
 */
function curPageURL() {
	$pageURL = 'http';
	if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
		$pageURL .= "s";
	}
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
	} else {
		$pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}
?>

<style type="text/css">

	

</style>

<div class="navbox">
	<ul class="nav">
		<li><a href="<?php echo baseUrl(); ?>/index.php">Home</a></li>
		<li><a href="<?php echo baseUrl(); ?>/PHP/aboutTuring.php">About Turing</a></li>
		<li><a href="<?php echo baseUrl(); ?>/PHP/aboutTuringMachine.php">About Turing Machine</a></li>
		<li><a href="<?php echo baseUrl(); ?>/PHP/about2DTuringMachine.php">About 2D Turing Machine</a></li>
		<li><a href="<?php echo baseUrl() ;?>/PHP/AboutUs.php">About Us</a></li>
	</ul>
</div>