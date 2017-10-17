/*
 * handles the running head
 */

Runner = {
	current_state: '0',
	speedRun: 1000,
	runState: "stop",
	inStep: false,
	animate: true,
    
    /*
     * start the head's running
     */
	run: function()
	{
		if (presentation)
			boardVideo = true;
		Runner.runState = "run";
		$("#pause").prop("disabled", false);
		$("#pause").html($("#pause").html().replace("rerun", "pause"));
		Runner.runState = "run";
		var startState = $("#startState").val();
		startState = (startState == "" || startState == undefined) ? 0 : startState;
		Runner.current_state = startState;

		if (!isAssembler)
		{
			$('#AlphaBeta_Wrapper').hide({
				effect: "Clip",
				delay: 1000
			});
			setTimeout("$('#Program_Wrapper').css('width', '" + Const.ProgramWrapperWidthWide + "');", 300);
			Combinations.tickForScroll(1000);
		}
		//		var elem = document.getElementById('Machine_State');
		//		elem.scrollLeft = (elem.scrollWidth-elem.clientWidth)/2;
		//		elem.scrollTop = (elem.scrollHeight-elem.clientHeight)/2;

		setTimeout(Runner.step_run, 2000);
	},
    
    /*
     * stop the head's running
     */
	stopRun: function()
	{
		if (presentation)
			boardVideo = false;
		console.log(boardVideo);
		Runner.inStep = false;
		$("#pause").prop("disabled", true);
		Runner.runState = "stop";

		var options = {
			label: "play",
			icons: {
				primary: "ui-icon-play"
			}
		};
		$('#playButton').button("option", options);

		$("#pause").html($("#pause").html().replace("rerun", "pause"));

		if (!isAssembler)
		{
			setTimeout("$('#AlphaBeta_Wrapper').show({effect: 'Clip', delay: 1000});", 600);
			$('#Program_Wrapper').css("width", Const.ProgramWrapperWidthNarrow);
			Combinations.tickForScroll(1000);
		}
	},
    
    /*
     * pause the head's running
     */
	pause: function()
	{
		if (Runner.runState == "run")
		{
			if (presentation)
				boardVideo = false;

			Runner.runState = "pause";
			//Board.inChangeBoard = false ;
			Runner.inStep = false;
			$("#pause").html($("#pause").html().replace("pause", "rerun"));

			if (!isAssembler)
			{
				setTimeout("$('#AlphaBeta_Wrapper').show({effect: 'Clip', delay: 1000});", 600);
				$('#Program_Wrapper').css("width", Const.ProgramWrapperWidthNarrow);
				Combinations.tickForScroll(1000);
			}
		}
		else if (Runner.runState == "pause")
		{
			if (presentation)
				boardVideo = true;

			$("pause").html("pause");
			Runner.runState = "run";
			$("#pause").html($("#pause").html().replace("rerun", "pause"));
			Runner.step_run();

			if (!isAssembler)
			{
				$('#AlphaBeta_Wrapper').hide({
					effect: "Clip",
					delay: 1000
				});
				setTimeout("$('#Program_Wrapper').css('width', '" + Const.ProgramWrapperWidthWide + "');", 300);
				Combinations.tickForScroll(1000);
			}
		}
	},
    
    /*
     * one step of the head's running
     */
	step_run: function()
	{
		if (Board.inChangeBoard)
		{
			setTimeout('Runner.step_run()', 100);
			return;
		}
		if (Runner.runState == "run")
		{
			Runner.inStep = true;
			var currentInput = Board.boardABC[Board.board_head_data.y][Board.board_head_data.x];

			if (!Combinations.Combinations || !Combinations.Combinations[Runner.current_state])
			{
				Runner.stopRun();

				return;
			}
			//if not declared defined behaviour and defined general behaviour
			//the checking is on demand and not to all chars.
			if (!Combinations.Combinations[Runner.current_state][currentInput] && Combinations.Combinations[Runner.current_state][""])
			{
				Combinations.Combinations[Runner.current_state][currentInput] = Combinations.Combinations[Runner.current_state][""];
			}
			if (!Combinations.Combinations[Runner.current_state][currentInput])
			{
				Runner.stopRun();

				return;
			}

			if (Combinations.Combinations[Runner.current_state][currentInput].output != '')
			{
				Board.boardABC[Board.board_head_data.y][Board.board_head_data.x] = Combinations.Combinations[Runner.current_state][currentInput].output;
				Board.updateCellGraphics(Board.board_head_data.x, Board.board_head_data.y, Combinations.Combinations[Runner.current_state][currentInput].output);
			}


			switch (Combinations.Combinations[Runner.current_state][currentInput].move_to)
			{
				case 'u':
					Board.board_head_data.y--;
					break;
				case 'uu':
					Board.board_head_data.y--;
					Board.board_head_data.y--;
					break;
				case 'd':
					Board.board_head_data.y++;
					break;
				case 'dd':
					Board.board_head_data.y++;
					Board.board_head_data.y++;
					break;
				case 'r':
					Board.board_head_data.x++;
					break;
				case 'rr':
					Board.board_head_data.x++;
					Board.board_head_data.x++;
					break;
				case 'l':
					Board.board_head_data.x--;
					break;
				case 'll':
					Board.board_head_data.x--;
					Board.board_head_data.x--;
					break;
			}
			if (isAssembler) {
				Combinations.drawGraph();
			}

			Combinations.updateGraph();
			if (!Board.checkHeadOutOfBorders())
			{
				Runner.stopRun();
				Runner.inStep = false;
				return;
			}
			//            Combinations.svg.selectAll('#c'+Runner.current_state)
			//                .attr("fill", "red");
			Runner.current_state = Combinations.Combinations[Runner.current_state][currentInput].new_state;
			//            Combinations.svg.selectAll('#c'+Runner.current_state)
			//                .attr("fill", "blue");

			if (Runner.animate == true)
			{
				Board.board_head.animate({
					//					cx: (Board.boardDimensions.zoom * (40 + 50 * (Board.board_head_data.x - Board.boardDimensions.centerX)) + Board.boardDimensions.width / 2),
					//					cy: (Board.boardDimensions.zoom * (40 + 50 * (Board.board_head_data.y - Board.boardDimensions.centerY)) + Board.boardDimensions.height / 2)
					cx: 50 * Board.board_head_data.x + 20,
					cy: 50 * Board.board_head_data.y + 20
				},
				0.8 * Runner.speedRun, "ease-in-out", function() {
					Runner.inStep = false;
				});
				setTimeout('Runner.step_run()', Runner.speedRun);
			}
			else
			{
				//				Board.board_head.attr("cx", (Board.boardDimensions.zoom * (40 + 50 * (Board.board_head_data.x - Board.boardDimensions.centerX)) + Board.boardDimensions.width / 2));
				//				Board.board_head.attr("cy", (Board.boardDimensions.zoom * (40 + 50 * (Board.board_head_data.y - Board.boardDimensions.centerY)) + Board.boardDimensions.height / 2));
				Board.board_head.attr("cx", 50 * Board.board_head_data.x + 20);
				Board.board_head.attr("cy", 50 * Board.board_head_data.y + 20);
				setTimeout('Runner.step_run()', Runner.speedRun);
				//				Board.redrawBoard();
			}
			//			setTimeout('Runner.step_run()', Runner.speedRun);
		}

		Board.updateFocusPoint();

	}

}