<!DOCTYPE html>
<html>
    <head>
		<title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link href="../Style/infoPagesLayout.css" rel="stylesheet"/>
		<!--<link href='http://fonts.googleapis.com/css?family=Pathway+Gothic+One' rel='stylesheet' type='text/css'>-->
		<link href='http://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
		<!--<script type="text/javascript" src="JS/libs/underscore.js"></script>-->
    </head>
    <body>
		<?php
		include_once('navigator.php');
		?>

		<div id="contentWrapper">
			<div id="textContent">
				<h2>
					Turing Machine
				</h2>
				<p>
					A Turing machine is a hypothetical device that manipulates symbols on a strip of tape according to a table of rules. Despite its simplicity, a Turing machine can be adapted to simulate the logic of any computer algorithm, and is particularly useful in explaining the functions of a CPU inside a computer.
				</p>
				<p>
					The "Turing" machine was invented in 1936 by Alan Turing who called it an "a-machine" (automatic machine). The Turing machine is not intended as practical computing technology, but rather as a hypothetical device representing a computing machine. Turing machines help computer scientists understand the limits of mechanical computation.
				</p>
				<p>
					Turing gave a succinct definition of the experiment in his 1948 essay, "Intelligent Machinery". Referring to his 1936 publication, Turing wrote that the Turing machine, here called a Logical Computing Machine, consisted of:
				</p>
				<p class="citation">
					...an unlimited memory capacity obtained in the form of an infinite tape marked out into squares, on each of which a symbol could be printed. At any moment there is one symbol in the machine; it is called the scanned symbol. The machine can alter the scanned symbol and its behavior is in part determined by that symbol, but the symbols on the tape elsewhere do not affect the behavior of the machine. However, the tape can be moved back and forth through the machine, this being one of the elementary operations of the machine. Any symbol on the tape may therefore eventually have an innings. (Turing 1948, p. 61)
				</p>
				<p>
					A Turing machine that is able to simulate any other Turing machine is called a universal Turing machine (UTM, or simply a universal machine). A more mathematically-oriented definition with a similar "universal" nature was introduced by Alonzo Church, whose work on lambda calculus intertwined with Turing's in a formal theory of computation known as the Church–Turing thesis. The thesis states that Turing machines indeed capture the informal notion of effective method in logic and mathematics, and provide a precise definition of an algorithm or "mechanical procedure".
				</p>
				<p>
					Studying their abstract properties yields many insights into computer science and complexity theory.
				</p>
			</div>
			<div id="credit">
				From Wikipedia, The Free Encyclopedia
			</div>
		</div>
    </body>
</html>
