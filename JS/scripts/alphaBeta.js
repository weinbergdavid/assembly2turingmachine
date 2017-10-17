/*
 * This file contains the actions regarding the alphabet of the machine.
 */

AlphaBeta =
		{
			blank: "s0",
			selected_paper: null,
			selected_paper_st: null,
			alphaBeta_special_paper: null,
			alphaBeta_numbers_paper: null,
			alphaBeta_pictures_paper: null,
			alphaBeta_colors_paper: null,
			alphaBeta_titles_paper: null,
			alphaBeta_ops_paper: null,
			alphaBeta_special_st: null,
			alphaBeta_numbers_st: null,
			alphaBeta_registers_st: null,
			alphaBeta_pictures_st: null,
			alphaBeta_colors_st: null,
			alphaBeta_titles_st: null,
			alphaBeta_ops_st: null,
			alphaBeta_Collection_paper: null,
			alphaBeta_st: null,
			ABC: null,
			selectedChar: null,
			
			/*
			 * on body load - initialize the alphabet collection
			 * 
			 * @returns {undefined}
			 */
			initAlphabeta: function()
			{
				if (!AlphaBeta.ABC)
				{
					AlphaBeta.ABC = new Array();
				}
				AlphaBeta.initSpecialCharacters();
				AlphaBeta.initNumbers();
				AlphaBeta.initRegisters();
				AlphaBeta.initPictures();
				AlphaBeta.initColors();
				AlphaBeta.initTitles();
				AlphaBeta.initOps();
				AlphaBeta.updateABCShow();
				$("#AlphaBetaAccordion").accordion();
				AlphaBeta.AlphaBetOnClick();
			},
					
			/*
			 * initialize the numbers alphabet
			 * 
			 * @returns {undefined}
			 */
			initNumbers: function() {
				AlphaBeta.alphaBeta_numbers_paper = Raphael("AlphaBetaNumbers", 200, 1000);
				AlphaBeta.alphaBeta_numbers_st = AlphaBeta.alphaBeta_numbers_paper.set();


				for (var i = 0; i < 10; i++)
				{
					AlphaBeta.ABC["n" + i] = {type: "image", attr: "./pictures/n" + i + ".png"};
					AlphaBeta.ABC["nt" + i] = {type: "image", attr: "./pictures/nt" + i + ".png"};
				}
			},
			/*
			 * initialize the regs alphabet
			 * 
			 * @returns {undefined}
			 */
			initRegisters: function() {
				AlphaBeta.alphaBeta_registers_paper = Raphael("AlphaBetaRegisters", 200, 2000);
				AlphaBeta.alphaBeta_registers_st = AlphaBeta.alphaBeta_registers_paper.set();

				AlphaBeta.ABC["ralu1"] = {type: "image", attr: "./pictures/ralu1.png"};
				AlphaBeta.ABC["ralu2"] = {type: "image", attr: "./pictures/ralu2.png"};
				AlphaBeta.ABC["ralu3"] = {type: "image", attr: "./pictures/ralu3.png"};
				AlphaBeta.ABC["ralu4"] = {type: "image", attr: "./pictures/ralu4.png"};

				AlphaBeta.ABC["rax"] = {type: "image", attr: "./pictures/rax.png"};
				AlphaBeta.ABC["rbx"] = {type: "image", attr: "./pictures/rbx.png"};
				AlphaBeta.ABC["rcx"] = {type: "image", attr: "./pictures/rcx.png"};
				AlphaBeta.ABC["rdx"] = {type: "image", attr: "./pictures/rdx.png"};
				AlphaBeta.ABC["rsi"] = {type: "image", attr: "./pictures/rsi.png"};
				AlphaBeta.ABC["rdi"] = {type: "image", attr: "./pictures/rdi.png"};
				AlphaBeta.ABC["rbp"] = {type: "image", attr: "./pictures/rbp.png"};
				AlphaBeta.ABC["rsp"] = {type: "image", attr: "./pictures/rsp.png"};

				AlphaBeta.ABC["ral"] = {type: "image", attr: "./pictures/ral.png"};
				AlphaBeta.ABC["rah"] = {type: "image", attr: "./pictures/rah.png"};
				AlphaBeta.ABC["rbl"] = {type: "image", attr: "./pictures/rbl.png"};
				AlphaBeta.ABC["rbh"] = {type: "image", attr: "./pictures/rbh.png"};
				AlphaBeta.ABC["rcl"] = {type: "image", attr: "./pictures/rcl.png"};
				AlphaBeta.ABC["rch"] = {type: "image", attr: "./pictures/rch.png"};
				AlphaBeta.ABC["rdl"] = {type: "image", attr: "./pictures/rdl.png"};
				AlphaBeta.ABC["rdh"] = {type: "image", attr: "./pictures/rdh.png"};

				AlphaBeta.ABC["rcs"] = {type: "image", attr: "./pictures/rcs.png"};
				AlphaBeta.ABC["rds"] = {type: "image", attr: "./pictures/rds.png"};
				AlphaBeta.ABC["res"] = {type: "image", attr: "./pictures/res.png"};
				AlphaBeta.ABC["rss"] = {type: "image", attr: "./pictures/rss.png"};

				AlphaBeta.ABC["rflags"] = {type: "image", attr: "./pictures/rflags.png"};
				AlphaBeta.ABC["rip"] = {type: "image", attr: "./pictures/rip.png"};

			},
			/*
			 * * initialize the colors alphabet
			 * 
			 * @returns {undefined}
			 */
			initColors: function() {
				AlphaBeta.alphaBeta_colors_paper = Raphael("AlphaBetaColors", 200, 1000);
				AlphaBeta.alphaBeta_colors_st = AlphaBeta.alphaBeta_colors_paper.set();

				for (var i = 0; i < 13; i++)
				{
					AlphaBeta.ABC["c" + i] = {type: "color", attr: Raphael.getColor(1)};
				}
			},
			initSpecialCharacters: function() {
				AlphaBeta.alphaBeta_special_paper = Raphael("AlphaBetaSpecial", 200, 1000);
				AlphaBeta.alphaBeta_special_st = AlphaBeta.alphaBeta_special_paper.set();

				AlphaBeta.ABC["s0"] = {type: "image", attr: "./pictures/s0.png"};
				AlphaBeta.ABC["sdst"] = {type: "image", attr: "./pictures/sdst.png"};
				AlphaBeta.ABC["ssrc"] = {type: "image", attr: "./pictures/ssrc.png"};
				AlphaBeta.ABC["ssrcdst"] = {type: "image", attr: "./pictures/ssrcdst.png"};
				AlphaBeta.ABC["ssr"] = {type: "image", attr: "./pictures/ssr.png"};
				AlphaBeta.ABC["srr"] = {type: "image", attr: "./pictures/srr.png"};
			},
			/*
			 * initialize the pictures alphabet
			 * 
			 * @returns {undefined}
			 */
			initPictures: function()
			{
				var uploadPic = document.createElement("div");
				uploadPic.id = "uploadPic";
				uploadPic.innerHtml = "<form action='PHP/upload_file.php' method='post' enctype='multipart/form-data'>" +
						"<input type='file' name='file' id='newPicture'>" +
						"<input id='uploadPicture' type='submit' name='upload' value='Upload'>" +
						"</form>";
				document.getElementById("AlphaBetaPictures").insertBefore(uploadPic, document.getElementById("AlphaBetaPictures").firstChild);

				AlphaBeta.alphaBeta_pictures_paper = Raphael("AlphaBetaPictures", 200, 1000);
				AlphaBeta.alphaBeta_pictures_st = AlphaBeta.alphaBeta_pictures_paper.set();

				for (var i = 0; i < 15; i++)
				{
					AlphaBeta.ABC["p" + i] = {type: "image", attr: "./pictures/" + i + ".png"};
				}
			},
			/*
			 * initialize the titles alphabet
			 * 
			 * @returns {undefined}
			 */
			initTitles: function()
			{
				AlphaBeta.alphaBeta_titles_paper = Raphael("AlphaBetaTitles", 200, 1000);
				AlphaBeta.alphaBeta_titles_st = AlphaBeta.alphaBeta_titles_paper.set();

				AlphaBeta.ABC["talu"] = {type: "image", attr: "./pictures/talu.png"};
				AlphaBeta.ABC["tcode"] = {type: "image", attr: "./pictures/tcode.png"};
				AlphaBeta.ABC["tmemory"] = {type: "image", attr: "./pictures/tmemory.png"};
				AlphaBeta.ABC["tregs"] = {type: "image", attr: "./pictures/tregs.png"};
				AlphaBeta.ABC["tstack"] = {type: "image", attr: "./pictures/tstack.png"};
			},
			/*
			 * initialize the operations alphabet
			 * 
			 * @returns {undefined}
			 */
			initOps: function()
			{
				AlphaBeta.alphaBeta_ops_paper = Raphael("AlphaBetaOps", 200, 3000);
				AlphaBeta.alphaBeta_ops_st = AlphaBeta.alphaBeta_ops_paper.set();
				//define the operations
				var ops = ['cmp', "jmp", "jz", "jnae", "jb", "je", "jnz", "jne", "jnb", "jae", "jna", "jbe", "ja", "jnbe", "jl", "jnge", "jge", "jnl", "jle", "jng", "jg", "jnle"
							, "mark start mem dst", "access mem", "mark mem src", "mark mem dst", "mark p2 src"];
				for (var i = 0; i < ops.length; i++)
				{
					if (ops[i] == "jae")
					{
					}
					AlphaBeta.ABC["o" + ops[i]] = {type: "image", attr: "./pictures/o" + ops[i] + ".png"};
					AlphaBeta.ABC["ot" + ops[i]] = {type: "image", attr: "./pictures/ot" + ops[i] + ".png"};
				}
				AlphaBeta.ABC["omove ip down"] = {type: "image", attr: "./pictures/omove ip down.png"};
				AlphaBeta.ABC["otmove ip down"] = {type: "image", attr: "./pictures/otmove ip down.png"};
				AlphaBeta.ABC["omove ip up"] = {type: "image", attr: "./pictures/otmove ip up.png"};
				AlphaBeta.ABC["otmove ip up"] = {type: "image", attr: "./pictures/omove ip up.png"};
				AlphaBeta.ABC["odiv"] = {type: "image", attr: "./pictures/odiv.png"};
				AlphaBeta.ABC["otdiv"] = {type: "image", attr: "./pictures/otdiv.png"};
				AlphaBeta.ABC["omark code dst"] = {type: "image", attr: "./pictures/omark code dst.png"};
				AlphaBeta.ABC["otmark code dst"] = {type: "image", attr: "./pictures/otmark code dst.png"};
				AlphaBeta.ABC["onot"] = {type: "image", attr: "./pictures/onot.png"};
				AlphaBeta.ABC["otnot"] = {type: "image", attr: "./pictures/otnot.png"};
				AlphaBeta.ABC["oand"] = {type: "image", attr: "./pictures/oand.png"};
				AlphaBeta.ABC["otand"] = {type: "image", attr: "./pictures/otand.png"};
				AlphaBeta.ABC["oor"] = {type: "image", attr: "./pictures/oor.png"};
				AlphaBeta.ABC["otor"] = {type: "image", attr: "./pictures/otor.png"};
				AlphaBeta.ABC["oxor"] = {type: "image", attr: "./pictures/oxor.png"};
				AlphaBeta.ABC["otxor"] = {type: "image", attr: "./pictures/otxor.png"};
				AlphaBeta.ABC["omul"] = {type: "image", attr: "./pictures/omul.png"};
				AlphaBeta.ABC["otmul"] = {type: "image", attr: "./pictures/otmul.png"};
				AlphaBeta.ABC["omark p1 src"] = {type: "image", attr: "./pictures/omark p1 src.png"};
				AlphaBeta.ABC["otmark p1 src"] = {type: "image", attr: "./pictures/otmark p1 src.png"};
				AlphaBeta.ABC["oinc"] = {type: "image", attr: "./pictures/oinc.png"};
				AlphaBeta.ABC["otinc"] = {type: "image", attr: "./pictures/otinc.png"};
				AlphaBeta.ABC["osub"] = {type: "image", attr: "./pictures/osub.png"};
				AlphaBeta.ABC["otsub"] = {type: "image", attr: "./pictures/otsub.png"};
				AlphaBeta.ABC["oadd"] = {type: "image", attr: "./pictures/oadd.png"};
				AlphaBeta.ABC["otadd"] = {type: "image", attr: "./pictures/otadd.png"};
				AlphaBeta.ABC["omark alu1 dst"] = {type: "image", attr: "./pictures/omark alu1 dst.png"};
				AlphaBeta.ABC["otmark alu1 dst"] = {type: "image", attr: "./pictures/otmark alu1 dst.png"};
				AlphaBeta.ABC["omark alu2 dst"] = {type: "image", attr: "./pictures/omark alu2 dst.png"};
				AlphaBeta.ABC["otmark alu2 dst"] = {type: "image", attr: "./pictures/otmark alu2 dst.png"};
				AlphaBeta.ABC["omark alu3 src"] = {type: "image", attr: "./pictures/omark alu3 src.png"};
				AlphaBeta.ABC["otmark alu3 src"] = {type: "image", attr: "./pictures/otmark alu3 src.png"};
				AlphaBeta.ABC["omark alu4 src"] = {type: "image", attr: "./pictures/omark alu4 src.png"};
				AlphaBeta.ABC["omark alu3 dst"] = {type: "image", attr: "./pictures/omark alu3 dst.png"};
				AlphaBeta.ABC["otmark alu3 dst"] = {type: "image", attr: "./pictures/otmark alu3 dst.png"};
				AlphaBeta.ABC["otmark alu4 src"] = {type: "image", attr: "./pictures/otmark alu4 src.png"};
				AlphaBeta.ABC["omark ax src"] = {type: "image", attr: "./pictures/omark ax src.png"};
				AlphaBeta.ABC["otmark ax src"] = {type: "image", attr: "./pictures/otmark ax src.png"};
				AlphaBeta.ABC["omark ax dst"] = {type: "image", attr: "./pictures/omark ax dst.png"};
				AlphaBeta.ABC["otmark ax dst"] = {type: "image", attr: "./pictures/otmark ax dst.png"};
				AlphaBeta.ABC["omark bx src"] = {type: "image", attr: "./pictures/omark bx src.png"};
				AlphaBeta.ABC["otmark bx src"] = {type: "image", attr: "./pictures/otmark bx src.png"};
				AlphaBeta.ABC["omark bx dst"] = {type: "image", attr: "./pictures/omark bx dst.png"};
				AlphaBeta.ABC["otmark bx dst"] = {type: "image", attr: "./pictures/otmark bx dst.png"};
				AlphaBeta.ABC["omark cx src"] = {type: "image", attr: "./pictures/omark cx src.png"};
				AlphaBeta.ABC["otmark cx src"] = {type: "image", attr: "./pictures/otmark cx src.png"};
				AlphaBeta.ABC["omark cx dst"] = {type: "image", attr: "./pictures/omark cx dst.png"};
				AlphaBeta.ABC["otmark cx dst"] = {type: "image", attr: "./pictures/otmark cx dst.png"};
				AlphaBeta.ABC["omark dx src"] = {type: "image", attr: "./pictures/omark dx src.png"};
				AlphaBeta.ABC["otmark dx src"] = {type: "image", attr: "./pictures/otmark dx src.png"};
				AlphaBeta.ABC["omark dx dst"] = {type: "image", attr: "./pictures/omark dx dst.png"};
				AlphaBeta.ABC["otmark dx dst"] = {type: "image", attr: "./pictures/otmark dx dst.png"};
				AlphaBeta.ABC["omark arg1 src"] = {type: "image", attr: "./pictures/omark arg1 src.png"};
				AlphaBeta.ABC["otmark arg1 src"] = {type: "image", attr: "./pictures/otmark arg1 src.png"};
				AlphaBeta.ABC["omark arg1 dst"] = {type: "image", attr: "./pictures/omark arg1 dst.png"};
				AlphaBeta.ABC["otmark arg1 dst"] = {type: "image", attr: "./pictures/otmark arg1 dst.png"};
				AlphaBeta.ABC["omark arg2 src"] = {type: "image", attr: "./pictures/omark arg2 src.png"};
				AlphaBeta.ABC["otmark arg2 src"] = {type: "image", attr: "./pictures/otmark arg2 src.png"};
				AlphaBeta.ABC["omark arg2 dst"] = {type: "image", attr: "./pictures/omark arg2 dst.png"};
				AlphaBeta.ABC["otmark arg2 dst"] = {type: "image", attr: "./pictures/otmark arg2 dst.png"};
				AlphaBeta.ABC["omover"] = {type: "image", attr: "./pictures/omover.png"};
				AlphaBeta.ABC["otmover"] = {type: "image", attr: "./pictures/otmover.png"};
				AlphaBeta.ABC["ostop"] = {type: "image", attr: "./pictures/ostop.png"};
			},
			/*
			 * add new symbol to the alphabet
			 * 
			 * @returns {undefined}
			 */
			addSymbol: function()
			{
				if (!AlphaBeta.ABC)
				{
					AlphaBeta.ABC = new Array();
				}
				var color;
				switch (AlphaBeta.ABC.length)
				{
					case 0:
						color = {type: "color", attr: "gray"};
						break;
					case 1:
						color = {type: "color", attr: "green"};
						break;
					case 2:
						color = {type: "color", attr: "red"};
						break;
					case 3:
						color = {type: "color", attr: "blue"};
						break;
					case 4:
						color = {type: "image", attr: "./pictures/4.png"};
						break;
					case 5:
						color = {type: "image", attr: "./pictures/5.png"};
						break;
					case 6:
						color = {type: "image", attr: "./pictures/6.png"};
						break;
					case 7:
						color = {type: "image", attr: "./pictures/7.png"};
						break;
					case 8:
						color = {type: "image", attr: "./pictures/8.png"};
						break;
					case 9:
						color = {type: "image", attr: "./pictures/9.png"};
						break;
					case 10:
						color = {type: "image", attr: "./pictures/10.png"};
						break;
					case 11:
						color = {type: "image", attr: "./pictures/11.png"};
						break;
					case 12:
						color = {type: "image", attr: "./pictures/12.png"};
						break;
					case 13:
						color = {type: "image", attr: "./pictures/13.png"};
						break;
					case 14:
						color = {type: "image", attr: "./pictures/14.png"};
						break;
					default:
						color = {type: "color", attr: "gray"};
						break;
				}
				AlphaBeta.ABC[AlphaBeta.ABC.length] = color;
				AlphaBeta.updateABCShow();
			},
			/*
			 * remove symbol from the alphabet
			 * 
			 * @returns {unresolved}
			 */
			removeSymbol: function()
			{
				if (!AlphaBeta.ABC || AlphaBeta.ABC.length == 0)
				{
					return;
				}
				AlphaBeta.ABC.length = AlphaBeta.ABC.length - 1;
				AlphaBeta.selectedChar = null;
				AlphaBeta.updateABCShow();
			},
			/*
			 * update the alphabet when changed
			 * 
			 * @returns {unresolved}
			 */
			updateABCShow: function()
			{
				AlphaBeta.alphaBeta_special_st.remove();
				AlphaBeta.alphaBeta_pictures_st.remove();
				AlphaBeta.alphaBeta_colors_st.remove();
				AlphaBeta.alphaBeta_numbers_st.remove();
				AlphaBeta.alphaBeta_titles_st.remove();
				AlphaBeta.alphaBeta_ops_st.remove();

				var i = {s: 0, p: 0, c: 0, n: 0, r: 0, t: 0, o: 0};
				//handle the letters according to its type
				for (var ch in AlphaBeta.ABC)
				{
					var obj;
					switch (ch[0])
					{
						case "c":
							var rec = AlphaBeta.alphaBeta_colors_paper.rect(30, 30 + 45 * i.c, 40, 40);
							rec.node.setAttributeNS(null, "fill", AlphaBeta.ABC[ch].attr);
							obj = rec;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_colors_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;
							
							var text = AlphaBeta.alphaBeta_colors_paper.text(90, 55 + 45 * i.c, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.c++;
							break;
						case "p":
							var img = AlphaBeta.alphaBeta_pictures_paper.image(AlphaBeta.ABC[ch].attr, 30, 30 + 45 * i.p, 40, 40);
							obj = img;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_pictures_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;
							
							var text = AlphaBeta.alphaBeta_pictures_paper.text(90, 55 + 45 * i.p, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.p++;
							break;
						case "s":
							var img = AlphaBeta.alphaBeta_special_paper.image(AlphaBeta.ABC[ch].attr, 30, 30 + 45 * i.s, 40, 40);
							obj = img;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_special_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;

							var text = AlphaBeta.alphaBeta_special_paper.text(90, 55 + 45 * i.s, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.s++;
							break;
						case "n":
							var img = AlphaBeta.alphaBeta_numbers_paper.image(AlphaBeta.ABC[ch].attr, 30, 30 + 45 * i.n, 40, 40);
							obj = img;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_numbers_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;
							
							var text = AlphaBeta.alphaBeta_numbers_paper.text(90, 55 + 45 * i.n, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.n++;
							break;
						case "r":
							var img = AlphaBeta.alphaBeta_registers_paper.image(AlphaBeta.ABC[ch].attr, 30, 30 + 45 * i.r, 40, 40);
							obj = img;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_registers_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;
							
							var text = AlphaBeta.alphaBeta_registers_paper.text(90, 55 + 45 * i.r, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.r++;
							break;
						case "t":
							var img = AlphaBeta.alphaBeta_titles_paper.image(AlphaBeta.ABC[ch].attr, 30, 30 + 45 * i.t, 40, 40);
							obj = img;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_titles_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;
							
							var text = AlphaBeta.alphaBeta_titles_paper.text(90, 55 + 45 * i.t, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.t++;
							break;
						case "o":
							var img = AlphaBeta.alphaBeta_ops_paper.image(AlphaBeta.ABC[ch].attr, 30, 30 + 45 * i.o, 40, 40);
							obj = img;
							obj.node.id = ch;
							obj.node.className = ch;
							AlphaBeta.alphaBeta_ops_st.push(obj);
							obj.node.onclick = AlphaBeta.AlphaBetOnClick;
							
							var text = AlphaBeta.alphaBeta_ops_paper.text(90, 55 + 45 * i.o, ch);
							text.attr({"font-size": 30});
							text.attr({"text-anchor": "start"});
							i.o++;
							break;
						default:
							alert('The type is not supported: ' + ch);
							break;
					}
				}
				return;
				alert("shouldn't be here");
				if (!AlphaBeta.alphaBeta_Collection_paper)
				{
					AlphaBeta.alphaBeta_Collection_paper = Raphael("AlphaBeta_Collection", 150, 1000);       //raphael error
					AlphaBeta.alphaBeta_st = AlphaBeta.alphaBeta_Collection_paper.set();
				}
				AlphaBeta.alphaBeta_st.remove();

				// this if added on refactoring 3/4/2013
				if (!AlphaBeta.ABC)
					return;
				for (var i = 0; i < AlphaBeta.ABC.length; i++)
				{
					var ch = AlphaBeta.alphaBeta_Collection_paper.text(50, 50 + 45 * i, i);
					ch.attr("font-size", "50");
					ch.node.onclick = AlphaBeta.AlphaBetOnClick;
					ch.node.firstChild.id = "alphaBeta_" + i;
					ch.node.firstChild.className = "class_alphaBeta_" + i;
					AlphaBeta.alphaBeta_st.push(ch);

					/*
					 * var rec = AlphaBeta.alphaBeta_Collection_paper.rect(90, 30+45*i, 40, 40);
					 rec.attr('fill', AlphaBeta.ABC[i].attr);
					 AlphaBeta.alphaBeta_st.push(rec);
					 */
					var obj;
					switch (AlphaBeta.ABC[i].type)
					{
						case "color":
							var rec = AlphaBeta.alphaBeta_Collection_paper.rect(90, 30 + 45 * i, 40, 40);
							rec.node.setAttributeNS(null, "fill", AlphaBeta.ABC[i].attr);
							obj = rec;
							break;
						case "image":
							var img = AlphaBeta.alphaBeta_Collection_paper.image(AlphaBeta.ABC[i].attr, 90, 30 + 45 * i, 40, 40);
							obj = img;
							break;
						default:
							alert('The type is not supported');
							return;
							break;
					}
					obj.node.id = "graphics_alphaBeta_" + i;
					obj.node.className = "class_alphaBeta_" + i;
					AlphaBeta.alphaBeta_st.push(obj);
					obj.node.onclick = AlphaBeta.AlphaBetOnClick;

				}

			},
			/*
			 * select a letter
			 * 
			 * @param {type} e
			 * @returns {undefined}
			 */
			AlphaBetOnClick: function(e)
			{
				var id;
				if (!AlphaBeta.selectedChar)
				{
					id = AlphaBeta.blank;
				}
				else
				{
					e = e || window.event;
					var src = e.currentTarget || e.srcElement;
					id = src.id;
					document.getElementById(AlphaBeta.selectedChar).style.fontWeight = "normal";
				}
				if (id.substr(0, 8) == 'graphics')
				{
					id = id.substr(9, id.length);
				}
				AlphaBeta.selectedChar = id;
				if (!AlphaBeta.selected_paper)
				{
					AlphaBeta.selected_paper = Raphael("selectedCharHolder", 60, 60);
					AlphaBeta.selected_paper_st = AlphaBeta.selected_paper.set();
				}
				AlphaBeta.selected_paper_st.remove();
				var obj = {};
				switch (id[0])
				{
					case "c":
						var rec = AlphaBeta.selected_paper.rect(10, 10, 40, 40);
						rec.node.setAttributeNS(null, "fill", AlphaBeta.ABC[id].attr);
						obj = rec;
						obj.node.id = "selected";
						obj.node.className = "selected";
						AlphaBeta.selected_paper_st.push(obj);
						break;
					case "p":
					case "n":
					case "r":
					case "t":
					case "s":
					case "o":
						var img = AlphaBeta.selected_paper.image(AlphaBeta.ABC[id].attr, 10, 10, 40, 40);
						obj = img;
						obj.node.id = "selected";
						obj.node.className = "selected";
						AlphaBeta.selected_paper_st.push(obj);
						break;
						break;
					default:
						alert('The type is not supported: ' + ch);
						break;
				}
			}
		}