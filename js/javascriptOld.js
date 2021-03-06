/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var timePerRound = 10;
var delayBetweenQuestions = 750; // in milliseconds

var i = 0;
var currVideoId;
var correctAnswerId;
var order;
var videoSource = new Array();
var videoCount = 0;
var answerArray = [6];
var startIndex;
var gameDetails = new Array();
var isDemo = true;

var count;
var counter;
var score = 0;
var buffer = 20; //scroll bar buffer

function pageY(elem) {
    return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
}

function resizeIframe() {
    var height = document.documentElement.clientHeight * 0.65;
    height -= pageY(document.getElementById('myVideo')) + buffer;
    height = (height < 0) ? 0 : height;
    document.getElementById('myVideo').style.height = height + 'px';
}
function resizeWidthIframe() {
    var width = document.documentElement.clientWidth;
    width -= pageY(document.getElementById('myVideo')) + buffer;
    width = (width < 0) ? 0 : width;
    document.getElementById('myVideo').style.width = width + 'px';
}
$(document).ready(function()
{
    refreshMatchups();
    videoSource[0] = 'movies/new.gif';
    videoSource[1] = 'movies/after.gif';
    videoSource[2] = 'movies/long.gif';
    videoSource[3]= 'movies/middle.gif';
    videoSource[4]= 'movies/last.gif';
    
    answerArray[0] = ["חדש", "חתך", "אמצע", "חצה"];
    answerArray[1] = ["אחרי", "מחר", "אחרון", "אמצע"];
    answerArray[2] = ["ארוך", "חדש", "למתוח", "אחרי"];
    answerArray[3] = ["אמצע", "חדש", "אחרי", "חתך"];
    answerArray[4] = ["אחרון", "לפני", "אחרי", "לחתוך"];

    // Generate Random number
    //startIndex = Math.floor((Math.random()*videoCount)+1); 
    videoCount = videoSource.length;


    for (var index = 0; index < videoCount; ++index) {
        // video source, right answer, user's answer, time, points
        gameDetails[index] = [videoSource[index], answerArray[index][0], false, 0, 0];
    }

    //videoPlay(0);
  //  document.getElementById("myVideo").setAttribute("src", videoSource[0]);
    //document.getElementById('myVideo').addEventListener('ended', myHandler, false);

});

function refreshMatchups() {
    var htmlCode = "";
    
    // Getting the user status and current matchups
    $.ajax({
    url: 'http://stavoren.milab.idc.ac.il/php/getMatchupPageContent.php',
    method: 'POST',
    data: { 
        userId: 1, // Hardcoded value for the user Oren Assif
    },
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {
            buildPlayerBar(jason.user);
            buildMatchesTable(jason.matches);
            }
    },
    error: function () {
      alert("error");
     }
    });
    document.getElementById("matchups_table").innerHTML = "";
}

function buildPlayerBar(userData) {
    var barDiv = document.getElementById("playerBar");
        barDiv.innerHTML = "<table width=\"100%\"><tr>" +
                        "<td><img src=\"" + userData["imgURL"] + "\" />&nbsp" + userData["fullName"] + "</td>" +
                        "<td>רמה " + userData["level"] + "</td>" +
                        "<td>נקודות: " + userData["score"] + "</td>" +
                        "<td></td>" +
                        "</tr></table>";
    /* LTR OLD VERSION
    barDiv.innerHTML = "<table width=\"100%\"><tr>" +
                        "<td>" + userData["score"] + "נקודות:</td>" +
                        "<td>" + userData["rank"] + "רמה:</td>" +
                        "<td>" + userData["fullName"] + "</td>" +
                        "<td><img src=\"" + userData["imgURL"] + "\" /></td>" +
                        "</tr></table>";
    */    
}

function buildMatchesTable(matchesData) {
          document.getElementById("friends_bar").style.display = "none";

    var table = document.getElementById("matchups_table");
    var numOfMatchups = matchesData.length;
    /*alert(numOfMatchups);
    alert(table.innerHTML);*/
    var index;
    //table.innerHTML = "";
    for (index = 0; index < numOfMatchups; ++index) {
        //table.innerHTML+= "<tr>";
        var row = document.createElement("tr");
        var row_align = document.createAttribute("align");
        row_align.nodeValue = "center";
        //TODO: check query append
        row.setAttributeNode(row_align);
        
        //table.innerHTML+= "<td>";
        var button_col = document.createElement("td");
        var action_button = document.createElement("button");
        var text = "";
        
        // Decide button
        if (matchesData[index]["gameStatus"] === "0") {
            //table.innerHTML+= "<button value=\"תן סימן\">תן סימן</button>";
            text = document.createTextNode(text = "תן סימן");
        }
        else if (matchesData[index]["gameStatus"] === "1") {
            //table.innerHTML+= "<button value=\"תורך\">תורך" + matchesData[index]["LiveGameId"] + "</button>";
            text = document.createTextNode(text = "תורך" + matchesData[index]["LiveGameId"]);
        }
        else if (matchesData[index]["gameStatus"] === "2") {
            //table.innerHTML+= "<button value=\"המתן\">המתן</button>";
            text = document.createTextNode("המתן");
        }
        else if (matchesData[index]["gameStatus"] === "3") {
            //table.innerHTML+= "<button value=\"הזמנה ממומחה\">הזמנה ממומחה" + matchesData[index]["LiveGameId"] + "</button>";
            text = document.createTextNode("הזמנה ממומחה" + matchesData[index]["LiveGameId"]);
        }
        else {
            // default status
            //table.innerHTML+= "<button value=\"תן סימן\">תן סימן</button>";
            text = document.createTextNode("תן סימן");
        }
        action_button.appendChild(text);
        action_button.onclick = function(){
    alert('here be dragons');
    return false;
            };
        button_col.appendChild(action_button);
        //table.innerHTML+= "</td>";
        
        //table.innerHTML+= "<td>";
        //table.innerHTML+= "אני<br>" + matchesData[index]["userScore"];
        //table.innerHTML+= "</td>";
        var user_col = document.createElement("td");
        text = document.createTextNode("אני");
        user_col.appendChild(text);
        user_col.appendChild(document.createElement(("br")));
        text = document.createTextNode(matchesData[index]["userScore"]);
        user_col.appendChild(text);
       
        //table.innerHTML+= "<td>";
        //table.innerHTML+= ":";
        //table.innerHTML+= "</td>";
        var delimiter_col = document.createElement("td");
        text = document.createTextNode(":");
        delimiter_col.appendChild(text);
        
        //table.innerHTML+= "<td>";
        //table.innerHTML+= matchesData[index]["rivalName"]; + "<br>" + matchesData[index]["rivalScore"];
        //table.innerHTML+= "</td>";
        var rival_col = document.createElement("td");
        text = document.createTextNode(matchesData[index]["rivalName"]);
        rival_col.appendChild(text);
        rival_col.appendChild(document.createElement(("br")));
        text = document.createTextNode(matchesData[index]["rivalScore"]);
        rival_col.appendChild(text);
        
        //table.innerHTML += "<td>";
        //table.innerHTML += "<img src=\"" + matchesData[index]["rivalImg"] + "\" />";
        //table.innerHTML += "</td>";
        var rivalImg_col = document.createElement("td");
        var rivalImg = document.createElement("img");
        var imgSrc = document.createAttribute("src");
        imgSrc.nodeValue = matchesData[index]["rivalImg"];
        
        rivalImg.setAttributeNode(imgSrc);
        rivalImg_col.appendChild(rivalImg);
        //var time = document.createTextNode(allLines[index]["time"]);
        //time_col.appendChild(time);
        
       
       //table.innerHTML+= "</tr>";
        
        row.appendChild(button_col);
        row.appendChild(user_col);
        row.appendChild(delimiter_col);
        row.appendChild(rival_col);
        row.appendChild(rivalImg_col);
        table.appendChild(row);
        //alert(table.innerHTML);
    }
    
}

function timer() {
    if (count <= 0) {
        continueToNextQuestion(null);
        return;
    }
    count = count - 1;
    document.getElementById("timer").innerHTML = count + " secs";
}


function refreshFriendsZone(userId, toInvite) {
    var htmlCode = "";
    
    // Getting the user status and current matchups
    $.ajax({
    url: 'http://stavoren.milab.idc.ac.il/php/getMatchupPageContent.php',
    method: 'POST',
    data: { 
        userId: userId, // TODO: change Hardcoded value for the user Oren Assif
    },
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {
        //    buildFriendsBar(jason.matches);
            buildFriendsTable(jason.matches, toInvite);

        }
    },
    error: function () {
      alert("error");
     }
    });
    

    document.getElementById("friends_table").innerHTML = "";

}

function buildFriendsBar(matchup) {
   document.getElementById("matchups_table").style.display = "none";
   document.getElementById("friends_bar").innerHTML = "";

  var table = document.getElementById("friends_bar");    
  var play_button = document.createElement("button");
  var invite_button = document.createElement("button");
  
  var textPlay = document.createTextNode(text = "שחק עם חברים");
  var textInvite = document.createTextNode(text = "הזמן חברים");
  
  var onclick = document.createAttribute(on)
   
  play_button.appendChild(textInvite);
  invite_button.appendChild(textPlay);
  
  play_button.setAttribute("onClick", buildFriendsTable(matchup, false));
  invite_button.onClick = buildFriendsTable(matchup, true);
  
  var row = document.createElement("tr");
  var button_col = document.createElement("td");
  button_col.appendChild(play_button);
  var button_col2 = document.createElement("td");
  button_col2.appendChild(invite_button);
          row.appendChild(button_col);
        row.appendChild(button_col2);
        
  table.appendChild(row);
    
}

function buildFriendsTable(matchesData, toInvite) {
   
   document.getElementById("friends_bar").style.display = "block";
   document.getElementById("matchups_table").style.display = "none";
   document.getElementById("friends_table").innerHTML = "";

    var table = document.getElementById("friends_table");

    var numOfMatchups = matchesData.length;
    /*alert(numOfMatchups);
    alert(table.innerHTML);*/
    var index;
    for (index = 0; index < numOfMatchups; ++index) {
        var row = document.createElement("tr");
        var row_align = document.createAttribute("align");
        row_align.nodeValue = "center";
        row.setAttributeNode(row_align);
        
        var button_col = document.createElement("td");
        var action_button = document.createElement("button");
        var text = "";
        
        // Decide button
        if (toInvite) {
            text = document.createTextNode(text = "הזמן");
            
        }else {
            text = document.createTextNode(text = "שחק");
                    action_button.onclick = function(){
            startGameWithNewPlayer(matchesData[index]["rivalName"]);
            return false;
            };
        }
        
        action_button.appendChild(text);

        button_col.appendChild(action_button);

      
        var rival_col = document.createElement("td");
        text = document.createTextNode(matchesData[index]["rivalName"]);
        rival_col.appendChild(text);
        
        var rivalImg_col = document.createElement("td");
        var rivalImg = document.createElement("img");
        var imgSrc = document.createAttribute("src");
        imgSrc.nodeValue = matchesData[index]["rivalImg"];
        
        rivalImg.setAttributeNode(imgSrc);
        rivalImg_col.appendChild(rivalImg);
        
        row.appendChild(button_col);
        row.appendChild(rival_col);
        row.appendChild(rivalImg_col);
        table.appendChild(row);
    }
}

function startGameWithNewPlayer(userId) {
    
    $.ajax({
    url: 'http://stavoren.milab.idc.ac.il/php/getLiveGameData.php',
    method: 'POST',
    data: { 
        liveGameId: 0,
        matchUpId: matchUpId // currently hard coded, but should be decided be the 2 players playing
    },
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {   
        }
    },
    error: function () {
      alert("error");
     }
    });
    
    
}


function createNewLiveGame(matchUpId) 
{
    // TODO: for a new game send liveGameId = 0, else send the live game Id;
    // * might need to chek in the server that the game id related to the user and that it's his turn
    $.ajax({
    url: 'http://stavoren.milab.idc.ac.il/php/getLiveGameData.php',
    method: 'POST',
    data: { 
        liveGameId: 0,
        matchUpId: matchUpId // currently hard coded, but should be decided be the 2 players playing
    },
    success: function (data) {
        var jason = JSON.parse(data);
        if (jason.success == 1) {   
        }
    },
    error: function () {
      alert("error");
     }
    });
    
    // TODO: set the video's array and other values once we'll have them
    
    // TODO: might need to change something here:
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    resizeIframe();
    resizeWidthIframe();
    setTimeout(function() {
        videoPlay(0);
    }, 100);
}

function startGame()
{
    document.getElementById("answers").style.display = "none";
    window.location = "#game";
    resizeIframe();
    resizeWidthIframe();
    setTimeout(function() {
        videoPlay(0);
    }, 100);
}

function videoPlay(videoNum)
{
    
    //alert(i);

//    document.getElementById("myVideo").load();
//    document.getElementById("myVideo").play();


    // Checks if need to show the translation
    if (isDemo) {
         document.getElementById("title").innerHTML ="נסו לזכור את המילים הבאות"; 
        document.getElementById("myVideo").setAttribute("src", videoSource[videoNum]);
        document.getElementById("myVideo").style.display = "block";
 
          

        // Showing the translation
        //document.getElementById("translation").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";
        document.getElementById("translatedWord").style.display = "block";
        document.getElementById("translatedWord").innerHTML = "<H1>" + answerArray[videoNum][0] + "</H1>";

        // Hiding the options
        document.getElementById("answers").style.display = "none";

                 
        if (videoNum < 4) {
            videoNum++;
          setTimeout(function() {
             videoPlay(videoNum);
          }, 2300);
        } else {
            
        setTimeout(function() {
                document.getElementById("translatedWord").style.display = "none";
                document.getElementById("myVideo").style.display = "none";
                document.getElementById("repeat").style.display = "block";
          }, 2200);

        }
    }

    else {
        document.getElementById("myVideo").style.display = "block";
        document.getElementById("myVideo").setAttribute("src", videoSource[videoNum]);
        document.getElementById("title").innerHTML ="בחרו את התשובה הנכונה";
        show4possibleAnswers(videoNum);
    }
    

}

function show4possibleAnswers(videoNum) {
    // Not Showing the translation
    //document.getElementById("translation").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").innerHTML = "<H1>&nbsp</H1>";
    document.getElementById("translatedWord").style.display = "none";

    // Showing the answers
    // First, generates Random number for the first answer
    var firstAnswerId = Math.floor((Math.random() * 4));

    /*$("#answer1").text(answerArray[videoNum][firstAnswerId]);
    $("#answer2").text(answerArray[videoNum][(firstAnswerId + 1) % 4]);
    $("#answer3").text(answerArray[videoNum][(firstAnswerId + 2) % 4]);
    $("#answer4").text(answerArray[videoNum][(firstAnswerId + 3) % 4]);*/
    document.getElementById("answer1").innerHTML = "<font size=\"5\">" + 
                                                    answerArray[videoNum][firstAnswerId] +
                                                    "</font>";
    document.getElementById("answer2").innerHTML = "<font size=\"5\">" + 
                                                    answerArray[videoNum][(firstAnswerId + 1) % 4] +
                                                    "</font>";
    document.getElementById("answer3").innerHTML = "<font size=\"5\">" + 
                                                    answerArray[videoNum][(firstAnswerId + 2) % 4] +
                                                    "</font>";
    document.getElementById("answer4").innerHTML = "<font size=\"5\">" + 
                                                    answerArray[videoNum][(firstAnswerId + 3) % 4] +
                                                    "</font>";
    if (firstAnswerId === 0) {
        correctAnswerId = "answer1";
    }
    else {
        correctAnswerId = "answer" + (5 - firstAnswerId);
    }

    // Show answers
    document.getElementById("answers").style.display = "block";
}


function myHandler() {

    // Start a timer to answer once the video ended
    //setTimeout(function(){endGame();}, 4000);


    if (isDemo) {
        ++i;
        if (i === videoCount) {
            i = 0;
            document.getElementById("translatedWord").style.display = "none";
            document.getElementById("repeat").style.display = "block";
            document.getElementById("play").style.display = "block";
        }
        else {
            videoPlay(i);
        }
    }

//    }
}

// start to show videos + answers. 
function startPlay() {

    isDemo = false;
    i = 0;
    // Hiding buttons
    document.getElementById("repeat").style.display = "none";
    document.getElementById("play").style.display = "none";

// call for the first video
    order = generateOrder();
    setTimeout(function() {
        count = timePerRound;
        counter = setInterval(timer, 1000); //1000 will run it every 1 second 
        videoPlay(order[i]);
    }, 1000);
}

// randomly decide the order of the videos.
function generateOrder(numberOfVideos) {
    var videosOrder = [1, 0, 2, 4, 3];

    // Math.floor((Math.random()*videoCount)+1); 
    return videosOrder;
}

// on click of the answers
function onClick_checkAnswer(object) {
    //   console.log("selected is: \"" + object.text  + "\"");
    //   console.log("answer is: \"" + answerArray[currVideoId][0] + "\"");

    gameDetails[order[i]][3] = count;

    if (object.text.toString() === answerArray[order[i]][0])//answerArray[currVideoId][0])
    {
        gameDetails[order[i]][2] = true;
        //Update score
        gameDetails[order[i]][4] = count;
    }
    else {
        document.getElementById(object.id).style.background = "red";
        // Update score
        gameDetails[order[i]][4] = 0;
    }
    
    score += gameDetails[order[i]][4];
    continueToNextQuestion(object);
}



function continueToNextQuestion(object) {
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";
    document.getElementById(correctAnswerId).style.background = "gray";//"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";
    document.getElementById(correctAnswerId).style.background = "gray";//"green";
    document.getElementById(correctAnswerId).style.background = "#B5EAAA";//"green";

    // continte to the next question.
    ++i;
    if (i === videoCount) {
        // If all the questions were showed, end game
        clearInterval(counter);
        endGame();
    }
    else {
        // Awaits half a second before showing the next question
        setTimeout(function() {
            if (object !== null) {
                document.getElementById(object.id).style.background = "";
            }
            document.getElementById(correctAnswerId).style.background = "";
            count = timePerRound;
            videoPlay(order[i]);
        }, delayBetweenQuestions);
    }
}

function endGame() {
    /*$("#score").text("Your score is: " + numToGuess);
     window.location("#gameOver");*/
    // 
        document.getElementById("translatedWord").style.display = "block";
        score *= 10;

        document.getElementById("translatedWord").innerHTML = "<H1>" + score + "              :"+"ניקוד</H1>";


// 3.2.2014 - JSON post
//function post() {
        $.ajax({
            url: 'http://stavoren.milab.idc.ac.il/php/updateLiveGame.php',
            method: 'POST',
            data: { 
                liveGameId: 1, 
                answer1: gameDetails[0], //$("#name").val(),
                answer2: gameDetails[1] 
            },
            success: function (data) {
                var jason = JSON.parse(data);
                if (jason.success == 1) {   
                }
            },
            error: function () {
              alert("error");
             }
         });
         $("#text").val("");
//    }
alert("Update Sent");

    
    for (var index = 0; index < videoCount; ++index) {
        console.log("User answered on " + gameDetails[index][0] + " " + gameDetails[index][2] + " answer. Time:" + gameDetails[index][3] + " score: " + gameDetails[index][4]);
    }
   document.getElementById("timer").style.display = "none";
   document.getElementById("myVideo").style.display = "none";
   document.getElementById("answer1").style.display = "none";
   document.getElementById("answer2").style.display = "none";
   document.getElementById("answer3").style.display = "none";
   document.getElementById("answer4").style.display = "none";



}