<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head>
		<title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link href="Style/infoPagesLayout.css" rel="stylesheet"/>
		<link href='http://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Armata' rel='stylesheet' type='text/css'>
		<!--<link href="Style/Layout.css" rel="stylesheet"/>-->
		<!--<script type="text/javascript" src="JS/libs/underscore.js"></script>-->
    </head>
    <body>
		<?php
		include_once('PHP/navigator.php');
		?>

		<div id="contentWrapper">
			<div class="linkDiv" style="background-color:#998800;">
				Currently the site runs on Google Chrome. We will upgrade the site in a few days.
			</div>
			<div id="divsWrapper">
				<div id="floater">
				</div>
				<div id="assemblerLinkDiv" class="linkDiv">
					<a id="assemblerLink" class="divLink" href="assembler.php"></a>
					<h4>
						From Assembler To Turing Machine
					</h4>
					<p>
						Try out our compiler which converts an assembler program into program written on 2D Turing machine.
					</p>
				</div>

				<div id="machineLinkDiv" class="linkDiv">
					<a id="machineLink" class="divLink" href="turingmachine.php"></a>
					<h4>
						Try 2D Turing Machine
					</h4>
					<p>
						Try to write your own program on 2D Turing machine.
					</p>
				</div>
			</div>
		</div>
    </body>
</html>
