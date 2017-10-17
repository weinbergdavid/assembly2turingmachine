/*
 * handles the http comunication
 */

HttpClient = 
{
	getProgramResult:null,
	
    /*
     * get http request
     */
	getXmlhttp : function(f)
	{
		xmlhttp = {} ;
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				f(xmlhttp.responseText);
			}
		}
		return xmlhttp ;		
	},
	
    /*
     * get a program from the database
     */
	getProgram: function(programID)
	{
		if(typeof programID === 'undefined')
			programID = document.getElementById("input_program_id").value ;
		var http;
		if (programID.length==0)
		{ 
			return;
		}
		http = HttpClient.getXmlhttp(Combinations.initCombinations);
		http.open("GET","PHP/getProgram.php?id="+programID,true);
		http.send();
	},
    
    /*
     * get all the programs from the database
     */
	getAllPrograms: function(f)
	{
		var programID = -1 ;
		var http;
		if (programID.length==0)
		{ 
			return;
		}
		http = HttpClient.getXmlhttp(f);
		http.open("GET","PHP/getAllPrograms.php",true);
		http.send();
	},
    
    /*
     * get all the assembly programs from the database
     */
	getAllAssemblyPrograms: function(f)
	{
		var programID = -1 ;
		var http;
		if (programID.length==0)
		{ 
			return;
		}
		http = HttpClient.getXmlhttp(f);
		http.open("GET","PHP/getAllAssemblyPrograms.php",true);
		http.send();
	},
    
    /*
     * save the current board to the database
     */
	saveBoard : function(boardName,board,f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		var params = "boardName="+boardName+"&board="+board;
		xmlHttp.open("POST","PHP/saveBoard.php",true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlHttp.send(params);
	},
    
    /*
     * read a board from the database
     */
	readBoard : function(boardName,f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		xmlHttp.open("GET","PHP/getBoard.php?boardName="+boardName,true);
		xmlHttp.send();
	},
    
    /*
     * save the current program into the database
     */
	saveProgram : function(programName, programDesc, program,f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		var params = "name="+programName+"&desc="+programDesc+"&program="+program;
		xmlHttp.open("POST","PHP/saveProgram.php", true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlHttp.send(params);	
	},
    
    /*
     * get all the boards from the database
     */
	getAllBoards : function(f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		xmlHttp.open("GET","PHP/getAllBoards.php", true);
		xmlHttp.send();	
	},
    
    /*
     * signup into the system
     */
	signup : function(userName,password,email,f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		var params = "userName="+userName+"&password="+password+"&email="+email;
		xmlHttp.open("POST","PHP/signup.php", true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlHttp.send(params);
	},
    
    /*
     * signin to the system
     */
	signin : function(userName,password,f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		var params = "userName="+userName+"&password="+password;
		xmlHttp.open("POST","PHP/signin.php", true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlHttp.send(params);
	},
    
    /*
     * save an assembly program into the database
     */
	saveAssemblyProgram : function(programName, programDesc, program,f)
	{
		var xmlHttp = HttpClient.getXmlhttp(f);
		var params = "programName="+programName+"&program="+program+"&programDesc="+programDesc;
		xmlHttp.open("POST","PHP/saveAssemblyProgram.php",true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlHttp.send(params);
	}
}


