/*
 * handles the state machine actions
 */

var presentation = false;
var boardVideo = false;
var boardVideoGraph = false;

Combinations =
{
	States: null,
	Combinations: null,
	dataCombinations: null,
	boardString: null,
	width: 0,
	height: 0,
	svg: null,
	circles: null,
	circlesData: [],
	links: null,
	linksData: [],
	tempLinksData: [],
	circleTooltip: null,
	linksTooltip: null,
	tickForScrollCounter: 0,
	lastState: 'nop',
    
    /*
     * handles the machine's file selection
     */
	handleFileSelect: function(evt)
	{
		var files = evt.target.files; // FileList object

		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++)
		{
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (
				function(theFile)
				{
					return function(e)
					{
						//HttpClient.saveProgram(theFile.name ? theFile.name : theFile.fileName, e.target.result, Combinations.emptyFunction);
						Combinations.initCombinations(e.target.result);
					};
				}
				)(f)
			;

			// Read in the image file as a data URL.
			reader.readAsText(f);
		}
	},
    /*
     * get a file as a string
     */
	getAsText: function(readFile)
	{
		var reader = new FileReader();
		reader.readAsText(readFile);
		reader.onprogress = Combinations.updateProgress;
		reader.onload = Combinations.loaded;
		reader.onerror = Combinations.errorHandler;
	},
    /*
     * update the progress in loading the file
     */
	updateProgress: function(evt)
	{
		if (evt.lengthComputable)
		{
			var loaded = (evt.loaded / evt.total);
			if (loaded < 1)
			{
			}
		}
	},
    /*
     * event function when a file has been loaded
     */
	loaded: function(evt)
	{
		var fileString = evt.target.result;
		if (utils.regexp.isChinese(fileString))
		{
		//Chinese Characters + Name validation
		}
		else
		{
		// run other charset test
		}
		Combinations.boardString = fileString;
		alert(Combinations.boardString);
		var array_of_colors = Combinations.boardString.split(" ");
		for (var i = 0; i < Board.rowsBoard; i++)
		{
			for (var j = 0; j < Board.colsBoard; j++)
			{
				var rect = document.getElementById("board_" + i + "_" + j);
				rect.setAttributeNS(null, "fill", array_of_colors[i * 10 + j]);
			}
		}
	},
    /*
     * error handler when failing to read a file
     */
	errorHandler: function(evt)
	{
		if (evt.target.error.name == "NotReadableError")
		{
			alert('The file could not be read');
		}
	},
    /*
     * initialize the combinations of the states machine
     */
	initCombinations: function(boardString)
	{
		//console.log(boardString.substr(1,100));
		if (boardString && boardString != "")
		{
			Combinations.boardString = boardString;
		}
		if (!Combinations.boardString || Combinations.boardString == "")
		{
			return;
		}

		Combinations.dataCombinations = $.csv.toArrays(Combinations.boardString);
		Combinations.Combinations = {};
		for (var i in Combinations.dataCombinations)
		{
			///ignore row of comment
			if (Combinations.dataCombinations[i][0] == 'comment')
			{
				continue;
			}

			var state = Combinations.dataCombinations[i][0];
			if (!Combinations.Combinations[state])
			{
				Combinations.Combinations[state] = {};
			}
			var input = Combinations.dataCombinations[i][1];
			Combinations.Combinations[state][input] = {
				move_to: Combinations.dataCombinations[i][2],
				output: Combinations.dataCombinations[i][3],
				new_state: Combinations.dataCombinations[i][4]
			};
		}
		Combinations.drawTable();
	},
    /*
     * drew the table represent the states machine
     */
	drawTable: function()
	{

		var tblw = document.getElementById("Program_Table_Wrapper");
		tblw.innerHTML = '';

		tbl = document.createElement("table");
		tbl.setAttribute("id", "Program_Table");
		tblw.appendChild(tbl);

		var tblh = document.createElement("tr");
		tbl.appendChild(tblh);

		var tblhh = document.createElement("th");
		tblh.appendChild(tblhh);
		var txt = document.createTextNode('state');
		tblhh.appendChild(txt);

		tblhh = document.createElement("th");
		tblh.appendChild(tblhh);
		txt = document.createTextNode('input');
		tblhh.appendChild(txt);

		tblhh = document.createElement("th");
		tblh.appendChild(tblhh);
		txt = document.createTextNode('output');
		tblhh.appendChild(txt);

		tblhh = document.createElement("th");
		tblh.appendChild(tblhh);
		txt = document.createTextNode('move to');
		tblhh.appendChild(txt);

		tblhh = document.createElement("th");
		tblh.appendChild(tblhh);
		txt = document.createTextNode('next state');
		tblhh.appendChild(txt);

		//	tbl = document.getElementById("Program_Table");
		for (var i in Combinations.Combinations)
		{
			for (var j in Combinations.Combinations[i])
			{
				var tblr = document.createElement("tr");
				tbl.appendChild(tblr);
				var tbld = document.createElement("td");
				tbld.className = "inputCol";
				tblr.appendChild(tbld);
				txt = document.createTextNode(i);
				tbld.appendChild(txt);

				tbld = document.createElement("td");
				tbld.className = "inputCol";
				tblr.appendChild(tbld);
				txt = document.createTextNode(j);
				tbld.appendChild(txt);

				tbld = document.createElement("td");
				tbld.className = "outputCol";
				tblr.appendChild(tbld);
				txt = document.createTextNode(Combinations.Combinations[i][j].output);
				tbld.appendChild(txt);

				tbld = document.createElement("td");
				tbld.className = "outputCol";
				tblr.appendChild(tbld);
				txt = document.createTextNode(Combinations.Combinations[i][j].move_to);
				tbld.appendChild(txt);

				tbld = document.createElement("td");
				tbld.className = "outputCol";
				tblr.appendChild(tbld);
				txt = document.createTextNode(Combinations.Combinations[i][j].new_state);
				tbld.appendChild(txt);
			//			alert(Combinations[i][j].move_to);
			}

		}
		//				Combinations.initGraph();
		Combinations.drawGraph();
	},
    /*
     * save one state from the user input into the states machine
     */
	saveCombination: function()
	{
		var old_state = document.getElementById("old_state_new_combination").value;
		var input = document.getElementById("input_new_combination").value;
		var move_to = document.getElementById("move_to_new_combination").value;
		var output = document.getElementById("output_new_combination").value;
		var new_state = document.getElementById("new_state_new_combination").value;

		if (!Combinations.Combinations)
		{
			Combinations.Combinations = {};
		}

		if (!Combinations.Combinations[old_state])
		{
			Combinations.Combinations[old_state] = {};
		}
		Combinations.Combinations[old_state][input] = {
			move_to: move_to,
			output: output,
			new_state: new_state
		};
		Combinations.drawTable();
	},
    /*
     * add a new state to the states machine
     */
	addState: function()
	{
		if (!Combinations.States)
		{
			Combinations.States = new Array();
		}
		Combinations.States[Combinations.States.length] = Combinations.States.length;
		document.getElementById("states_list").innerHTML = Combinations.States;
	},
    /*
     * a synchronuous read
     */
	redsync: function(filename)
	{
		var fileReaderSync = new FileReader();
		fileReaderSync.readAsText(filename);
	},
    /*
     * initialize the states machine graph
     */
	initGraph: function()
	{
		//				Combinations.width = 800;
		//				Combinations.height = 400;
		Combinations.width = 630;
		Combinations.height = 650;

		Combinations.svg = d3.select("#Machine_State").append("svg")
		.attr("width", Combinations.width)
		.attr("height", Combinations.height);

		// Per-type markers, as they don't inherit styles.
		Combinations.svg.append("svg:defs").selectAll("marker")
		.data(["arrow"])
		.enter().append("svg:marker")
		.attr("id", String)
		//.attr("viewBox", "0 -5 10 10")
		.attr("viewBox", "0 -5 10 10")
		//.attr("refX", 15)
		.attr("refX", 0)
		//.attr("refY", -1.5)
		.attr("refY", 0)
		//.attr("markerWidth", 6)
		.attr("markerWidth", 10)
		//.attr("markerHeight", 6)
		.attr("markerHeight", 10)
		.attr("orient", "auto")
		.append("svg:path")
		//.attr("d", "M0,-5L10,0L0,5");
		.attr("d", "M0,-5L10,0L0,5")
		//.attr("fill", function(d){return d3.rgb(d.color);})
		;
		Combinations.drawGraph();
	},
    /*
     * draw the states machine graph
     */
	drawGraph: function()
	{
		if (boardVideoGraph)
			return;

		if (!Combinations.svg)
			return;

		if ((isAssembler && Runner.current_state == 0) || Runner.current_state.toString().split(' ')[0] == 'read' || Runner.current_state.toString().split(' ')[0] == 'search')
		{
			Combinations.lastState = Runner.current_state;
			return;
		}

		//don't redraw the graph if the current state is in the same group as the last state
		var tempArr = Runner.current_state.toString().split(' ');
		//		var currentPrefix = tempArr.slice(0, tempArr.length-1>0?tempArr.length-1:1).join(' ');
		var currentPrefix = tempArr[0];
		tempArr = Combinations.lastState.toString().split(' ');
		//		var lastPrefix = tempArr.slice(0, tempArr.length-1>0?tempArr.length-1:1).join(' ');
		var lastPrefix = tempArr[0];
		Combinations.lastState = Runner.current_state;

		if (isAssembler && lastPrefix == currentPrefix)
			return;
		//		console.log("lastPrefix = " + lastPrefix + ", currentPrefix = " + currentPrefix);

		//remove the previous graph, if exists
		Combinations.circlesData = [];
		Combinations.linksData = [];
		if (Combinations.circles)
			Combinations.circles.remove();
		if (Combinations.links)
			Combinations.links.remove();
		if (Combinations.circleTooltip) {
			Combinations.circleTooltip.remove();
		}
		if (Combinations.linksTooltip) {
			Combinations.linksTooltip.remove();
		}

		if (isAssembler) {
			//BFS
			var checked = [];
			//				var toBeChecked = [Runner.current_state];
			var currentInput = Board.boardABC[Board.board_head_data.y][Board.board_head_data.x];
			var chara = '';
			if (typeof Combinations.Combinations[Runner.current_state] === 'undefined')
			{
				chara = Combinations.Combinations[Runner.current_state][currentInput].new_state;
			}
			else {
				if (!(typeof Combinations.Combinations[Runner.current_state][''] === 'undefined'))
					chara = Combinations.Combinations[Runner.current_state][''].new_state;
			}
			console.log(chara);
			var toBeChecked = [chara];
			var iiii = 0;
			while (toBeChecked.length > 0) {
				var cur = toBeChecked.pop();
				checked.push(cur);

				if (isNaN(iiii))
				{
					alert(iiii);
					console.log(iiii);
				}
				var tempObj = {
					id: ('cr' + cur.split(' ').join('_')),
					//										px: $.inArray(temp[i].new_state, toBeChecked),

					x: Math.random() + 50 * iiii++,
					//						x: 100,
					//										py: $.inArray(temp[i].new_state, toBeChecked),
					y: Math.random() + 50 * iiii++,
					//						y: 150,
					r: 15,
					color: "greenyellow",
					weight: 1
				};
				//					console.log(tempObj);
				Combinations.circlesData.push(tempObj);
				var o = Combinations.circlesData;
				//					console.log(o);
				//					console.log(Combinations.circlesData.length);
				//					console.log(Combinations.circlesData);
				//					console.log("cur = " + cur);
				var temp = Combinations.Combinations[cur];
				//					console.log(temp);
				//					console.log('cr' + temp.split(' ').join('_'));
				for (i in temp) {

					if ($.inArray(temp[i].new_state, checked) == -1
						&& $.inArray(temp[i].new_state, toBeChecked) == -1
						&& temp[i].new_state.split(' ')[0] != 'search'
						&& temp[i].new_state.split(' ')[0] != 'read') {
						//							console.log(temp[i]);
						toBeChecked.push(temp[i].new_state);
					//							Combinations.circlesData.push({id: ('cr' + temp[i].new_state.split(' ').join('_')), x: Math.random(Combinations.width), y: Math.random(Combinations.height), r: 15, color: "red"});
					//							var tempObj = {
					//										id: ('cr' + temp[i].new_state.split(' ').join('_')),
					////										px: $.inArray(temp[i].new_state, toBeChecked),
					////										x: $.inArray(temp[i].new_state, toBeChecked),
					//										x: 1,
					////										py: $.inArray(temp[i].new_state, toBeChecked),
					////										y: $.inArray(temp[i].new_state, toBeChecked),
					//										y: 1,
					//										r: 15,
					//										color: "red",
					//										weight: 1
					//									};
					////							console.log(tempObj);
					//							Combinations.circlesData.push(tempObj);
					//							Combinations.circlesData.push(
					//									{
					//										id: ('cr' + temp[i].new_state.split(' ').join('_')),
					////										px: $.inArray(temp[i].new_state, toBeChecked),
					////										x: $.inArray(temp[i].new_state, toBeChecked),
					//										x: 1,
					////										py: $.inArray(temp[i].new_state, toBeChecked),
					//										y: $.inArray(temp[i].new_state, toBeChecked),
					//										r: 15,
					//										color: "red",
					//										weight: 1
					//									});
					//							console.log(Combinations.circlesData);
					}
				}
			}
		//				console.log(Combinations.circlesData);

		}
		else {
			var checked = [];
			for (var i in Combinations.Combinations)
			{
				if (i == '#')
					continue;
						
				if (checked.indexOf(i) == -1) {
					Combinations.circlesData.push({
						id: ('cr' + i), 
						x: Math.random(Combinations.width), 
						y: Math.random(Combinations.height), 
						r: 15, 
						color: "greenyellow"
					});
					checked.push(i);
				}
						
				for (j in Combinations.Combinations[i]) {
					if (checked.indexOf(j.move_to) == -1) {
						Combinations.circlesData.push({
							id: ('cr' + j.move_to), 
							x: Math.random(Combinations.width), 
							y: Math.random(Combinations.height), 
							r: 15, 
							color: "greenyellow"
						});
						checked.push(j.move_to);
					}
				//							console.log(j);
				}
			}
		}

		//select foo to make sure no object is chosen and data will be applied only to the items about to be appended
		Combinations.circleTooltip = Combinations.svg.selectAll("foo")
		.data(Combinations.circlesData)
		.enter().append("text")
		.on("mouseover", function() {
			return true;
		})
		.attr("id", function(d) {
			return 'tt' + d.id;
		})
		//				.attr("x", function(d){
		//					var el = document.getElementById('tt'+d.id);
		//					var len = el.getComputedTextLength();
		//					return d.x + d.r - len;
		//				})
		//				.attr("y", function(d){return d.y - d.r;})
		.attr("font-size", 30)
		.attr("fill", "black")
		.attr("opacity", "0")
		.attr("style", "cursor:default")
		.text(function(d) {
			return d.id.toString().slice(2, d.id.toString().length).split('_').join(' ');
		})
		//				.on("mouseover", function(){return true;})
		;


		Combinations.circles = Combinations.svg.selectAll("circle")
		.data(Combinations.circlesData)
		.enter().append("circle")
		.attr("id", function(d) {
			return d.id;
		})
		.attr("cx", function(d) {
			return d.x;
		})
		.attr("cy", function(d) {
			return d.y;
		})
		.attr("r", function(d) {
			return d.r;
		})
		.attr("fill", function(d) {
			return d3.rgb(d.color);
		})
		.on("mouseover", Combinations.mouseOverCircle)
		.on("mouseout", Combinations.mouseOutCircle)
		;



		//		Combinations.svg.selectAll("text")
		//				.append("set")
		//				.attr("attributeName", "visibility")
		//				.attr("from", "hidden")
		//				.attr("to", "visible")
		//				.attr("begin", function(d){return d.id+".mouseover";})
		//				.attr("end", function(d){return d.id+".mouseout";})
		//				;

		Combinations.svg.selectAll("#cr0")
		.attr("fill", "blue");



		//create a link between two connected states. don't repeat yourself ('checked' array). don't connect a state to itself (the second 'if' condition)
		Combinations.tempLinksData = [];
		for (var i in Combinations.Combinations) {
			var checked = [];
			for (var j in Combinations.Combinations[i]) {
				//if there's already
				if (!(typeof Combinations.tempLinksData['link-' + 'cr' + i.split(' ').join('_') + '-' + 'cr' + Combinations.Combinations[i][j].new_state.split(' ').join('_')] === 'undefined')) {
					if (Combinations.tempLinksData['link-' + 'cr' + i.split(' ').join('_') + '-' + 'cr' + Combinations.Combinations[i][j].new_state.split(' ').join('_')].letters.indexOf(j) == -1)
						Combinations.tempLinksData['link-' + 'cr' + i.split(' ').join('_') + '-' + 'cr' + Combinations.Combinations[i][j].new_state.split(' ').join('_')].letters.push(j);
					continue;
				}
				if (checked.indexOf(Combinations.Combinations[i][j].new_state) == -1
					//self link
					//		& Combinations.Combinations[i][j].new_state != i
					) {
					checked.push(Combinations.Combinations[i][j].new_state);
					//                    var temp = new Object({source: Combinations.circlesData[i], target: Combinations.circlesData[Combinations.Combinations[i][j].new_state], color:"violet"});
					var sourceTemp = document.getElementById('cr' + i.split(' ').join('_'));
					//					console.log("source: ");
					//					console.log(sourceTemp);
					//					console.log(sourceTemp);
					var targetTemp = document.getElementById('cr' + Combinations.Combinations[i][j].new_state.split(' ').join('_'));
					//					console.log("target: ")
					//					console.log(targetTemp);
					//					var temp = {source: 'cr'+i, target: 'cr'+Combinations.Combinations[i][j].new_state, color:"black"};
					var temp = {
						id: 'link-' + 'cr' + i.split(' ').join('_') + '-' + 'cr' + Combinations.Combinations[i][j].new_state.split(' ').join('_'),
						letters: [j],
						source: sourceTemp,
						target: targetTemp,
						color: "black"
					};
					//					var temp = {source: Combinations.circlesData[i], target: Combinations.circlesData[Combinations.Combinations[i][j].new_state], color:"violet"};
					if (temp.source && temp.target)
					{
						//						console.log(temp.source);
						//						console.log(temp.target);
						//						Combinations.linksData.push(temp);
						Combinations.tempLinksData[temp.id] = temp;
					}
				}
			}
		}

		//copy the links data into non-associative array
		for (var i in Combinations.tempLinksData) {
			//			console.log(Combinations.tempLinksData[i].letters);
			Combinations.linksData.push(Combinations.tempLinksData[i]);
		}



		/*Combinations.circlesData = [];
				 var temp = {x:50, y:50, r:30, color:"red"};
				 Combinations.circlesData.push(temp);
				 temp = {x:50, y:150, r:20, color:"blue"};
				 Combinations.circlesData.push(temp);
				 temp = {x:350, y:100, r:15, color:"green"};
				 Combinations.circlesData.push(temp);*/

		//		if (Combinations.svg)
		//		{
		//			Combinations.circles = Combinations.svg.selectAll("circle")
		//				.data(Combinations.circlesData)
		//				.enter().append("circle")
		//				.attr("id", function(d){return d.id;})
		//				.attr("cx", function(d){return d.x;})
		//				.attr("cy", function(d){return d.y;})
		//				.attr("r", function(d){return d.r;})
		//				.attr("fill", function(d){return d3.rgb(d.color);});
		//
		//			Combinations.svg.selectAll("#cr0")
		//				.attr("fill", "blue");
		//			
		//		}


		if (!d3.layout || !Combinations.circlesData || !Combinations.linksData || !Combinations.width || !Combinations.height)
			return;

		var forceStrength = Combinations.circlesData.length < 25 ? 0.5 : 200;
		var forceCharge = Combinations.circlesData.length < 25 ? -300 : -100;

		var force = d3.layout.force()
		.nodes(Combinations.circlesData)
		.links(Combinations.linksData)
		.size([Combinations.width, Combinations.height])
		.charge(forceCharge)
		.linkDistance(40)
		.linkStrength(forceStrength)
		.on("tick", Combinations.tick)
		.alpha(0.000000001)
		.start();


		//		Combinations.linksData = [];
		//        temp = {source: Combinations.circlesData[0], target: Combinations.circlesData[1], color:"violet"};
		//        Combinations.linksData.push(temp);

		//select foo to make sure no object is chosen and data will be applied only to the items about to be appended
		Combinations.linksTooltip = Combinations.svg.selectAll("foo")
		.data(Combinations.linksData)
		.enter().append("text")
		.on("mouseover", function() {
			return true;
		})
		.attr("id", function(d) {
			return 'tt' + d.id;
		})
		.attr("font-size", 30)
		.attr("fill", "black")
		.attr("opacity", "0")
		.attr("style", "cursor:default")
		.text(function(d) {
			//						var res1 = d.source.id.toString().split('_').join(' ');
			//						res1 = res1.slice(2, res1.length);
			//						var res2 = d.target.id.toString().split('_').join(' ');
			//						res2 = res2.slice(2, res2.length);
			//						return res1 + ' -> ' +res2;
			return d.letters == '' ? '[default]' : d.letters;
		//return "test";// d.id.toString().slice(2, d.id.toString().length).split('_').join(' ');
		})
		.on("mouseover", function() {
			return true;
		})
		;

		Combinations.links = Combinations.svg.append("svg:g").selectAll("path")
		.data(Combinations.linksData)
		.enter().append("svg:path")
		.attr("id", function(d) {
			return d.id;
		})
		.attr("stroke", function(d) {
			return d3.rgb(d.color);
		})
		.attr("stroke-width", "2")
		.attr("fill", "none")
		.attr("marker-end", function(d) {
			return "url(#arrow)";
		})
		.attr("class", "test")
		.on("mouseover", Combinations.mouseOverLink)
		.on("mouseout", Combinations.mouseOutLink)
		;

		var path = Combinations.svg.append("svg:g").selectAll("path")
		.data(force.links())
		.enter().append("svg:path")
		.attr("class", function(d) {
			return "link " + d.type;
		})
		.attr("marker-end", function(d) {
			return "url(#" + d.type + ")";
		});

	//		Combinations.links = Combinations.svg.selectAll("line")
	//				.data(Combinations.linksData)
	//				.enter().append("line")
	//				.attr("stroke", "black");
	//		console.log(Combinations.linksData);
	},
    /*
     * update the states machine graph
     */
	updateGraph: function()
	{
		if (boardVideoGraph)
			return;

		if (Combinations.circles == null)
			return;

		var stateCircleId = 'cr' + Runner.current_state;
		var currentCircle = document.getElementById(stateCircleId);
		Combinations.circles.attr('fill', 'greenyellow');
		stateCircleId = '#cr' + Runner.current_state.toString().split(' ').join('_');
		//		console.log(stateCircleId);
		Combinations.svg.selectAll(stateCircleId)
		.attr("fill", "blue");
		document.getElementById('machineConsole').innerHTML = Runner.current_state;
	},
    /*
     * show boldly the element under the mouse
     */
	mouseOverCircle: function(circle)
	{
		//		console.log(circle);
		Combinations.svg.selectAll("circle:not(#" + circle.id + ")")
		.attr("opacity", "0.2");
		Combinations.svg.selectAll("path")
		.attr("opacity", "0.2");
		Combinations.svg.selectAll("#tt" + circle.id)
		.attr("opacity", "1");
	},
    /*
     * show normally the element when the mouse is out
     */
	mouseOutCircle: function(circle)
	{
		//		console.log(circle);
		Combinations.svg.selectAll("circle")
		.attr("opacity", "1");
		Combinations.svg.selectAll("path")
		.attr("opacity", "1");
		Combinations.svg.selectAll("#tt" + circle.id)
		.attr("opacity", "0");
	},
    /*
     * show boldly the link under the mouse
     */
	mouseOverLink: function(link)
	{
		//		console.log(circle);
		Combinations.svg.selectAll("path:not(#" + link.id + ")")
		.attr("opacity", "0.2");
		Combinations.svg.selectAll("circle")
		.attr("opacity", "0.2");
		Combinations.svg.selectAll("#tt" + link.id)
		.attr("opacity", "1");
	},
    /*
     * show normally the link when the mouse is out
     */
	mouseOutLink: function(link)
	{
		//		console.log(circle);
		Combinations.svg.selectAll("path")
		.attr("opacity", "1");
		Combinations.svg.selectAll("circle")
		.attr("opacity", "1");
		Combinations.svg.selectAll("#tt" + link.id)
		.attr("opacity", "0");
	},
    /*
     * one step of the graph's force animation
     */
	tick: function() {
		//				return;
		if (Combinations.circles)
			Combinations.circles
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			});

		if (Combinations.circleTooltip)
			Combinations.circleTooltip
			.attr("x", function(d) {
				var el = document.getElementById('tt' + d.id);
				//					console.log(d.id);
				//					console.log(el);
				//					if (!el) console.log(d.id);
				var len = el.getComputedTextLength();
				return d.x + d.r - len / 2;
			})
			.attr("y", function(d) {
				return d.y - 1.5 * d.r;
			});

		if (Combinations.linksTooltip)
			Combinations.linksTooltip
			.attr("x", function(d) {
				var el = document.getElementById('tt' + d.id);
				//					console.log(d.id);
				//					console.log(el);
				//					if (!el) console.log(d.id);
				var len = el.getComputedTextLength();
				return (d.source.cx.baseVal.value + d.target.cx.baseVal.value - len) / 2;
			})
			.attr("y", function(d) {
				return (d.source.cy.baseVal.value + d.target.cy.baseVal.value) / 2;
			});

		if (Combinations.links)
			Combinations.links.attr("d", function(d) {
				//				if (!d.source.r) console.log(d);
				var r = d.source.r.baseVal.value;
				var xs = d.source.cx.baseVal.value;
				var ys = d.source.cy.baseVal.value;
				var xt = d.target.cx.baseVal.value;
				var yt = d.target.cy.baseVal.value;

				// Defaults for normal edge.
				var drx = r;
				var dry = r;
				var xRotation = 0;
				// degrees
				var largeArc = 0; // 1 or 0
				var sweep = 1; // 1 or 0

				// Self edge.
				if (xs === xt && ys === yt) {
					// Fiddle with this angle to get loop oriented.
					var xRotation = -45;

					// Needs to be 1.
					var largeArc = 1;

					// Change sweep to change orientation of loop. 
					//sweep = 0;

					// Make drx and dry different to get an ellipse
					// instead of a circle.
					//							drx = 30;
					//							dry = 20;

					// For whatever reason the arc collapses to a point if the beginning
					// and ending points of the arc are the same, so kludge it.
					xt = xt + 1;
					yt = yt + 1;

					xs += 10;
					ys -= 10;
					var ra = 15;

					var x1 = xs;
					var y1 = ys;
					var x2 = xs + ra;
					var y2 = ys - ra;
					var x3 = xs + 2 * ra;
					var y3 = ys;
					var x4 = xs + 1.5 * ra;
					var y4 = ys + ra;

					var p0 = 'M' + x1 + ',' + y1 + ' ';
					var p1 = 'Q' + x1 + ',' + y2 + ' ' + x2 + ',' + y2 + ' ';
					var p2 = 'Q' + x3 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ';
					var p3 = 'Q' + x3 + ',' + y4 + ' ' + x4 + ',' + y4 + ' ';
					//var p4 = 'Q' + x1 + ',' + y4 + ' ' + x1 + ',' + y1 + ' ';

					//return "M" + xs + "," + ys + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + xt + "," + yt;
					//							return 'M'+x1+','+y1+' Q'+x1+','+y2+' '+x2+','+y2+' Q'+x2+','+y1+' '+x1+','+y1;
					return p0 + p1 + p2 + p3;// + p4;
				}
				//				console.log('xs = ' + xs + ', ys = ' + ys + ', xt = ' + xt + ', yt = ' + yt);
				//				console.log("before sqrt: "+(xt-xs)^2+(yt-ys)^2);
				var dist = Math.sqrt((xt - xs) * (xt - xs) + (yt - ys) * (yt - ys));
				var rat = r / dist;
				//				console.log('r = ' + r + ', dist = ' + dist + ', r/dist = ' + r/dist);
				//				rat = 0;
				var xStart = xs + (rat * (xt - xs));
				var yStart = ys + (rat * (yt - ys));
				var xEnd = xt - (2.5 * rat * (xt - xs));
				var yEnd = yt - (2.5 * rat * (yt - ys));

				//				var dx = d.target.x - d.source.x,
				//					dy = d.target.y - d.source.y,
				//					dr = Math.sqrt(dx * dx + dy * dy);
				//return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
				//            return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
				//				return "M" + d.source.cx.baseVal.value + "," + d.source.cy.baseVal.value + "L" + d.target.cx.baseVal.value + "," + d.target.cy.baseVal.value;
				return "M" + xStart + "," + yStart + "L" + xEnd + "," + yEnd;
			});

	/*links.attr("x1", function(d) { return d.source.x; })
				 .attr("y1", function(d) { return d.source.y; })
				 .attr("x2", function(d) { return d.target.x; })
				 .attr("y2", function(d) { return d.target.y; });*/
	},
    /*
     * one step of scroll change animation
     */
	tickForScroll: function(duration) {
		if (Combinations.tickForScrollCounter < 25)
			setTimeout("Combinations.tickForScroll(1000);", duration / 25);
		else {
			Combinations.tickForScrollCounter = 0;
			return;
		}
		Combinations.tickForScrollCounter++;
		var elem = document.getElementById('Machine_State');
		elem.scrollLeft = (elem.scrollWidth - elem.clientWidth) / 2;
		elem.scrollTop = (elem.scrollHeight - elem.clientHeight) / 2;
	},
    /*
     * search for a program in the database
     */
	searchProgram: function()
	{
		var programs = null;
		var newId = null;
		$("#searchProgramDialog").dialog
		(
		{
			width: 450,
			buttons: [{
				text: "Ok",
				click: function()
				{
					$('ul').remove('#programs');
					$(this).dialog("close");
					console.log(programs, newId);
					if (programs != null && newId != null)
					{
						console.log(programs);
						Combinations.initCombinations(programs[newId.substr(8, newId.length)]["program"]);
					//console.log(programs[newId.substr(8, newId.length)]["program"]);
					}
				}
			}],
			open: function(event, ui)
			{
				$('ul').remove('#programs');
				HttpClient.getAllPrograms(function(x)
				{
					if(x=="you must login")
					{
						alert("you must login");
						$("#searchProgramDialog").dialog("close");
						return ;
					}
					programs = JSON.parse(x);
					$('ul').remove('#programs');
					var newdiv1 = $('<ul id="programs"/>');
					for (var i = 0; i < programs.length; i++)
					{
						var program = $('<li id="program_' + i + '" class="ui-widget-content">' + programs[i]["programName"] + '</li>');
						newdiv1.append(program);
					}
					$('#programsWrapper').append(newdiv1);
					$('#programs').selectable
					(
					{
						tolerance: "fit",
						selecting: function(event, ui)
						{
							$(event.target).find('.ui-selectee.ui-selecting').not(ui.selecting).removeClass('ui-selecting');
							$(event.target).find('.ui-selectee.ui-selected').not(ui.selecting).removeClass('ui-selected');
						},
						selected: function(event, ui)
						{

							console.log(ui.selected);
							newId = ui.selected.id;
							console.log(newId);
							if ($(programs[newId.substr(8, newId.length)]))
							{
								$('#programDescription').html(programs[newId.substr(8, newId.length)]["programDesc"]);
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
     * save a program in the database
     */
	saveProgram: function()
	{
		$("#saveProgramDialog").dialog
		(
		{
			buttons: [{
				text: "Ok",
				click: function(x)
				{
					var program = "";
					if (!Combinations.Combinations)
					{
						alert('No program to save');
						$(this).dialog("close");
						return;
					}
					console.log(Combinations.Combinations);
					for (var state in Combinations.Combinations) {
						var stateName = state.toString();
						for (var input in Combinations.Combinations[state]) {
							var inputName = input.toString();
							program += stateName + "," + inputName + ","
							+ Combinations.Combinations[state][input].move_to + ','
							+ Combinations.Combinations[state][input].output + ','
							+ Combinations.Combinations[state][input].new_state + "\n";
						}
					}
					var programName = $("#programNameInput").val();
					var programDesc = $("#programDescInput").val();
					if (programName == '')
					{
						alert('The name is empty');
						return;
					}
					//alert(HttpClient.type);
					HttpClient.saveProgram(programName, programDesc, program, function(x) {
						if (x == "you must login")
						{
							alert("you must login");
						}
					});
					$(this).dialog("close");
				}
			}],
			open: function(event, ui)
			{
				$('#saveProgramDialog #programNameInput').val('');
				$('#saveProgramDialog #programDescInput').val('');
			},
			close: function(event, ui)
			{
				$('#saveProgramDialog #programNameInput').val('');
				$('#saveProgramDialog #programDescInput').val('');
			}
		}
		);
	},
    /*
     * empty function for drag events
     */
	emptyFunction: function() {
	}

}