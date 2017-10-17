/*
 * controller for the application
 */

var isAssembler = false;

/*
 * init the application
 */
function init()
{
	initApp();
//	AlphaBeta.updateABCShow();
	Combinations.initGraph();

	$('.advancedMachineSetting').hide();
	$('#toggleMachineWrapper').hide();
	$('#Program_Table_Wrapper').hide();

	if (isAssembler) {
		$('#Program_Table_Wrapper').hide();
		$('#newCombination').hide();
		$('#resizeButton').hide();
		$('#saveBoardButton').hide();
		$('#loadBoardButton').hide();
		$('#resetHeadButton').hide();
		$('#fileSelectWrapper').hide();
		$('#headWrapper').hide();
		$('#showMachineAdvancedWrapper').hide();
		$('#AlphaBeta_Wrapper').hide();
		$('#Program_Wrapper').css('width', Const.ProgramWrapperWidthWide);
	}
	else {
		$('#Program_Table_Wrapper').show();
		$('#newCombination').show();
		$('#resizeButton').show();
		$('#saveBoardButton').show();
		$('#loadBoardButton').show();
		$('#resetHeadButton').show();
		$('#fileSelectWrapper').show();
		//$('#showBoardAdvancedWrapper').show();
		$('#headWrapper').show();
		$('#showMachineAdvancedWrapper').show();
		$('#AlphaBeta_Wrapper').show();
		$('#Program_Wrapper').css('width', Const.ProgramWrapperWidthNarrow);
		Board.resetAll();
	}

	$('#zoomWrapper').show();
	$('#runWrapper').hide();
	//	$('#headWrapper').show();
	//	$('#fileSelectWrapper').show();

	$('#resizeButton').button({
		text: true,
		label: "set size",
		icons: {
			primary: "ui-icon-arrow-4-diag"
		}
	}).click(function(){
		$('#resizeWrapper').dialog(
		{
			create: function( event, ui ) 
			{
			},
			//				width: 450,
			buttons: [{
				text: "Ok",
				click: function()
				{
					console.log($("#rowsNum").val());
					var rows = $("#rowsNum").val(),cols = $("#colsNum").val();
					if($.isNumeric(rows) && $.isNumeric(cols))
					{
						Board.resize(rows,cols);
						$(this).dialog("close");
					}
				}
			}],
			open: function(event, ui)
			{
				$('#rowsNum').val('10');
				$('#colsNum').val('10');
			},
			close: function(event, ui)
			{
				console.log(event, ui);
			}
		});
	});
	$('#loadProgramButton').button({
		text: false,
		label: "load program",
		icons: {
			primary: "ui-icon-folder-open"
		}
	}).click(function(){
		Combinations.searchProgram();
	});
	$('#saveProgramButton').button({
		text: false,
		label: "save program",
		icons: {
			primary: "ui-icon-disk"
		}
	}).click(function(){
		Combinations.saveProgram();
	});

	$('#loadBoardButton').button({
		text: false,
		label: "load board",
		icons: {
			primary: "ui-icon-folder-open"
		}
	}).click(function(){
		Board.getBoard();
	});

	$('#saveBoardButton').button({
		text: false,
		label: "save board",
		icons: {
			primary: "ui-icon-disk"
		}
	}).click(function(){
		Board.saveBoard();
	});

	$('#zoomInButton').button({
		text: false,
		label: "zoom in",
		icons: {
			primary: "ui-icon-zoomin"
		}
	}).click(function(){
		Board.zoomIn();
	});
	
	$('#zoomOutButton').button({
		text: false,
		label: "zoom out",
		icons: {
			primary: "ui-icon-zoomout"
		}
	}).click(function(){
		Board.zoomOut();
	});

	//$("#resetHeadButton").tooltip({ position: { my: "left center", at: "center top" } });
	//$(".boardController").tooltip({ position: { my: "left center", at: "center top" } });
	$("#resetHeadButton").button({
		text: true,
		label: "Set Head",
		icons: {
			primary: "ui-icon-arrowthick-2-se-nw"
		}	
	}).click(function()
	{
		if(isAssembler)
		{
				
		}
		else
		{
			$('#resetHeadWrapper').dialog(
			{
				create: function( event, ui ) 
				{
				},
				//				width: 450,
				buttons: [{
					text: "Ok",
					click: function()
					{
						Board.resetHead();
						$(this).dialog("close");
					}
				}],
				open: function(event, ui)
				{
				//					$('#headY').val('0');
				//					$('#headX').val('0');
				},
				close: function(event, ui)
				{
					console.log(event, ui);
				}
			});
		}
	});
	$("#resetButton").button({
		text: false,
		label: "reset all",
		icons: {
			primary: "ui-icon-refresh"
		}	
	}).click(function()
	{
		if(isAssembler)
		{
				
		}
		else
		{
			Board.resetAll();
		}
	});
	$("#playButton").button({
		text: false,
		label: "play",
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function() {
		var options;
		if ($(this).text() === "play") {
			options = {
				label: "pause",
				icons: {
					primary: "ui-icon-pause"
				}
			};
		} else if ($(this).text() === "pause") {
			options = {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			};
		}
		if (Runner.runState == "stop") {
			if (!Combinations.Combinations){
				alert("You didn't enter any states! Shame on you!");			
			}
			else{
				$(this).button("option", options);
				Runner.run();
			}
		}
		else {
			Runner.pause();
			$(this).button("option", options);				
		}
	});

	var elem = document.getElementById('Machine_State');
	elem.scrollLeft = (elem.scrollWidth - elem.clientWidth) / 2;
	elem.scrollTop = (elem.scrollHeight - elem.clientHeight) / 2;
}

/*
 * init the application
 */
function initApp()
{
	if (typeof urlParams["isAssembler"] === 'undefined') {
		isAssembler = false;
	}
	else {
		isAssembler = true;
	}

	AlphaBeta.initAlphabeta();
	if (Board.boardString && Board.boardString != "")
	{
		var dim = Board.boardString.split(';')[0];
		var rowsNcols = dim.split(',');
		var rows = parseInt(rowsNcols[0]), cols = parseInt(rowsNcols[1]);
		Board.create_board(rows, cols);
		Board.writeBoard(Board.boardString);
	}
	else
	{
		Board.create_board(10, 10);
	}
	$("button").button();
	if (Combinations.boardString)
	{
		Combinations.initCombinations();
	}
}

/*
 * parse the url
 */
var urlParams = function()
{
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++)
	{
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined")
		{
			query_string[pair[0]] = pair[1];
		// If second entry with this name
		}
		else if (typeof query_string[pair[0]] === "string")
		{
			var arr = [query_string[pair[0]], pair[1]];
			query_string[pair[0]] = arr;
		// If third or later entry with this name
		}
		else
		{
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
}();
	