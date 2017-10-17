<?php session_start(); ?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
        <link href="Style/jquery-ui-1.10.2.custom.css" rel="stylesheet"/>
        <!--<link href="Style/Layout.css" rel="stylesheet"/>-->
        <link href="Style/assemblerLayout.css" rel="stylesheet"/>
        <link href="Style/jquery-linedtextarea.css" type="text/css" rel="stylesheet" />
<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>-->
        <!--<script type="text/javascript" src="JS/libs/jquery-linedtextarea.js"></script>-->
        <script type="text/javascript" src="JS/libs/raphael.js"></script>
        <script type="text/javascript" src="JS/scripts/httpClient.js"></script>
        <script type="text/javascript" src="JS/libs/jquery-2.0.3.js"></script>
        <script type="text/javascript" src="JS/libs/jquery.csv-0.71.js"></script>
        <script type="text/javascript" src="JS/libs/jquery-ui-1.10.2.custom.js"></script>
        <script type="text/javascript" src="JS/scripts/assembler.js"></script>
        <script type="text/javascript" src="JS/scripts/login.js"></script>
    </head>
    <body onload="Assembler.init();">
        <div id="allWrapper">
            <div id="dialogsWrapper" style="display: none;">
                <div id="searchProgramDialog" class="dialogBody" title="Search Program">
                    <div id="programsWrapper" ></div>
                    <div class="dialogDescriptionTitle">Program description</div>
                    <div id="programDescription"></div>
                </div>
                <div id="saveProgramDialog" class="dialogBody" title="Save Program">
                    <div>
                        <input type="text" id="programNameInput" placeholder="Program Name"/>

                    </div>
                    <div>
                        <textarea rows="2" cols="30"  id="programDescInput" placeholder="Program Description"></textarea>		
                    </div>
                    <!--<input type="text" id="programDescInput" placeholder="Program Description"/>-->

                </div>
				<div id="HelpDialog" class="dialogBody" title="Help">
                </div>
            </div>

            <div id="pageControllers">
                <div id="homeLinkDiv">
                    <a id="homeLink" href="index.php"></a>
                    home
                </div>
                <div>
                    <img id="loginImage" src="pictures/login.png" alt="Log in" onclick="Login.login()"/>
                </div>
				<div>
                    <button id="Help"  alt="Help"/>
                </div>
                <div>
                    <button id="Feedback"  alt="Feedbaxk"/>
                </div>
                <div>
                    <button id="searchProgram" class="jqueriuiButton" onclick="Assembler.searchProgram();">Search assembly program</button>
                    <button id="saveProgram" class="jqueriuiButton" onclick="Assembler.saveProgram();">Save assembly program</button>
                </div>
            </div>
            <div id="PageTitle">
                From Assembly to Turing Machine
            </div>

            <div>
                <div id="codeAreaTitle">
                    Insert your assembly code here:
                </div>
                <textarea rows="4" cols="50" class="lined" id="codeArea"></textarea>
                <script>
                    //				$(function() {
                    //				console.log($(".lined"));
                    //				$(".lined").linedtextarea(
                    //					{selectedLine: 1}			);
                    //				});
                </script>	
            </div>

            <div>
                <div id="advancedOptionsDiv">
                    <div>
                        <label id="bitsNumLabel" for="bitsNum" class="inputLabel">Number of bits:</label>
                        <input name="bitsNum" id="bitsNum" type="text" placeholder="Number of bits"/>
                    </div>
                    <div>
                        <label id="memSizeLabel" for="memSize" class="inputLabel">Memory size:</label>
                        <input name="memSize" id="memSize" type="text" placeholder="Memory size"/>
                    </div>
                </div>
                <div>
                    <div>
                        <button id="createBoardButton" class="jqueriuiButton" onclick="Assembler.creatBoard(false);">Create Board</button>
                    </div>
                    <div>
                        <button id="gotoBoardButton" class="jqueriuiButton" onclick="Assembler.creatBoard(true); ">Go To Board</button>
                    </div>
                </div>
                <form name="createBoard" action="turingmachine.php?dumy=Date().getTime&uploadFile=assembler.csv&isAssembler=true" method="post" enctype="multipart/form-data" style="display: none;">
                    <input id="boardString" name="boardString" type="text" value="test3"/>
                </form>
                <div id="dialogTexts" style="display: none;">
                    <div id="rowNotSupported"></div>
                </div>
            </div>
        </div>
    </body>
</html>


