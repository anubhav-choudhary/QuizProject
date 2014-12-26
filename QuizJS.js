var Quiz=function()
{ var questionOBJ;var currentQuestion=1;
var showQuestion=function()
{var qno=$("#QNO"),question=$("#QUESTION"),opt=[];opt[0]=$("#OPTIONA");opt[1]=$("#OPTIONB");opt[2]=$("#OPTIONC");opt[3]=$("#OPTIOND");qno.html(currentQuestion);question.html(questionOBJ.questions[currentQuestion-1].QUESTION);var type=questionOBJ.questions[currentQuestion-1].TYPE;if(type=="S")
{var ch="A";for(var i=0;i<4;i++)
{opt[i].html("<input id=O"+ch+" name=option value='"+ch+"' type='radio' onclick='QuizPage.selOption(\""+ch+"\")'> "+questionOBJ.questions[currentQuestion-1][ch]);if(questionOBJ.questions[currentQuestion-1].ANSWER==ch)$('#O'+ch).prop("checked",true);ch=String.fromCharCode(ch.charCodeAt(0)+1);}}
else if(type=="M")
{var ch="A";for(var i=0;i<4;i++)
{opt[i].html("<input id=O"+ch+" name=option value='"+ch+"' type='checkbox' onclick='QuizPage.checkOption(\""+ch+"\",this)'> "+questionOBJ.questions[currentQuestion-1][ch]);if(questionOBJ.questions[currentQuestion-1].ANSWER.indexOf(ch)!=-1)$('#O'+ch).prop("checked",true);ch=String.fromCharCode(ch.charCodeAt(0)+1);}}
else if(type=="N")
{var val=questionOBJ.questions[currentQuestion-1].ANSWER;opt[0].html("ANSWER : <input name=option type='text' VALUE='"+val+"' onkeyup='QuizPage.setAnswer(this.value)'> ");for(var i=1;i<4;i++)opt[i].html("");}
genNavList();checkMark();}
var genNavList=function()
{var script="";for(var i=0;i<questionOBJ.questions.length;i++)
{script+="<a href='#' id='Q"+(i+1)+"' onclick='QuizPage.gotoQ("+(i)+"); '>"+(i+1)+"</a>";if(i!=questionOBJ.questions.length-1)script+=" | ";}
$('#NAVLIST').html(script);for(var i=0;i<questionOBJ.questions.length;i++)
{if(i==currentQuestion-1)$('#Q'+(i+1)).css("font-weight","bold");var marked=questionOBJ.questions[i].MARKED,answer=questionOBJ.questions[i].ANSWER;if(marked==true&&answer=="")$('#Q'+(i+1)).css("background-color","orange");else if(marked==true&&answer!="")$('#Q'+(i+1)).css("background-color","blue");else if(marked==false&&answer!="")$('#Q'+(i+1)).css("background-color","green");}}
var checkMark=function()
{var state=questionOBJ.questions[currentQuestion-1].MARKED;if(state)
{$('#MARK').html("UNMARK");}
else{$('#MARK').html("MARK");}}

this.init=function()
{$.get("question.html",function(data,status){questionOBJ=JSON.parse(data);showQuestion();genNavList();$("#NEXTQU").bind("click",QuizPage.nextQuestion);$("#PREVQU").bind("click",QuizPage.prevQuestion);$("#RESETOPT").bind("click",QuizPage.resetQuestion);$("#MARK").bind("click",QuizPage.markQ);});}
this.selOption=function(option)
{if(option=="A"||option=="B"||option=="C"||option=="D")
{questionOBJ.questions[currentQuestion-1].ANSWER=option;}
genNavList();}
this.checkOption=function(option,chkbox)
{if(!(option=="A"||option=="B"||option=="C"||option=="D"))return;var state=chkbox.checked;if(state)
{questionOBJ.questions[currentQuestion-1].ANSWER+=option;}
else{questionOBJ.questions[currentQuestion-1].ANSWER=questionOBJ.questions[currentQuestion-1].ANSWER.replace(option,"");}
genNavList();}
this.setAnswer=function(answer)
{questionOBJ.questions[currentQuestion-1].ANSWER=answer;genNavList();}
this.nextQuestion=function()
{if(questionOBJ.questions.length<currentQuestion+1)return;currentQuestion++;showQuestion();}
this.prevQuestion=function()
{if(currentQuestion==1)return;currentQuestion--;showQuestion();}
this.resetQuestion=function()
{questionOBJ.questions[currentQuestion-1].ANSWER="";showQuestion();}
this.gotoQ=function(qno)
{currentQuestion=qno+1;showQuestion();return false;}
this.markQ=function(){questionOBJ.questions[currentQuestion-1].MARKED=(questionOBJ.questions[currentQuestion-1].MARKED)?false:true;checkMark();genNavList();}
}
var QuizPage=new Quiz();window.onload=QuizPage.init();
