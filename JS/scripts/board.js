/*
 * handle the graphic board
 */

Board = {
	numBits: 4,
	Board: null,
	board_paper: null,
	board_st: null,
	board_head: null,
	board_head_data: null,
	rowsBoard: null,
	colsBoard: null,
	//	boardDimensions: {width: 800, height: 520, centerX: 5.5, centerY: 5.5, zoom: 1.0},
	boardDimensions: {
		width: 3500,
		height: 1500,
		centerX: 5.5,
		centerY: 5.5,
		zoom: 1.0
	},
	windowDimensions: {
		width: 1000,
		height: 600
	},
	boardSquares: {},
	boardABC: {},
	dragSquare: null,
	dragSquareSet: null,
	dragVars: {
		x: 0,
		y: 0
	},
	boardString: "",
	inChangeBoard: false,
	globalAnimateNum: 0,
	inDrag: false,
	lastState: '0',
	lastCenterX: 0,
	lastCenterY: 0,
	lastZoom: 1,
	/*
	 * move the board display on mouse drag
	 */
	onDrag: function(dx, dy)
	{
		if (!Board.inDrag)
		{
			return;
		}
		Board.boardDimensions.centerX += (Board.dragVars.x - dx) / 50;
		Board.boardDimensions.centerY += (Board.dragVars.y - dy) / 50;
		Board.dragVars.x = dx;
		Board.dragVars.y = dy;
		Board.redrawBoard(1, false);
	},
	/*
	 * start the drag
	 */
	startDrag: function(x, y)
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			Board.inDrag = false;
			return;
		}
		//Board.inChangeBoard = true ;
		Board.inDrag = true;
		Board.dragVars.x = 0;
		Board.dragVars.y = 0;
		$('#BoardHolder svg').css("transition", "-webkit-transform 0s");
	},
	/*
	 * end the drag
	 */
	endDrag: function()
	{
		Board.inChangeBoard = false;
		Board.inDrag = false;
		$('#BoardHolder svg').css("transition", "-webkit-transform 2s");
	},
	/*
	 * create a new board
	 */
	create_board: function(rows, cols)
	{
		$("#runSpeedSlider").slider(
				{
					range: false,
					min: 5,
					max: 500,
					value: 10,
					slide: function(event, ui)
					{
						if (ui.value < 500)
							Runner.speedRun = 10000 / ui.value;
						else
							Runner.speedRun = 0;
						if (ui.value > 255)
						{
							Runner.animate = false;
						}
						else
						{
							Runner.animate = true;
						}
						//return false;
					}
				});
		Board.rowsBoard = rows;
		Board.colsBoard = cols;
		Board.board_head_data = {
			x: 0,
			y: 0
		};
		if (!Board.board_paper)
		{
			Board.board_paper = Raphael("BoardHolder", Board.boardDimensions.width, Board.boardDimensions.height);
			Board.board_st = Board.board_paper.set();
		}

		if (!Board.dragSquare)
		{
			Board.dragSquare = Board.board_paper.rect(0, 0, Board.boardDimensions.width, Board.boardDimensions.height);
			Board.dragSquare.attr("fill", "white");
			Board.dragSquare.attr("opacity", "0");
			Board.dragSquareSet = Board.board_paper.set();
			Board.dragSquareSet.push(Board.dragSquare);
			Board.dragSquareSet.drag(Board.onDrag, Board.startDrag, Board.endDrag);
		}

		for (var i = 0; i < Board.rowsBoard; i++)
		{
			if (!Board.boardSquares[i])
			{
				Board.boardSquares[i] = {};
			}
			if (!Board.boardABC[i])
			{
				Board.boardABC[i] = {};
			}
			for (var j = 0; j < Board.colsBoard; j++)
			{
				Board.boardABC[i][j] = AlphaBeta.blank;
				Board.updateCellGraphics(j, i, AlphaBeta.blank);
			}
		}
		Board.board_head = Board.board_paper.circle(
				50 * Board.board_head_data.x + 20,
				50 * Board.board_head_data.y + 20,
				10
				);
		Board.board_head.attr("stroke", "#fff");
		Board.board_head.attr("stroke-width", "3");
		Board.board_head.attr("fill", "#000");
		Board.board_head.attr("fill-opacity", "0.2");
		Board.board_head.node.id = "head";
		Board.board_head.node.setAttributeNS(null, "onclick", "Board.headOnclick()");

		var zoomTemp = [(Board.windowDimensions.width / ((Board.colsBoard + 1) * 50)), (Board.windowDimensions.height / ((Board.rowsBoard + 1) * 50))];
		Board.boardDimensions.zoom = zoomTemp[0] > zoomTemp[1] ? zoomTemp[1] : zoomTemp[0];
	},
	/*
	 * redraw the board
	 */
	redrawBoard: function(time, freeInChangeBoard)
	{
		var str = '';
		var zoomTemp = [Board.windowDimensions.width / Board.boardDimensions.width, Board.windowDimensions.height / Board.boardDimensions.height];
		zoomTemp = zoomTemp[0] > zoomTemp[1] ? zoomTemp[1] : zoomTemp[0];
		var zoomFactor = zoomTemp;
		var rat = zoomTemp / Board.boardDimensions.zoom;
		var xOffset = 0;

		//brings the beginning of the board to the left side of the window
		xOffset += (1 - Board.boardDimensions.zoom) * ((Board.boardDimensions.width) / 2);

		//moves the center to the center
		if (!boardVideo) {
			xOffset += 50 * (Board.boardDimensions.centerX - (Board.colsBoard + 1) / 2);
			xOffset += 50 * Board.boardDimensions.zoom * Board.colsBoard / 2 - Board.windowDimensions.width / 2;
		}

		var yOffset = 0;
		yOffset += (1 - Board.boardDimensions.zoom) * (Board.boardDimensions.height) / 2;
		if (!boardVideo) {
			yOffset += 50 * (Board.boardDimensions.centerY - (Board.rowsBoard + 1) / 2);
			yOffset += 50 * Board.boardDimensions.zoom * Board.rowsBoard / 2 - Board.windowDimensions.height / 2;
		}

		str += 'translate(' + -xOffset + 'px, ' + -yOffset + 'px) ';
		str += 'scale(' + Board.boardDimensions.zoom + ') ';

		$('#BoardHolder svg').css("-webkit-transform", str);
	},
	/*
	 * on click event on the head
	 */
	headOnclick: function()
	{
		var rec = document.getElementById("board_" + Board.board_head_data.y + "_" + Board.board_head_data.x);
		Board.cellOnclick(rec);
	},
	/*
	 * on click event on a cell
	 */
	cellOnclick: function(target)
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			return;
		}
		var indexes = target.id.substring(6, target.id.length).split('_');
		Board.boardABC[indexes[0]][indexes[1]] = AlphaBeta.selectedChar;
		Board.updateCellGraphics(indexes[1], indexes[0], AlphaBeta.selectedChar);
		Board.inChangeBoard = false;
	},
	/*
	 * update the graphic of a cell when nedded
	 */
	updateCellGraphics: function(x, y, charIndex)
	{
		if (Board.boardSquares[y] && Board.boardSquares[y][x])
		{
			Board.boardSquares[y][x].remove();
		}
		if (!AlphaBeta.ABC[charIndex])
		{
		}
		if (!AlphaBeta.ABC[charIndex])
		{
			console.log("index not exists: " + charIndex);
		}
		switch (AlphaBeta.ABC[charIndex].type)
		{
			case "color":
				var rec = Board.board_paper.rect(
						50 * x,
						50 * y,
						40,
						40
						);
				rec.node.setAttributeNS(null, 'id', "board_" + y + "_" + x);
				rec.node.setAttributeNS(null, "onclick", "Board.cellOnclick(this)");
				rec.node.setAttributeNS(null, "fill", AlphaBeta.ABC[charIndex].attr);
				Board.boardSquares[y][x] = rec;
				break;
			case "image":
				var img = Board.board_paper.image(AlphaBeta.ABC[charIndex].attr,
						50 * x,
						50 * y,
						40,
						40);
				img.node.setAttributeNS(null, 'id', "board_" + y + "_" + x);
				img.node.setAttributeNS(null, "onclick", "Board.cellOnclick(this)");
				Board.boardSquares[y][x] = img;
				break;
			case "text":
				var txt = Board.board_paper.text(Board.boardDimensions.zoom * (20 + 50 * (x - Board.boardDimensions.centerX)) + Board.boardDimensions.width / 2,
						Board.boardDimensions.zoom * (20 + 50 * (y - Board.boardDimensions.centerY)) + Board.boardDimensions.height / 2,
						"A");
				txt.attr({
					"font-size": Board.boardDimensions.zoom * 50
				});
				txt.node.setAttributeNS(null, 'id', "board_" + y + "_" + x);
				txt.node.setAttributeNS(null, "onclick", "Board.cellOnclick(this)");
				Board.boardSquares[y][x] = txt;
				break;
			default:
				alert('The type is not supported');
				return;
				break;
		}

		if (Board.board_head)
			Board.board_head.toFront();
	},
	/*
	 * save the current board
	 */
	saveBoard: function()
	{
		$("#saveBoardDialog").dialog
				(
						{
							buttons: [{
									text: "Ok",
									click: function()
									{
										Board.boardString = Board.rowsBoard + ',' + Board.colsBoard + ';';
										for (var i = 0; i < Board.rowsBoard; i++)
										{
											for (var j = 0; j < Board.colsBoard; j++)
											{
												Board.boardString += Board.boardABC[i][j] + (j != Board.colsBoard - 1 ? ',' : '');
											}
											if (i != Board.rowsBoard - 1)
											{
												Board.boardString += ';'
											}
										}
										var boardName = $("#boardNameInput").val();
										if (boardName == '')
										{
											alert('The name is empty');
											return;
										}
										//alert(HttpClient.type);
										HttpClient.saveBoard(boardName, Board.boardString, alert);
										$(this).dialog("close");
									}
								}],
							close: function(event, ui)
							{
								console.log(event, ui);
							}
						}
				);

	},
	/*
	 * get a board from the database
	 */
	getBoard: function()
	{
		var boards = null;
		var newId = null;
		$("#searchBoardDialog").dialog
				(
						{
							width: 450,
							buttons: [{
									text: "Ok",
									click: function()
									{
										$('ul').remove('#boards');
										$(this).dialog("close");
										if (boards != null && newId != null)
										{
											Board.writeBoard(boards[newId.substr(6, newId.length)]["board"]);
										}
									}
								}],
							open: function(event, ui)
							{
								$('ul').remove('#boards');
								HttpClient.getAllBoards(function(x)
								{
									boards = JSON.parse(x);
									$('ul').remove('#boards');
									var newdiv1 = $('<ul id="boards"/>');
									for (var i = 0; i < boards.length; i++)
									{
										var board = $('<li id="board_' + i + '" class="ui-widget-content">' + boards[i]["boardName"] + '</li>');
										newdiv1.append(board);
									}
									$('#boardsWrapper').append(newdiv1);
									$('#boards').selectable
											(
													{
														selected: function(event, ui)
														{
															newId = ui.selected.id;
															if ($(boards[newId.substr(6, newId.length)]))
															{
																$('#boardDescription').html(boards[newId.substr(6, newId.length)]["boardDesc"]);
															}
														}
													}
											);
								});
							},
							close: function(event, ui)
							{
								console.log(event, ui);
							}
						}
				);
	},
	/*
	 * write a board into the database
	 */
	writeBoard: function(board)
	{
		if (board == "")
		{
			return;
		}
		boardSplit = board.split(';');
		var rowsNcols = boardSplit[0].split(',');
		var rows = parseInt(rowsNcols[0]), cols = parseInt(rowsNcols[1]);
		Board.resize(rows < 10 ? 10 : rows, cols < 10 ? 10 : cols);
		var i, j;
		for (i in boardSplit)
		{
			if (i == 0)
			{
				continue;
			}
			boardSplit[i - 1] = boardSplit[i].split(',');
		}
		boardSplit.pop();
		for (i in boardSplit)
		{
			for (j in boardSplit[i])
			{
				Board.boardABC[i][j] = boardSplit[i][j];
				Board.updateCellGraphics(j, i, boardSplit[i][j]);
			}

		}
		//		console.log(Math.pow(0.8, Math.log((rows > cols ? rows : cols)/10)/Math.log(1.2))*3);
		//		Board.boardDimensions.zoom = Math.pow(0.8, Math.log((rows > cols ? ros : cols)/10)/Math.log(1.2))*3;
		//		Board.boardDimensions.zoom = 20 / (rows > cols ? rows : cols);
		Board.boardDimensions.centerX = (Board.colsBoard + 1.25) / 2;
		Board.boardDimensions.centerY = (Board.rowsBoard + 1.25) / 2;
		//console.log("Board.colsBoard = " + Board.colsBoard);
		//		Board.boardDimensions.centerX = 20;
		//Board.boardDimensions.zoom *= 1.2;
		Board.redrawBoard(500, true);
	},
    /*
     * zoom in into the center of the board
     */
	zoomIn: function()
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			return;
		}
		//Board.inChangeBoard = true ;

		Board.boardDimensions.zoom *= 1.2;
		Board.redrawBoard(500, true);
	},
    /*
     * zoom out from the board
     */
	zoomOut: function()
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			return;
		}
		//Board.inChangeBoard = true ;

		Board.boardDimensions.zoom /= 1.2;
		Board.redrawBoard(500, true);
	},
    /*
     * reset the head's position to 0,0
     */
	resetHead: function()
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			return;
		}
		var xPos = $("#headX").val();
		var yPos = $("#headY").val();
		//Board.inChangeBoard = true ;
		xPos = xPos == "" ? 0 : xPos;
		yPos = yPos == "" ? 0 : yPos;
		Runner.stopRun();
		Board.board_head_data = {
			x: xPos,
			y: yPos
		};
		Board.redrawBoard(1000, true);
	},
    /*
     * reset the board position - reset the drag and zoom actions
     */
	resetBoard: function()
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			return;
		}
		//Board.inChangeBoard = true ;

		Board.boardDimensions.centerX = 5.5;
		Board.boardDimensions.centerY = 5.5;
		Board.boardDimensions.zoom = 1.0;
		Board.redrawBoard(1000, true);
	},
    /*
     * reset the board, head and state machine
     */
	resetAll: function()
	{
		if (Runner.inStep || Board.inChangeBoard)
		{
			return;
		}
		//Board.inChangeBoard = true ;

		Runner.stopRun();
		for (var i = 0; i < Board.rowsBoard; i++)
		{
			for (var j = 0; j < Board.colsBoard; j++)
			{
				Board.boardABC[i][j] = "s0";
				Board.updateCellGraphics(i, j, "s0");
			}
		}
		Board.boardDimensions.centerX = 5.5;
		Board.boardDimensions.centerY = 5.5;
		Board.boardDimensions.zoom = 1.0;
		Board.board_head_data = {
			x: 0,
			y: 0
		};
		Board.redrawBoard(1000, true);
	},
    /*
     * release the semaphore locking the board during graphics
     */
	freeGrapficAfterAnimate: function(animateNum)
	{
		Board.animateSemaphore.take(function()
		{
			if (animateNum + 1 < Board.globalAnimateNum)
			{
				Board.globalAnimateNum++;
			}
			else
			{
				Board.globalAnimateNum = 0;
				Board.graphicSemaphore.leave();
			}
			Board.animateSemaphore.leave();
		}
		);
	},
    /*
     * increase the number of the board's rows
     */
	increaseRows: function()
	{
		Board.boardSquares[Board.rowsBoard] = {};
		Board.boardABC[Board.rowsBoard] = {};
		for (var j = 0; j < Board.colsBoard; j++)
		{
			Board.boardABC[Board.rowsBoard][j] = AlphaBeta.blank;
			Board.updateCellGraphics(j, Board.rowsBoard, AlphaBeta.blank);
		}
		Board.rowsBoard++;
	},
    /*
     * increase the number of the board's columns
     */
	increaseCols: function()
	{
		for (var i = 0; i < Board.rowsBoard; i++)
		{
			Board.boardABC[i][Board.colsBoard] = AlphaBeta.blank;
			Board.updateCellGraphics(Board.colsBoard, i, AlphaBeta.blank);
		}
		Board.colsBoard++;
	},
    /*
     * decrease the number of the board's columns
     */
	decreaseCols: function()
	{
		for (var i = 0; i < Board.rowsBoard; i++)
		{
			Board.boardSquares[i][Board.colsBoard - 1].remove();
			delete Board.boardSquares[i][Board.colsBoard - 1];
			delete Board.boardABC[i][Board.colsBoard - 1];
		}
		Board.colsBoard--;
	},
    /*
     * decrease the number of the board's rows
     */
	decreaseRows: function()
	{
		for (var j = 0; j < Board.colsBoard; j++)
		{
			Board.boardSquares[Board.rowsBoard - 1][j].remove();
		}
		delete Board.boardSquares[Board.rowsBoard - 1];
		delete Board.boardABC[Board.rowsBoard - 1];
		Board.rowsBoard--;
	},
    /*
     * resize the board
     */
	resize: function(rowsSize, colsSize)
	{
		//if(!rowsSize || !colsSize)
		//{
		//			console.log('here');
		//			$( "#resizeWrapper" ).dialog
		//			(
		//				{
		//					buttons: [ { text: "Ok", click: function()
		//							{
		//								$( this ).dialog( "close"); 
		//							} } ], 
		//					open: function(event,ui)
		//					{
		//					}
		//				}
		//			);
		//		}
		//return ;
		if (!rowsSize)
		{
			rowsSize = $("#rows_size_id").val();
		}
		if (!colsSize)
		{
			colsSize = $("#cols_size_id").val();
		}

		if (isNaN(rowsSize) || isNaN(colsSize) || rowsSize <= 0 || colsSize <= 0)
		{
			console.log("rowsSize", rowsSize, "colsSize", colsSize);
			alert('You must enter positive numbers');
			return;
		}
		if (Board.rowsBoard == rowsSize && Board.colsBoard == colsSize)
		{
			return;
		}
		var i, oldRowsBoard = Board.rowsBoard, oldColsBoard = Board.colsBoard;
		for (i = 0; i < rowsSize - oldRowsBoard; i++)
		{
			Board.increaseRows();
		}
		for (i = 0; i < oldRowsBoard - rowsSize; i++)
		{
			Board.decreaseRows();
		}
		for (i = 0; i < colsSize - oldColsBoard; i++)
		{
			Board.increaseCols();
		}
		for (i = 0; i < oldColsBoard - colsSize; i++)
		{
			Board.decreaseCols();
		}
		//		console.log(Board.rowsBoard+' '+Board.colsBoard);
	},
    /*
     * check if the head is going to be out of the board's borders.
     * if so, increase the board
     */
	checkHeadOutOfBorders: function()
	{
		if (Board.board_head_data.x < 0 || Board.board_head_data.y < 0)
		{
			return false;
		}
		if (Board.board_head_data.y >= Board.rowsBoard)
		{
			Board.increaseRows();
		}
		if (Board.board_head_data.x >= Board.colsBoard)
		{
			Board.increaseCols();
		}
		//Board.checkHeadOutOfBorders();
		return true;
	},
    /*
     * update the center point of the board's display
     * according to the command perpormed in the assembly mode
     */
	updateFocusPoint: function() {
		var pos = 0;
		var currentState = Runner.current_state.split(' ')[0];
		var laststate = Board.lastState.split(' ')[0];
		if (currentState == laststate)
			return;
		var x = Board.colsBoard;
		var y = Board.rowsBoard;
		switch (currentState) {
			case 'mover':
				pos = Board.getMaxCoordinatesInBoard('sdst');
				if (pos) {
					x = pos.x;
					y = pos.y;
					//					console.log('x = ' + x + ', y = ' + y);
				}
				pos = Board.getMaxCoordinatesInBoard('ssrc');
				if (pos) {
					x = x > pos.x ? x : pos.x;
					y = y > pos.y ? y : pos.y;
					//					console.log('x = ' + x + ', y = ' + y);
				}
				pos = Board.getMaxCoordinatesInBoard('ssrcdst');
				if (pos) {
					x = x > pos.x ? x : pos.x;
					y = y > pos.y ? y : pos.y;
					//					console.log('x = ' + x + ', y = ' + y);
				}
				x += Board.numBits + 1;
				y += 2;
				//				Board.boardDimensions.zoom = 20 / (Board.rowsBoard > Board.colsBoard ? Board.rowsBoard : Board.colsBoard);
				break;
			case 'div':
				var pos = Board.getMaxCoordinatesInBoard('ralu4');
				//				Board.boardDimensions.zoom = 40 / (Board.rowsBoard > Board.colsBoard ? Board.rowsBoard : Board.colsBoard);
				if (pos) {
					x = pos.x + Board.numBits;
					y = pos.y + 2;
				}

				break;
			default:
				//				Board.boardDimensions.zoom = 20 / (Board.rowsBoard > Board.colsBoard ? Board.rowsBoard : Board.colsBoard);
				x = Board.colsBoard;
				y = Board.rowsBoard;
				break;
		}
		//		var xRatio = Board.colsBoard / x;
		//		var yRatio = Board.rowsBoard / y;
		var xRatio = x / Board.colsBoard;
		var yRatio = y / Board.rowsBoard;
		var ratio = xRatio < yRatio ? xRatio : yRatio;
		//		Board.boardDimensions.zoom = ratio * 20 / (Board.rowsBoard > Board.colsBoard ? Board.rowsBoard : Board.colsBoard);\
		var zoomTemp = [Board.windowDimensions.width / Board.boardDimensions.width, Board.windowDimensions.height / Board.boardDimensions.height];
		zoomTemp = zoomTemp[0] > zoomTemp[1] ? zoomTemp[1] : zoomTemp[0];
//		Board.boardDimensions.zoom = ratio * (Board.rowsBoard > Board.colsBoard ? Board.rowsBoard : Board.colsBoard);
		Board.boardDimensions.zoom = zoomTemp / ratio;// * (Board.rowsBoard > Board.colsBoard ? Board.rowsBoard : Board.colsBoard);

		//4/7/2013
		xRatio = Board.windowDimensions.width / (50 * (x + 1));
		yRatio = Board.windowDimensions.height / (50 * (y + 1));
		ratio = xRatio < yRatio ? xRatio : yRatio;
		Board.boardDimensions.zoom = ratio;
		//till here

		//		Board.boardDimensions.zoom = ratio;
		if (!boardVideo) {
			Board.boardDimensions.centerX = (x + 1.5) / 2;
			//do not change the Y coordinations
			Board.boardDimensions.centerY = (y + 1.5) / 2;
		}
		if (Board.lastCenterX != Board.boardDimensions.centerX
				|| Board.lastCenterY != Board.boardDimensions.centerY
				|| Board.lastZoom != Board.boardDimensions.zoom) {
			Board.redrawBoard(2500, true);
		}
		Board.lastState = Runner.current_state;
		Board.lastCenterX = Board.boardDimensions.centerX;
		Board.lastCenterY = Board.boardDimensions.centerY;
		Board.lastZoom = Board.boardDimensions.zoom;
	},
    /*
     * get the max coordinates of the element of the board
     */
	getMaxCoordinatesInBoard: function(title) {
		var x = -1;
		var y = -1;
		for (var i = 0; i < Board.rowsBoard; i++) {
			for (var j = 0; j < Board.colsBoard; j++)
			{
				//				console.log('i = ' + i + ', j = ' + j);
				if (Board.boardABC[i][j] == title) {
					y = i > y ? i : y;
					x = j > x ? j : x;
				}
			}
		}
		return {
			x: x,
			y: y
		};
	}
}