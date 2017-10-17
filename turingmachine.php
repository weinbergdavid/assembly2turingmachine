<?php session_start(); ?>
<!DOCTYPE html>
<html>
    <head>
		<title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link href="Style/jquery-ui-1.10.2.custom.css" rel="stylesheet"/>
        <link href="Style/Layout.css" rel="stylesheet"/>

		<script type="text/javascript" src="JS/libs/underscore.js"></script>
		<script type="text/javascript" src="JS/libs/backbone.js"></script>
        <script type="text/javascript" src="JS/libs/raphael.js"></script>
        <script type="text/javascript" src="JS/libs/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="JS/libs/jquery.csv-0.71.js"></script>
        <script type="text/javascript" src="JS/libs/jquery-ui-1.10.2.custom.js"></script>
        <script type="text/javascript" src="JS/libs/d3.v3.js"></script>
		<script type="text/javascript" src="JS/scripts/constants.js"></script>
		<script type="text/javascript" src="JS/scripts/controller.js"></script>
		<script type="text/javascript" src="JS/scripts/alphaBeta.js"></script>
        <script type="text/javascript" src="JS/scripts/board.js"></script>
		<script type="text/javascript" src="JS/scripts/combinations.js"></script>
		<script type="text/javascript" src="JS/scripts/runner.js"></script>
		<script type="text/javascript" src="JS/scripts/httpClient.js"></script>
        <script type="text/javascript" src="JS/scripts/login.js"></script>
		<script type="text/javascript" >
			//read borad from POST
			Board.boardString = <?php
if (isset($_POST["boardString"]))
	echo '"' . $_POST["boardString"] . '"';
else
	echo "null";
?>;

			//upload assembler program if needed
			Combinations.boardString = <?php
//echo "file_exists (programs/".$_GET["uploadFile"]."): ".file_exists ("programs/".$_GET["uploadFile"])."\n";
if (isset($_GET["uploadFile"]) && file_exists("programs/" . $_GET["uploadFile"])) {
	$file_array = file("programs/" . $_GET["uploadFile"]);
	foreach ($file_array as $key => $value) {
		$file_array[$key] = chop($value);
	}
	echo '"' . Join('\n', $file_array) . '"';
} else {
	echo '""';
}
?>;
			//Combinations.initCombinations(prog);
		</script>
    </head>
    <body onload="init();">
		<div id="dialogsWrapper" style="display: none;">
			<div id="searchBoardDialog" class="dialogBody" title="Search Board">
				<div id="boardsWrapper" ></div>
				<div class="dialogDescriptionTitle">Board description</div>
				<div id="boardDescription"></div>
			</div>
			<div id="saveBoardDialog" class="dialogBody" title="Save Board">
				<input type="text" id="boardNameInput" placeholder="Board Name"/>
				<input type="text" id="boardDescInput" placeholder="Board Description"/>
			</div>
			<div id="searchProgramDialog" class="dialogBody" title="Search Program">
				<div id="programsWrapper" ></div>
				<div class="dialogDescriptionTitle">Board description</div>
				<div id="programDescription"></div>
			</div>
			<div id="saveProgramDialog" class="dialogBody" title="Save Program">
				<div>
					<input type="text" id="programNameInput" placeholder="Program Name"/>

				</div>
				<div>
					<textarea rows="2" cols="30"  id="programDescInput" align="left" placeholder="Program Description"></textarea>		
				</div>
			</div>
			<div id="resetHeadWrapper" class="dialogBody" title="Set Head Position">
				<label for="headY">row:</label>
				<input type="text" name="headY" id="headY" value="0"/>
				<label for="headX">column:</label>
				<input type="text" name="headX" id="headX" value="0"/>
				<!--<button id="resetHead" class="boardButton" onclick="Board.resetHead();">Reset Head</button>-->
			</div>
			<div id="resizeWrapper" class="dialogBody" title="Set Board Size">
				<label for="rowsNum">row:</label>
				<input type="text" name="rowsNum" id="rowsNum" value="10"/>
				<label for="colsNum">column:</label>
				<input type="text" name="colsNum" id="colsNum" value="10"/>
			</div>
		</div>
        <div id="AllWrapper">
            <div id="controls">
                <div id="homeLinkDiv">
                    <a id="homeLink" href="index.php"></a>
                    home
                </div>
				<div>
                    <img id="loginImage" src="pictures/login.png" alt="Log in" onclick="Login.login()"/>
                </div>
				<!--                <button id="new" onclick="">new</button>
								<button id="load" onclick="">load</button>
								<button id="save" onclick="">save</button>-->
            </div>
            <div id="Machine_Wrapper">
                <div id="Program_Wrapper">

					<!--<div id="showMachineAdvancedWrapper">-->
					<!--							<button id="showAdvanced" onclick="$('#showMachineAdvancedWrapper').hide('slow');
												$('#toggleMachineWrapper').show('slow');">show program's advanced options</button>-->
					<!--</div>-->
					<div id="toggleMachineWrapper">
						<!--							<button id="hideAdvancedMachine" class='hideAdvancedButton' onclick="$('#showMachineAdvancedWrapper').show('slow');
													$('.advancedMachineSetting, #toggleMachineWrapper').hide('slow');">hide advanced options</button>
												<button id="file_options" onclick="$('#fileSelectWrapper').toggle('slow');">toggle file select options</button>
												<button id="php_options" onclick="$('#getProgramWrapper').toggle('slow');">toggle file php options</button>
												<button id="running_options" onclick="$('#startStateWrapper').toggle('slow');">toggle running options</button>
												<button id="newCombination_options" onclick="$('#newCombination').toggle('slow');">toggle new combination options</button>
												<button id="programTable_options" onclick="$('#Program_Table_Wrapper').toggle('slow');">toggle table view</button>-->
					</div>


<!--					<div id='getProgramWrapper' class='advancedMachineSetting'>
						<input type="text" id="input_program_id" onkeydown="if (event.keyCode == 13)
					document.getElementById('get_program').click()"/>
						<button id="get_program" onclick="HttpClient.getProgram();">get program</button>
						<button id="search_program" onclick="Combinations.searchProgram();">search program</button>
					</div>-->

					<!--					<div id='startStateWrapper' class='advancedMachineSetting'>
											<label for='startState'>A state to start with (0 for default)</label>
												   <input type="text" id="startState" onkeydown="if (event.keyCode == 13)
												document.getElementById('run').click()"/>
										</div>-->

                    <div id="Machine_State">
                        <!--current state-->
                    </div>
					<div id="programController">
						<button id="loadProgramButton"></button>
						<button id="saveProgramButton"></button>						
					</div>
					<div id="fileSelectWrapper" class='advancedMachineSetting'>
						<label for="files">Upload a program</label>
						<input type="file" id="files" name="files[]" multiple />
						<output id="list"></output>
						<script>
			document.getElementById('files').addEventListener('change', Combinations.handleFileSelect, false);
						</script>
					</div>
					<div id="machineConsole">&nbsp;</div>
                    <div id="Program_Table_Wrapper">
                        <table id="Program_Table">
<!--                            <tr>
                                <th>function</th>
                            </tr>
                            <tr>
                                <th>state</th>
                                <th>input</th>
                                <th>output</th>
                                <th>moving</th>
                                <th>next state</th>
                            </tr>-->
                        </table>
                    </div>
                    <div id="newCombination" class='advancedMachineSetting'>
						<label for='old_state_new_combination'>old state:</label>
						<input type="text" id="old_state_new_combination" placeholder="old state"/><br/>

						<label for='input_new_combination'>input:</label>
						<input type="text" id="input_new_combination" placeholder="input"/><br/>

						<label for='move_to_new_combination'>move to:</label>
						<input type="text" id="move_to_new_combination" placeholder="move to"/><br/>

						<label for='output_new_combination'>output:</label>
						<input type="text" id="output_new_combination" placeholder="output"/><br/>

						<label for='new_state_new_combination'>new state:</label>
						<input type="text" id="new_state_new_combination" placeholder="new state"/><br/>					
                        <button onclick="Combinations.saveCombination()">save combination</button>
                    </div>
                </div>
                <div id="BoardWrapper">
					<!--					<div id="showBoardAdvancedWrapper">
												<button id="showAdvanced" onclick="$('#showBoardAdvancedWrapper').hide('slow');
												$('#toggleBoardWrapper').show('slow');">show board's advanced options</button>
										</div>
										<div id="toggleBoardWrapper">
												<button id="hideAdvancedBoard" class='hideAdvancedButton' onclick="$('#showBoardAdvancedWrapper').show('slow');
												$('.advancedBoardSetting, #toggleBoardWrapper').hide('slow');">hide advanced options</button>
											<button id="resize_options" onclick="$('#resizeWrapper').toggle('slow');">toggle resize options</button>
											<button id="zoom_options" onclick="$('#zoomWrapper').toggle('slow');">toggle zoom options</button>
											<button id="head_options" onclick="$('#headWrapper').toggle('slow');">toggle head options</button>
											<button id="reset_options" onclick="$('#resetWrapper').toggle('slow');">toggle reset options</button>
											<button id="reset_options" onclick="$('#boardSaveWrapper').toggle('slow');">toggle board options</button>
										</div>-->
					<!--					<div id="resizeWrapper" class="advancedBoardSetting">
											   <input type="text" id="rows_size_id" onkeydown="if (event.keyCode == 13)
												document.getElementById('resize_id').click()"/>
												   <input type="text" id="cols_size_id" onkeydown="if (event.keyCode == 13)
												document.getElementById('resize_id').click()"/>
													<button id="resize_id" onclick="Board.resize();
												$('#resizeWrapper').hide();">resize</button>
										</div>-->
					<!--					<div id="boardSaveWrapper" class="advancedBoardSetting">
											input type="text" id="boardNameInput"/
											<button id="saveBoard" class="boardButton" onclick="Board.saveBoard();">Save Board</button>
											<button id="getBoard" class="boardButton" onclick="Board.getBoard();">Get Board</button>
										</div>-->
                    <!--div id="BoardHolder" class="scrollable"></div-->
                    <div id="BoardHolder"></div>
					<div id="boardController">
						<button id="resetButton"></button>
						<button id="playButton"></button>
						<button id="loadBoardButton"></button>
						<button id="saveBoardButton"></button>
						<button id="zoomInButton"></button>
						<button id="zoomOutButton"></button>
						<button id="resizeButton" title="set the board size"></button>
						<button id="resetHeadButton" title="set the head position"></button>
						<div id="runSpeedSlider"></div>
					</div>

                </div>
				<div id="AlphaBeta_Wrapper">
                    <!--div id="AlphaBeta_Collection" class="scrollable"></div-->
                    <div id="selectedCharHolder"></div>
					<div id="AlphaBetaAccordion">
						<h3>Special Characters</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaSpecial"></div>
                        <h3>Numbers</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaNumbers"></div>
						<h3>Colors</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaColors"></div>
                        <h3>Registers</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaRegisters"></div>
						<h3>Titles</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaTitles"></div>
                        <h3>Ops</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaOps"></div>
                        <h3>Pictures</h3>
						<div class="AlphaBetaCollection" id="AlphaBetaPictures">
							<form action='PHP/upload_file.php' method='post' enctype='multipart/form-data'>
								<input type='file' name='file' id='newPicture'>
								<input id='uploadPicture' type='submit' name='upload' value='Upload'>
							</form>
						</div>
					</div>
                </div>
				<div id='runWrapper'>
					<button style="background-color:greenyellow;color:blueviolet;" id="run" onclick="Runner.run();">run</button>
					<button style="background-color:greenyellow;color:blueviolet;" id="pause" onclick="Runner.pause();">pause</button>
				</div>
            </div>
        </div>
    </body>
</html>
