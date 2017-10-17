/*
 * login and authenticate into the system
 */

Login = 
	{
		sign : "sign in",
		login : function()
		{
			var dialogWrapper = $('#dialogsWrapper');
			$('#loginDialog').remove();
			var login = $('<div id="loginDialog" title="Login - Signin"></div>');
			var sign = '<button  id="signupButton" class="signButton" >sign up</button>'+
			'<button id="signinButton" class="signButton">sign in</button>' ;
			var userName = $('<div><input id="userName" name="userName" placeholder="user name" class="userDetailsInput" type="text"/></div>'); 
			var password = $('<div><input id="password" name="password" placeholder="password" class="userDetailsInput" type="password"/></div>'); 
			var email = $('<div><input id="email" name="email" placeholder="email" type="text" class="userDetailsInput" style="display: none;"/></div>'); 
			var badDetails = $('<div><div id="badDetails" name="badDetails" class="error" style="display: none;"/></div>');
			var userDetails = $('<div><div id="userDetails" name="userDetails" style="display: none;"/></div>');
			login.append(sign);
			login.append(userName);
			login.append(password);
			login.append(email);
			login.append(badDetails);
			login.append(userDetails);
			dialogWrapper.append(login);
			$('.userDetailsInput').focus(function(x)
			{
				var badDetails = $('#badDetails');
				
				badDetails.hide();
			});
			$(".signButton").click(function(x)
			{
				badDetails.hide();
				$('#loginDialog #userName').val('');
				$('#loginDialog #password').val('');
				$('#loginDialog #email').val('');
				if(x.target.innerHTML =="sign up")
				{
					$('#loginDialog #email').show();
					Login.sign = "sign up";
					$( "#signupButton" ).button( "disable" );
					$('#signinButton').button("enable" );
					$('#loginDialog').dialog('option', 'title', 'Login - Signup');
					$('#loginDialog').prop("title","Login - Signup");
					console.log($('#loginDialog').prop("title"));
					console.log($('#loginDialog').attr("title"));
				}
				else
				{
					$( "#signinButton" ).button( "disable" );
					$('#signupButton').button( "enable");
					$('#loginDialog #email').hide();
					Login.sign = "sign in";
					$('#loginDialog').dialog('option', 'title', 'Login - Signin');
					
				}
			});
			$(".signButton").button();
			$( "#signinButton" ).button( "disable" );
			$("#loginDialog").dialog
			(
			{
				create: function( event, ui ) 
				{
					$('#loginDialog #userName').val('');
					$('#loginDialog #password').val('');
					$('#loginDialog #email').val('');
				},
				buttons: [{
					text: "Ok",
					click: function()
					{
						var errMsg = null ,Msg = null
						var userName = $('#loginDialog #userName').val();
						var password = $('#loginDialog #password').val();
						var email = $('#loginDialog #email').val();
						if(userName == '' || password == '')
						{
							errMsg = 'Username and password are required';
						}
						console.log(userName,password,email);
						console.log(Login.sign,errMsg);
							
						if(!errMsg && Login.sign == "sign up")
						{
							if (!Login.emailValidation(email))
							{
								errMsg = 'The email name is not valid'	;
							}
							else
							{
								HttpClient.signup(userName, password, email, function(x){
									if(x != "created")
									{
										var suffix = "'userName'";
										alert(x);
										alertif(x.substr(0,9)=="Duplicate" && x.indexOf(suffix, x.length - suffix.length) !== -1)
										{
											errMsg = 'Someone already has that username. Try another?';
										}
										var suffix = "'email'";
										if(x.substr(0,9)=="Duplicate" && x.indexOf(suffix, x.length - suffix.length) !== -1)
										{
											errMsg = 'Someone already has that email. Try another?';
										}
										if(errMsg)
										{
											var badDetails = $('#badDetails');
											badDetails.html(errMsg);
											badDetails.show();
										}
									}
									else
									{
										var userDetails = $('#userDetails');
										userDetails.html('You are joined as '+userName);
										userDetails.show();
										setTimeout(function(){$( "#loginDialog" ).dialog( "destroy" );}, 2000); 
									}
								});
							}
						}
						else if(!errMsg)
						{
							HttpClient.signin(userName, password, function(x){
								console.log(x);
								if(x != "connected")
								{
									errMsg = 'The username or password you entered is incorrect';
								}
								else
								{
									var userDetails = $('#userDetails');
									userDetails.html('You are joined as '+userName);
									userDetails.show();
									setTimeout(function(){$( "#loginDialog" ).dialog( "destroy" );}, 2000); 
								}
								if(errMsg)
								{
									var badDetails = $('#badDetails');
									badDetails.html(errMsg);
									badDetails.show();
								}
							});
						}
						if(errMsg)
						{
							var badDetails = $('#badDetails');
							badDetails.html(errMsg);
							badDetails.show();
						}
					}
				}],
				open: function(event, ui)
				{

				},
				close: function(event, ui)
				{
					console.log(event, ui);
				}
			}
			);
		},
		emailValidation : function(inputName)
		{
			if($.trim(inputName)=="")
			{
				return false ;
			}
			var atpos=inputName.indexOf("@");
			var dotpos=inputName.lastIndexOf(".");
			if (atpos<1 || dotpos<atpos+2 || dotpos+2>=inputName.length)
			{
				return false;
			}
			return true ;
		}
	}


