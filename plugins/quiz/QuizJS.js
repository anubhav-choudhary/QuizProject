var Quiz = function()
{
	//Properties
	var questionOBJ;
	var currentQuestion=1;
	var timeID;
	
	//##Private Functions
	//-----------------------------------------------
	var showQuestion=function()
	{
		var qno=$("#QNO"),question=$("#QUESTION"),opt=[];
		opt[0]=$("#OPTIONA");
		opt[1]=$("#OPTIONB");
		opt[2]=$("#OPTIONC");
		opt[3]=$("#OPTIOND");
		qno.html(currentQuestion);
		question.html(questionOBJ.questions[currentQuestion-1].QUESTION);	
		var type=questionOBJ.questions[currentQuestion-1].TYPE;
		if(type=="S")
		{
			var ch="A";
			for (var i=0;i<4;i++) 
			{
				opt[i].html("<input id=O"+ch+" name=option value='"+ch+"' type='radio' onclick='QuizPage.selOption(\""+ch+"\")'> "+questionOBJ.questions[currentQuestion-1][ch]);
				if(questionOBJ.questions[currentQuestion-1].ANSWER==ch) $('#O'+ch).prop( "checked", true );
				ch=String.fromCharCode(ch.charCodeAt(0)+1);	
			}		
		}
		else if (type=="M") 
		{
			var ch="A";
			for (var i=0;i<4;i++) 
			{
				opt[i].html("<input id=O"+ch+" name=option value='"+ch+"' type='checkbox' onclick='QuizPage.checkOption(\""+ch+"\",this)'> "+questionOBJ.questions[currentQuestion-1][ch]);
				if(questionOBJ.questions[currentQuestion-1].ANSWER.indexOf(ch)!=-1) $('#O'+ch).prop( "checked", true );
				ch=String.fromCharCode(ch.charCodeAt(0)+1);
			}
		}
		else if (type=="N") 
		{
			var val=questionOBJ.questions[currentQuestion-1].ANSWER;
			opt[0].html("ANSWER : <input name=option type='text' VALUE='"+val+"' onkeyup='QuizPage.setAnswer(this.value)'> ");
			for (var i=1;i<4;i++) opt[i].html("");
		}
		genNavList();
		checkMark();
	}
	//-----------------------------------------------
	var genNavList=function()
	{
		var script="<li><a href=\"#\"><i class=\"fa fa-list\"></i><span class=\"hidden-xs\">Navigation Bar</span></a></li>";
		for(var i=0;i<questionOBJ.questions.length;i++)
		{
			script+="<li><a href='#' id='Q"+(i+1)+"' onclick='QuizPage.gotoQ("+(i)+"); '><i class=\"fa fa-question\"></i><span class=\"hidden-xs\">Question "+ (i+1) +"</span></a></li>";	
		}
		$('#NAVLIST').html(script);	
		for(var i=0;i<questionOBJ.questions.length;i++)
		{
			if(i==currentQuestion-1) $('#Q'+(i+1)).css("font-weight","bold");	
			var marked=questionOBJ.questions[i].MARKED,answer=questionOBJ.questions[i].ANSWER;
			if(marked==true && answer=="") $('#Q'+(i+1)).css("background-color","orange");	
			else if(marked==true && answer!="") $('#Q'+(i+1)).css("background-color","blue");	
			else if(marked==false && answer!="") $('#Q'+(i+1)).css("background-color","green");	
		}
	}
	//-----------------------------------------------
	var checkMark=function () 
	{
			var state=questionOBJ.questions[currentQuestion-1].MARKED;
			if(state)
			{
				$('#MARK').html("UNMARK");
			}
			else {
				$('#MARK').html("MARK");
			}
	}
	//-----------------------------------------------
/*	var updateTime=function () {
	
	}*/
	var inittimer=function () 
	{
		var hours = Math.floor(questionOBJ.time / 3600);
		var minutes = Math.floor((questionOBJ.time / 60) % 60);
		var seconds = questionOBJ.time % 60;
		$("#TIMELEFT").html(hours+":"+minutes+":"+seconds);
		questionOBJ.time--;
		if(questionOBJ.time!=0) timeID=setTimeout(inittimer,1000);
		else{ $("#TIMELEFT").html(questionOBJ.time); submit();}
	}
	//-----------------------------------------------
	var submit=function () 
	{
		clearTimeout(timeID);
		window.onbeforeunload=undefined;
		$.post( "submit.php", { response: JSON.stringify(questionOBJ) }, function (data) {
			window.location="finished.html";
		} );
	}
	//-----------------------------------------------
	var translateAnswer=function(ques){
			if(ques.TYPE=="S")
			{
				if(ques.ANSWER=="") return "";
				return ques[ques.ANSWER];
			}
			else if(ques.TYPE=="M")
			{
				if(ques.ANSWER=="") return "";
				var answer="";
				for(var i=0;i<ques.ANSWER.length;i++)
				{
					answer+=ques[ques.ANSWER.charAt(i)];
					if(i!=ques.ANSWER.length-1) answer+=", ";
				}
				return answer;
			}
			else 
			{
				return ques.ANSWER;			
			}
	}
	//-----------------------------------------------
	var genQuestionTable=function () {
		var script="<table class=\"table\"><tr><th>Q. NO</th><th>Questions</th><th>Answer Given</th></tr>";
		for(var i=0;i<questionOBJ.questions.length;i++)
		{
			script+=("<tr><td>"+(i+1)+"</td><td>"+questionOBJ.questions[i].QUESTION+"</td><td>"+translateAnswer(questionOBJ.questions[i])+"</td></tr>")		;
		}
		script+="</table>";
		$("#ALLQUESTIONTABLE").html(script);	
	}
	//-----------------------------------------------
	//##Public Functions
	//-----------------------------------------------
	this.init=function()
	{
		$.get("question.html",function(data,status){
			questionOBJ=JSON.parse(data);
			showQuestion();
			genNavList();
			inittimer();
			genQuestionTable();
			$( "#NEXTQU" ).bind( "click",QuizPage.nextQuestion);
			$( "#PREVQU" ).bind( "click",QuizPage.prevQuestion);
			$( "#RESETOPT" ).bind( "click",QuizPage.resetQuestion);
			$( "#MARK" ).bind( "click",QuizPage.markQ);
			$( "#SUBMITQUIZ" ).bind( "click",QuizPage.submitquiz);
			$( "#SHOWALL" ).bind( "click",QuizPage.toggleView);
			$( "#QBACK" ).bind( "click",QuizPage.toggleView);
  		});	
  		window.onbeforeunload=function () {return "Are you sure you want to leave the exam, no data will be saved and you will not be allowed to attempt again ?"};
	}
	//-----------------------------------------------
	this.selOption=function(option)
	{
		if(option=="A" || option=="B" || option=="C" || option=="D")
		{
			questionOBJ.questions[currentQuestion-1].ANSWER=option;
		}
		genNavList();
		genQuestionTable();
	}
	//-----------------------------------------------
	this.checkOption=function(option,chkbox)
	{
		if(!(option=="A" || option=="B" || option=="C" || option=="D")) return;
		var state=chkbox.checked;
		if(state)
		{
			questionOBJ.questions[currentQuestion-1].ANSWER+=option;
		}
		else {
				questionOBJ.questions[currentQuestion-1].ANSWER=questionOBJ.questions[currentQuestion-1].ANSWER.replace(option,"");	
		}
		genNavList();
		genQuestionTable();
	}
	//-----------------------------------------------
	this.setAnswer=function(answer)
	{
		questionOBJ.questions[currentQuestion-1].ANSWER=answer;
		genNavList();
		genQuestionTable();
	}
	//-----------------------------------------------
	this.nextQuestion=function()
	{
		if(questionOBJ.questions.length<currentQuestion+1) return;
		currentQuestion++;
		showQuestion();
	}	
	//-----------------------------------------------
	this.prevQuestion=function()
	{
		if(currentQuestion==1) return;
		currentQuestion--;
		showQuestion();
	}
	//-----------------------------------------------
	this.resetQuestion=function()
	{
		questionOBJ.questions[currentQuestion-1].ANSWER="";
		showQuestion();	
	}
	//-----------------------------------------------
	this.gotoQ=function(qno)
	{
		currentQuestion=qno+1;
		showQuestion();
		$('#QUESTIONSLOT').show(200);
		$('#ALLQUESTIONS').hide(200);	
		return false;
	}
	//-----------------------------------------------
	this.markQ=function () {
		questionOBJ.questions[currentQuestion-1].MARKED=(questionOBJ.questions[currentQuestion-1].MARKED)?false:true;	
		checkMark();
		genNavList();
	}
	//-----------------------------------------------
	this.submitquiz=function () 
	{
		var res=confirm("Are you sure to submit the exam?");
		if(res) submit();
		else return;
	}
	//-----------------------------------------------
	this.toggleView=function () {
		$('#QUESTIONSLOT').toggle(200);
		$('#ALLQUESTIONS').toggle(200);	
	}
	//-----------------------------------------------
}
var QuizPage=new Quiz();
window.onload=QuizPage.init();
