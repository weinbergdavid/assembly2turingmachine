/*
 * handles the assembler which translates the assembler to turing
 */
Assembler =
	{
		bitsNum: 16,
		height: 26,
		width: null,
		maxHeight : 26,
		alu2regs: ["adc", "add", "and", "cmp", "sub", "xor", "or", "cmp"],
		alu1reg: ["not"],
		regs: ["ax", "bx", "cx", "dx"],
		jmpArr: ["jmp", "jz", "jnae", "jb", "je", "jnz", "jne", "jnb", "jae", "jna", "jbe", "ja", "jnbe", "jl", "jnge", "jge", "jnl", "jle", "jng", "jg", "jnle"],
		aluPos: null,
		aluWidth: null,
		regPos: null,
		regWidth: null,
		memPos: null,
		memWidth: null,
		stackPos: null,
		stackWidth: null,
		codePos: null,
		codeWidth: null,
		p1Pos: null,
		p1Width: null,
		p2Pos: null,
		p2Width: null,
		/*
		 * initialize the assmebler
		 * 
		 * @returns {undefined}
		 */
		init: function()
		{
			$(".jqueriuiButton").button();
			$( "#searchProgram" ).button({
				text: false,
				icons: {
					primary: "ui-icon-folder-open"
				}
			});
			$( "#saveProgram" ).button({
				text: false,
				icons: {
					primary: "ui-icon-disk"
				}
			});
			$( "#Help" ).button({
				text: true,
				label: "Help",
				icons: {
					primary: "ui-icon-info"
				}
			}).click(function()
			{
				$('#HelpDialog').dialog(
				{
					create: function( event, ui ) 
					{
					},
					width:100,
					height:100,
					buttons: [{
						text: "Ok",
						click: function()
						{
							$(this).dialog("close");
						}
					}],
					open: function(event, ui)
					{
					},
					close: function(event, ui)
					{
					}
				});
			});
			$( "#Feedback" ).button({
				text: true,
				label: "Feedback"
			}).click(function()
			{
				window.open("https://docs.google.com/forms/d/1t06c-HicyIy9DoB7ImLOldTPStc_fmmJ5H8mJDwzoyg/viewform");
			});
		},
		/*
		 * set the components according to the byte width
		 * 
		 * @returns {Boolean}
		 */
		setWidthNPos: function()
		{
			var bits = parseInt($("#bitsNum").val());
			if (bits == "" || !jQuery.isNumeric(bits) || (bits & (bits - 1)) != 0 || bits < 4)
			{
				bits = 4;
			}

			var memSize = parseInt($("#memSize").val());
			var codeLength =  parseInt($("#codeArea").val().split("\n").filter(function(row){
				if(row == "") return false;
				return true;
			}).length);
			if (memSize == "" || !jQuery.isNumeric(memSize) || memSize < 0 )
			{
				/*alert("nuber of bits must be a positive power of 2.");
					 return false;*/
				memSize = 10;
			}
			Assembler.memSize = memSize  > Assembler.maxHeight-5 ? Assembler.maxHeight-5 :  memSize ;
			if(codeLength  > Assembler.maxHeight-6)
			{
				alert('the max rows in code is '+(Assembler.maxHeight-6));
				return false;
			}
			Assembler.height = Assembler.height < codeLength+6 ? codeLength+6 : Assembler.height ;
			Assembler.height = Assembler.height > Assembler.memSize ? Assembler.height : Assembler.memSize ;
			Assembler.bitsNum = bits;
			Assembler.aluPos = 2 + bits;
			Assembler.aluWidth = Assembler.bitsNum;
			Assembler.regPos = Assembler.aluPos + Assembler.aluWidth + 1;
			Assembler.regWidth = Assembler.bitsNum;
			Assembler.memPos = Assembler.regPos + Assembler.regWidth + 2;
			Assembler.memWidth = Assembler.bitsNum;
			Assembler.stackPos = Assembler.memPos + Assembler.memWidth + 1;
			Assembler.stackWidth = Assembler.bitsNum;
			//without stack
			Assembler.codePos = Assembler.memPos + Assembler.memWidth + 2;
			//With stack
			//Assembler.codePos = Assembler.stackPos + Assembler.stackWidth + 1;
			Assembler.codeWidth = 9+Assembler.bitsNum*2;
			Assembler.width = 1 + Assembler.codePos + Assembler.codeWidth;	
			return true;
		},
		/*
		 * draw the board
		 */
		creatBoard: function(goToBoard)
		{
			if (!Assembler.setWidthNPos())
			{
				return;
			}
			commands = Assembler.parseCode();
			if (!goToBoard)
			{
				return;
			}
			if (!commands)
			{
				return;
			}
			var board = new Array();
			//fill all matrix in s0.
			for (var i = 0; i < Assembler.height; i++)
			{
				board[i] = new Array();
				for (var j = 0; j < Assembler.width; j++)
				{
					board[i][j] = 's0';
				}
			}
			//first and last column
			for (i = 0; i < Assembler.height; i++)
			{
				board[i][0] = 'c0';
				board[i][Assembler.width] = 'c0';
			}
			//ALU
			board[1][Assembler.aluPos] = "talu";
			board[2][Assembler.aluPos] = "rflags";
			board[3][Assembler.aluPos] = "talu";
			for (j = Assembler.aluPos; j < Assembler.aluPos + Assembler.aluWidth; j++)
			{
				board[3][j] = 'n0';
				board[4][j] = 'n0';
			}
			for (i = 0; i < 4; i++)
			{
				board[5 + 2 * i][Assembler.aluPos] = 'ralu' + (i + 1);
				for (j = Assembler.aluPos; j < Assembler.aluPos + Assembler.aluWidth; j++)
				{
					board[6 + 2 * i][j] = 'n0';
				}
			}
			//Reg
			board[1][Assembler.regPos] = "tregs";
			for (i = 0; i < 4; i++)
			{
				var reg = "";
				switch (i)
				{
					case 0:
						reg = "rax";
						break;
					case 1:
						reg = "rbx";
						break;
					case 2:
						reg = "rcx";
						break;
					case 3:
						reg = "rdx";
						break;
					default:
						break;
				}
				board[2 + i * 2][Assembler.regPos] = reg;
				for (j = Assembler.regPos; j < Assembler.regPos + Assembler.regWidth; j++)
				{
					board[3 + i * 2][j] = 'n0';
				}
			}
			//Memory
			console.log(Assembler.memSize);
			console.log(Assembler.height);
			board[1][Assembler.memPos] = "tmemory";
			for (i = 0; i < Assembler.memSize; i++)
			{
				for (j = 0; j < Assembler.bitsNum; j++)
				{
					board[2 + i][Assembler.memPos + j] = "n0";
				}
			}
			//Stack
			//board[1][Assembler.stackPos] = "tstack";
			
			//Code
			board[1][Assembler.codePos] = "tcode";
			board[3][Assembler.codePos - 1] = "rip";
			for (i = 0; i < Assembler.bitsNum; i++)
			{
				board[2][Assembler.codePos + i] = "n0";
			}

			//comands
			var l = 0 ;
			for (i in commands)
			{
				j = 0;
				if(commands[i]["c1"] === undefined)
				{
					continue ;
				}
				for (var ci in commands[i])
				{
					if (ci != "p1" && ci != "p2")
					{
						board[l + 3][Assembler.codePos + j] = "o" + commands[i][ci];
						j++;
					}
				}
				if (commands[i].p1)
				{
					j++;
					for (var k = 0; k < commands[i].p1.length; k++)
					{
						board[l + 3][Assembler.codePos + j] = "n" + commands[i].p1.charAt(k);
						j++;
					}
				}
				if (commands[i].p2)
				{
					j++;
					for (var k = 0; k < commands[i].p2.length; k++)
					{
						board[l + 3][Assembler.codePos + j] = "n" + commands[i].p2.charAt(k);
						j++;
					}
				}
				l++;
			}
			board[l + 3][Assembler.codePos] = "ostop";

			//first and last row
			for (i = 0; i < Assembler.width; i++)
			{
				board[0][i] = 'c0';
				board[Assembler.height-1][i] = 'c0';
			}
			var boardString = "";
			boardString += Assembler.height + "," + Assembler.width + ";";
			for (i = 0; i < Assembler.height; i++)
			{
				boardString += board[i] + ";";
			}
			boardString = boardString.substr(0, boardString.length - 1);
			$("#boardString").val(boardString);
			document.forms["createBoard"].submit();
			return;
		},
		/*
		 * convert the assembler to turing
		 */
		parseCode: function()
		{
			var code = $("#codeArea").val().split("\n");
			var commands = {};
			for (i in code)
			{
				var command = Assembler.parseRow(code[i]);
				if (!command)
				{
					alert("row " + i + " not supported");
					return null;
				}
				else
				{
					if(command.index)
					{
						delete command.index ;
					}
					commands[i] = command;
				}
			}
			return commands;
		},
		/*
		 * parse one row of code
		 */
		parseRow: function(row)
		{
			row = row.replace(","," ")
			.replace(/^\s+|\s+$/g, "")//trim
			.replace("\t", " ")//tab to space
			.replace(/\s{2,}/g, ' ')//duplicate space
			.toLowerCase()
			//[ BX + DI + 4 ] to [BX+DI+4]
			.replace("[ ", "[")
			.replace(" ]", "]")
			.replace(" +", "+")
			.replace("+ ", "+")
			;
			rowWords = row.split(" ");
			if (row == "")
				return {};
			if ($.inArray(rowWords[0], Assembler.alu2regs) !== -1)
			{
				return Assembler.parseCommands.alu2regsBuilder(rowWords);
			}
			if ($.inArray(rowWords[0], Assembler.alu1reg) !== -1)
			{
				return Assembler.parseCommands.alu1regsBuilder(rowWords);
			}
			if ($.inArray(rowWords[0], Assembler.jmpArr) !== -1)
			{
				return Assembler.parseCommands.jmp(rowWords);
			}
			switch (rowWords[0])
			{
				case "mov":
					return Assembler.parseCommands.mov(rowWords);
					break;
				case "inc":
				case "dec":
					return Assembler.parseCommands.inc(rowWords);
					break;
				case "mul":
					return Assembler.parseCommands.mul(rowWords);
					break;
				case "div":
					return Assembler.parseCommands.div(rowWords);
					break;
				default:
					return null;
					break;
			}
		},
		/*
		 * parse the code
		 */
		parseCommands:
		{
			mov : function(words)
			{
				var c1 = null, c2 = null, p1 = null, p2 = null, opsNum = 4, src = false, dst = false;
				if (words.length > 3)
				{
					return null;
				}
				command = {
					index: 1,
					p1 : null,
					p2 : null 
				};
				//memory
				var temp = this.parseMemory(words[2],command,"src");
				if (temp)
				{
					command = temp;
					src = true;
				}
				temp = this.parseMemory(words[1],command,"dst");
				if (temp)
				{
					command = temp;
					dst = true;
				}
				//regs
				if ($.inArray(words[2], Assembler.regs) != -1)
				{
					command["c" + (command.index++)] = "mark " + words[2] + " src";
					src = true;
				}
				if ($.inArray(words[1], Assembler.regs) != -1)
				{
					command["c" + (command.index++)] = "mark " + words[1] + " dst";
					dst = true;
				}

				//constants
				var n2 = Assembler.parseCommands.parseNumber(words[2]);
				var n1 = Assembler.parseCommands.parseNumber(words[1]);
				if(n1 && n2)
				{
					return null ;
				}
				if(n2 != null)
				{
					command = this.addP2command(command,n2,"src");
					src = true ;
				}
				if(n1 != null)
				{
					command = this.addP2command(command,n1,"dst");
					dst = true ;
				}
				if (!src || !dst )
				{
					return null;
				}
				command["c" + (command.index++)] = "mover";
				
				return  command;
			},
			/*
			 * parse the INC command
			 */
			inc: function(words)
			{
				var c1 = null, c2, c3, c4, c5, c6, c7, c8, c9, c10, p1, p2 = null;
				if (words.length > 2)
				{
					return null;
				}
				if ($.inArray(words[1], Assembler.regs) != -1)
				{
					c1 = "mark " + words[1] + " src";
					c2 = "mark alu1 dst";
					c3 = "mover";
					c4 = "mark p1 src";
					c5 = "mark alu2 dst";
					c6 = "mover";
					c7 = "inc";
					c8 = "mark alu3 src";
					c9 = "mark " + words[1] + " dst";
					c10 = "mover";
					if (words[0] == "inc")
					{
						p1 = this.zeroPadding("1");
					}
					else
					{
						p1 = this.onePadding("1");
					}
				}
				if (!c1)
				{
					return null;
				}
				var command = {
					"c1": c1,
					"c2": c2,
					"c3": c3,
					"c4": c4,
					"c5": c5,
					"c6": c6,
					"c7": c7,
					"c8": c8,
					"c9": c9,
					"c10": c10,
					"p1": p1,
					"p2": p2
				};
				//			console.log(command);
				return  command;

			},
			/*
			 * parse the MUL command
			 */
			mul: function(words)
			{
				var c1 = null, c2 = null, p1 = null, p2 = null, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13;
				if (words.length > 2)
				{
					return null;
				}
				//mark BX src	mark ALU1 dest	mover

				if ($.inArray(words[1], Assembler.regs) != -1)
				{
					c1 = "mark " + words[1] + " src";

				}
				c2 = "mark alu1 dst", c3 = "mover", c4 = "mark ax src",
				c5 = "mark alu2 dst", c6 = "mover", c7 = words[0], c8 = "mark alu3 src",
				c9 = "mark ax dst", c10 = "mover", c11 = "mark alu4 src",
				c12 = "mark dx dst", c13 = "mover";
				p1 = Assembler.parseCommands.parseNumber(words[2]);
				if (p1)
				{
					c1 = "mark p1 src";
				}

				if (!c1)
				{
					return null;
				}
				var command = {};
				for (var i = 1; i <= 13; i++)
				{
					command["c" + i] = eval("c" + i);
				}
				command["p1"] = p1;
				command["p2"] = p2;
				//			console.log(command);
				return  command;
			},
			/*
			 * parse the DIV command
			 */
			div: function(words)
			{
				var c1 = null, c2 = null, p1 = null, p2 = null, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16;
				if (words.length > 2)
				{
					return null;
				}
				//mark BX src	mark ALU1 dest	mover
				c1 = "mark dx src", c2 = "mark alu1 dst", c3 = "mover",
				c4 = "mark ax src", c5 = "mark alu2 dst", c6 = "mover";
				if ($.inArray(words[1], Assembler.regs) != -1)
				{
					c7 = "mark " + words[1] + " src";

				}
				c8 = "mark alu3 dst", c9 = "mover", c10 = words[0], c11 = "mark alu3 src",
				c12 = "mark ax dst", c13 = "mover", c14 = "mark alu4 src",
				c15 = "mark dx dst", c16 = "mover";
				p1 = Assembler.parseCommands.parseNumber(words[2]);
				if (p1)
				{
					c1 = "mark p1 src";
				}

				if (!c1)
				{
					return null;
				}
				var command = {};
				for (var i = 1; i <= 16; i++)
				{
					command["c" + i] = eval("c" + i);
				}
				command["p1"] = p1;
				command["p2"] = p2;
				//			console.log(command);
				return  command;
			},
			/*
			 * parse the JMP command
			 */
			jmp: function(words)
			{
				words[0] = words[0].replace("^jz$", "je")
				.replace("^nz$", "jne")
				.replace("^jnb$", "jae")
				.replace("^jna$", "jbe")
				.replace("^jnbe$", "ja")
				.replace("^jnge$", "jl")
				.replace("^jnl$", "jge")
				.replace("^jle$", "jng")
				.replace("^jg$", "jnle");

				var c1, c2, c3, c4, c5, c6, c7, p1 = null, p2 = null, opsNum = 4;
				if (words.length > 2)
				{
					return null;
				}
				p1 = Assembler.parseCommands.parseNumber(words[1]);
				if (!p1)
				{
					return null;
				}
				var i = 1;
				if (words[0] != 'jmp')
				{
					c1 = words[0], c2 = "mark p1 src", c3 = "mark code dst", c4 = "mover", c5 = "jmp";
					opsNum++;
				}
				else
				{
					c1 = "mark p1 src", c2 = "mark code dst", c3 = "mover", c4 = "jmp";
				}
				command = {};
				for (i = 1; i <= opsNum; i++)
				{
					command["c" + i] = eval("c" + i);
				}
				command["p1"] = p1;
				command["p2"] = p2;
				return command;
			},
			/*
			 * build the ALUs
			 */
			alu1regsBuilder: function(words)
			{
				var c1, c2, c3, c4, c5, c6, c7, p1 = null, p2 = null;
				if (words.length > 2)
				{
					return null;
				}

				if ($.inArray(words[1], Assembler.regs) != -1)
				{
					c1 = "mark " + words[1] + " src";
					c2 = "mark alu1 dst";
				}
				c3 = "mover", c4 = words[0], c5 = "mark alu3 src",
				c6 = "mark " + words[1] + " dst", c7 = "mover";
				if (!c1)
				{
					return null;
				}
				var command = {};
				for (var i = 1; i <= 7; i++)
				{
					command["c" + i] = eval("c" + i);
				}
				command["p1"] = p1;
				command["p2"] = p2;
				//			console.log(command);
				return  command;
			},
			alu2regsBuilder: function(words)
			{
				var c1 = null, c2 = null, p1 = null, p2 = null, opsNum = 7;
				if (words.length > 3)
				{
					return null;
				}
				//mark BX src	mark ALU1 dest	mover

				if ($.inArray(words[1], Assembler.regs) != -1)
				{
					c1 = "mark " + words[1] + " src";
					c2 = "mark alu1 dst";
				}
				var c3 = "mover"
				if ($.inArray(words[2], Assembler.regs) != -1)
				{
					c4 = "mark " + words[2] + " src";
				}

				var c5 = "mark alu2 dst", c6 = "mover", c7 = words[0].replace("cmp", "sub");
				if (words[0] != "cmp")
				{
					var c8 = "mark alu3 src", c9 = "mark " + words[1] + " dst", c10 = "mover";
					opsNum += 3;
				}
				p1 = Assembler.parseCommands.parseNumber(words[2]);
				if (p1)
				{
					c4 = "mark p1 src";
				}

				if (!c1 || !c4)
				{
					return null;
				}
				var command = {};
				for (var i = 1; i <= opsNum; i++)
				{
					command["c" + i] = eval("c" + i);
				}
				command["p1"] = p1;
				command["p2"] = p2;
				//	var command = {"c1":c1,"c2":c2,"c3":c3,"p1":p1,"p2":p2} ;
				//			console.log(command);
				return  command;
			},
			/*
			 * convert hexadecimal number to a binary one
			 */
			exe2binary: function(word)
			{
				return word.replace("0x", "")
				.split("0").join("0000")
				.split("1").join("0001")
				.split("2").join("0010")
				.split("3").join("0011")
				.split("4").join("0100")
				.split("5").join("0101")
				.split("6").join("0110")
				.split("7").join("0111")
				.split("8").join("1000")
				.split("9").join("1001")
				.split("a").join("1010")
				.split("b").join("1011")
				.split("c").join("1100")
				.split("d").join("1101")
				.split("e").join("1110")
				.split("f").join("1111");
			},
			/*
			 * convert decimal number to a binary one
			 */
			dec2binary: function(word)
			{
				word = parseInt(word);
				if (word >= 0)
				{
					return "0" + word.toString(2);
					//				  .padleft(Assembler.bitsNum, "0");
					console.log(word.toString(2));
				}
				//// else
				return "1" + (-word - 1)
				.toString(2)
				.replace(/[01]/g, function(d) {
					return +!+d;
				}); // hehe: inverts each char;
			},
			/*
			 * parse command with memory access
			 */
			parseMemory: function(word, object, dir)
			{
				if (word.charAt(0) != "[" || word.charAt(word.length - 1) != "]")
				{
					return null;
				}
				word = word.substr(1, word.length - 2);
				var p = this.parseNumber(word) ;
				if ($.inArray(word, Assembler.regs) != -1)
				{
					command["c" + (command.index++)] = "mark " + word + " src";
				}
				else if (p != null)
				{
					command = this.addP2command(command,p,"src");
				}
				else
				{
					return null;
				}
				command["c" + (command.index++)] = "mark start mem dst";
				command["c" + (command.index++)] = "mover";
				command["c" + (command.index++)] = "access mem";
				command["c" + (command.index++)] = "mark mem " + dir;
				return object;
			},
			/*
			 * add parameter to a command
			 */
			addP2command : function(command,p,dir)
			{
				if (!command["p1"])
				{
					command["p1"] = p;
					command["c" + (command.index++)] = "mark p1 " + dir;
				}
				else if (!command["p2"])
				{
					command["p2"] = p;
					command["c" + (command.index++)] = "mark p2 " + dir;
				}
				else
				{
					throw "2 params are not null";
				}
				return command ;
			},
			/*
			 * parse a number
			 */
			parseNumber : function(word)
			{
				if (!jQuery.isNumeric(word))
				{
					return null;
				}
				var num = null;
				if (word.indexOf("0x") == 0)
				{
					num = Assembler.parseCommands.exe2binary(word.substr(2, word.length));
				}
				else
				{
					num = Assembler.parseCommands.dec2binary(word);
				}
				//reduce leeding zero
				var i = 0;
				for (; i < num.length; i++)
				{
					if (num.charAt(i) != "0")
						break;
				}
				if (i > 0)
				{
					num = num.substr(i - 1, num.length);
					num = this.zeroPadding(num);
				}

				for (i = 0; i < num.length; i++)
				{
					if (num.charAt(i) != "1")
						break;
				}
				if (i > 0)
				{
					num = num.substr(i - 1, num.length);
					num = this.onePadding(num);
				}
				if (num.length > Assembler.bitsNum)
					return null;
				console.log("num: "+num);
				return num;
			},
			/*
			 * pad with zeros
			 */
			zeroPadding: function(num)
			{
				var s = "";
				for (var i = num.length; i < Assembler.bitsNum; i++)
				{
					s += "0";
				}
				//			console.log("zero padding:"+ s + num);
				return s + num;
			},
			/*
			 * pad with ones
			 */
			onePadding: function(num)
			{
				//			console.log("num bits:"+ Assembler.bitsNum);
				//			console.log("num length:"+ num.length);
				var s = "";
				for (var i = num.length; i < Assembler.bitsNum; i++)
				{
					s += "1";
				}
				//			console.log("one padding:"+ s + num);
				return s + num;
			}
		},
		/*
		 * search program in the programs database
		 */
		searchProgram : function()
		{
			var programs = null;
			var newId = null;
			$("#searchProgramDialog").dialog
			(
			{
				create: function( event, ui ) 
				{
				},
				width: 450,
				buttons: [{
					text: "Ok",
					click: function()
					{
						$('ul').remove('#programs');
						$(this).dialog("close");
						console.log(programs,newId);
						if (programs != null && newId != null)
						{
							console.log($("#codeArea").val());
							$("#codeArea").val(programs[newId.substr(8, newId.length)]["program"]);
						//Combinations.initCombinations(programs[newId.substr(8, newId.length)]["program"]);
						//console.log(programs[newId.substr(8, newId.length)]["program"]);
						}
					}
				}],
				open: function(event, ui)
				{
					$('#programDescription').html('');
					$('ul').remove('#programs');
					HttpClient.getAllAssemblyPrograms(function(x)
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
							selecting :  function(event, ui)
							{
								$(event.target).find('.ui-selectee.ui-selecting').not(ui.selecting).removeClass('ui-selecting');
								$(event.target).find('.ui-selectee.ui-selected').not(ui.selecting).removeClass('ui-selected');
							},
							selected: function(event, ui)
							{
							
								newId = ui.selected.id;
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
		saveProgram : function()
		{
			$("#saveProgramDialog").dialog
			(
			{
				buttons: [{
					text: "Ok",
					click: function(x)
					{
						var program = $("#codeArea").val();
						var programName = $("#boardNameInput").val();
						var programDesc = $("#programDescInput").val();
						if (programName == '')
						{
							alert('The name is empty');
							return;
						}
						//alert(HttpClient.type);
						HttpClient.saveAssemblyProgram(programName, programDesc, program, function(x){
							console.log(x);
							if(x=="you must login")
							{
								alert("you must login");
							}
						});
						$(this).dialog("close");
					}
				}],
				open : function(event, ui)
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
	
		}
	}
