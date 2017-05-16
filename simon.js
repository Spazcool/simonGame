//TODO
// a running function for the header height, checks on resize of the screen?
//PAUSE THE GAME TILL HOVER OVER casMsg
//ADD A HINT IN THE MENU IF PLAYING ON CASUAL
//SIMILAR HINT IN THE NOTICE, ALSO ON CASUAL
//HOVER EFFECTS FOR THE MARKEITING LINKS
//counter face needs to not have a 0 in front of double digits
//might have a bug in the "pause" in casual, where the game starts up and adds a couple more rounds

$(document).ready(function() {
    var aCounter = 0,
        bob = 11,
        col = 0,
        objInterval = 0,
        objIntervalA = 0,
        buttonChoice = ["top", "right", "bottom", "left"],
        buttonColor = ["#FF4040", "#78AB46", "#50A6C2", "#FBEC5D"],
        gameUI = {
            top: [48, 58, 59, 69, 79, 80],
            bottom: [184, 185, 195, 205, 206, 216],
            left: [109, 119, 129, 140, 151, 130],
            right: [113, 124, 134, 135, 145, 155]
        },
        runningTallyAI = [],
        runningTallyUSER = [],
        roundCounter = 1,
        gameMode = "STRICT",
        dog = 0,
        time = 1000,
        hexContainer = $("#hexagonContainer").css("height"),
        //TODO if dog < 4 push the newAudio in and play else
        topSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16275_1460570774.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16275_1460570774.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16275_1460570774.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16275_1460570774.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16275_1460570774.mp3")
        ],
        rightSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16296_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16296_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16296_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16296_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16296_1460570779.mp3")
        ],
        bottomSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16297_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16297_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16297_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16297_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16297_1460570779.mp3")
        ],
        leftSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16298_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16298_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16298_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16298_1460570779.mp3"),
            new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16298_1460570779.mp3")
        ],
        extraSound = [new Audio("http://www.gravomaster.com/alarm/sounds/chime-low.mp3"),
            new Audio("http://www.gravomaster.com/alarm/sounds/chime-low.mp3"),
            new Audio("http://www.gravomaster.com/alarm/sounds/chime-low.mp3"),
            new Audio("http://www.gravomaster.com/alarm/sounds/chime-low.mp3"),
            new Audio("http://www.gravomaster.com/alarm/sounds/chime-low.mp3")
        ];
    //STARTING STYLE
    $("#leftPanel").height(hexContainer);
    $("#rightPanel").height(hexContainer);
    $(".banner").height(hexContainer);
    $(".banner").hide();
    $(".hex-img").hide();
    $(".notice").hide();
    $("#marketing").hide();

    //FILLS THE AUDIO ARRAYS WITH 5 "CHANNELS" TO PLAY FROM, BUT DOESNT WORK...
    function fillArray(arr) {
        for (var i = 0; i < 4; i++) {
            arr.push(arr[0]);
        }
        return arr;
    }

    //CHECK IF USER HAS WON
    function gameOverCheck() {
        if (roundCounter > 20) {
            return true;
        }
        return false;
    }

    //CYCLE THROUGH THE CHANNELS ARRAYS AND PLAY, COMPLICATED BECAUSE HTML DOESNT LIKE TO PLAY MORE THAN ONE AT A TIME
    function purr(sound) {
        if (dog < 4) {
            sound[dog].currentTime = 0;
            sound[dog].play();
            dog += 1;
        } else {
            dog = 0;
            sound[dog].currentTime = 0;
            sound[dog].play();
        }
    }

    //ANIMATION OF THE BUTTONS & CALL FOR SOUND
    function glow(position, color) {
        var kitten = "";
        switch (position) {
            case "top":
                kitten = gameUI.top;
                break;
            case "right":
                kitten = gameUI.right;
                break;
            case "bottom":
                kitten = gameUI.bottom;
                break;
            case "left":
                kitten = gameUI.left;
                break;
            default:
                kitten = [position];
        }
        for (var b = 0; b < kitten.length; b++) {
            $("#H" + kitten[b]).animate({
                    backgroundColor: "black"
                },
                500
            );

            $("#H" + kitten[b]).animate({
                    backgroundColor: color
                },
                500
            );
        }

        if (position === "top") {
            purr(topSound);
        } else if (position === "right") {
            purr(rightSound);
        } else if (position === "bottom") {
            purr(bottomSound);
        } else if (position === "left") {
            purr(leftSound);
        } else {
            purr(extraSound);
        }
    }

    //RANDOMLY SELECT A BUTTON AND NUNBER OF GLOWS
    function randomButton() {
        var randoBut = Math.floor(Math.random() * 4);
        runningTallyAI.push([randoBut]);
        return runningTallyAI;
    }

    //TIME AND PACE OF THE AI BUTTON ANIMATIONS
    function buttonTiming(stuff, speed) {
        //INCREASE SPEED EVERY 5 LEVELS PLUS A LITTEL ANIMATION TO LET THE USER KNOW
        if (speed % 5 === 0) {
            time = time / 1.4;
            $("body").animate({
                    backgroundColor: "#162252"
                },
                200
            );

            $("body").animate({
                    backgroundColor: "black"
                },
                800
            );
        }
        clearInterval(objIntervalA);
        objIntervalA = setInterval(function() {
            buttonCycle(stuff);
        }, time);
    }

    //CYCLE THROUGH & ANIMATE runningTallyAI ELEMENTS
    function buttonCycle(times) {
        var tempTimes = times.slice();
        if (tempTimes.length === 1) {
            glow(buttonChoice[tempTimes[0]], buttonColor[tempTimes[0]]);
            tempTimes.shift();
            clearInterval(objIntervalA);
        } else if (tempTimes.length > 1) {
            glow(buttonChoice[tempTimes[0]], buttonColor[tempTimes[0]]);
            tempTimes.shift();
            buttonTiming(tempTimes, 1);
        }
    }

    //TOGGLE THE NOTICE DIVS
    function noticeFace(status) {
        if (status === "strict" || status === "won") {
            $("#casMsg, #marketing").hide();
            $("#gameOver, #playAgainButtons").show();
            $(".notice").fadeIn(500);
        } else if (status === "casual") {
            $("#marketing, #gameOver, #playAgainButtons").hide();
            $("#casMsg").show();
            $(".notice").fadeIn(500);
        } else if (status === "marketing") {
            $("#playAgainButtons, #gameOver, #casMsg").hide();
            $("#marketing").fadeIn(500);
        }
    }

    //CHECK USER ANSWERS & END OF GAME
    function tallyCheck(user, ai) {
        console.log("AI: ", runningTallyAI, " || USER: ", runningTallyUSER);
        if (user.length === ai.length) {
            for (var l = 0; l < user.length; l++) {
                if (user[l][0] !== ai[l][0]) {
                    if (gameMode === "STRICT") {
                        console.log("you done hit the wrong button || game over man!");
                        runningTallyAI = [];
                        runningTallyUSER = [];
                        roundCounter = 1;
                        $("#H132").css({
                            'text-align': 'center',
                            'font-size': '2vw',
                            'padding-top': '0.4vw'
                        });
                        $("#H132").html("0" + roundCounter);
                        $("#winOrLose").html("lost");
                        noticeFace("strict");
                    } else {
                        //TODO on hover remove message then start back up
                        //BUG buttonTiming KEEPS GOING , NEED TO BORROW MY PAUSE CODE FROM POMODORO
                        //wrap this in a conditional with the hover event
                        // clearInterval(objIntervalA);
                        // buttonTiming(runningTallyAI, 1);
                        // $(".notice").hover(function() {
                        //     console.log("oh shit");
                        //     $(this).hide();
                        // });
                        noticeFace("casual");
                        setTimeout(function() {
                            $(".notice").hide();
                            buttonTiming(randomButton(), roundCounter);
                        }, 2000);
                    }
                }
            }
            if (gameOverCheck() === true) {
                console.log("you done won!!!");
                runningTallyAI = [];
                runningTallyUSER = [];
                roundCounter = 1;
                $("#winOrLose").html("won");
                noticeFace("won");
                // TODO what is going on here?
            } else if (runningTallyAI.length >= 1) {
                roundCounter += 1;
                $("#H132").css({
                    'text-align': 'center',
                    'font-size': '2vw',
                    'padding-top': '0.4vw'
                });
                $("#H132").html("0" + roundCounter);
                runningTallyUSER = [];
                setTimeout(function() {
                    buttonTiming(randomButton(), roundCounter);
                }, 2000);
            }

            //DONT THINK THIS IS POSSIBLE REALLY
        } else if (user.length > ai.length) {
            console.log("you done hit too many buttons || game over man!");
            runningTallyAI = [];
            runningTallyUSER = [];
            roundCounter = 1;
            $("#H132").html(roundCounter);
        }
    }

    //BUTTON SPECIFIC
    $(".hex-img").click(function() {
        var catsup = this.id;
        if (gameUI.top.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([0]);
            glow(buttonChoice[0], buttonColor[0]);
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (gameUI.right.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([1]);
            glow(buttonChoice[1], buttonColor[1]);
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (gameUI.bottom.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([2]);
            glow(buttonChoice[2], buttonColor[2]);
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (gameUI.left.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([3]);
            glow(buttonChoice[3], buttonColor[3]);
            tallyCheck(runningTallyUSER, runningTallyAI);
            //START
        } else if (catsup === "H208") {
            $(".notice").hide();
            if (roundCounter === 1) {
                //REMOVE 20/5 AFTER SEEING THAT IT DONT FUCK UP THE COUNTER
                // $("#H132").css({
                //     'text-align': 'center',
                //     'font-size': '2vw',
                //     'padding-top': '0.4vw'
                // });
                $("#H132").html("0" + roundCounter);
                runningTallyAI = [];
                buttonTiming(randomButton(), 1);
            }
            //MENU
        } else if (catsup === "H61") {
            purr(extraSound);
            buttonFlourish();
            $(".banner").toggle("slide", {
                direction: 'left'
            });
            //MODE
        } else if (catsup === "H203") {
            if (roundCounter === 1) {
                if (gameMode === "STRICT") {
                    gameMode = "CASUAL";
                    $("#H203").css({
                        "background-color": "#EE82EE"
                    });
                } else {
                    gameMode = "STRICT";
                    $("#H203").css({
                        "background-color": "white"
                    });
                }
            }
            $("#moder").html(gameMode);
        } else if (catsup === "H132") {
            purr(extraSound);
        } else {
            var cutID = catsup.substring(1, 4);
            glow(cutID, "#200000");
        }
    });

    //GAME OVER BUTTONS
    $(".again").click(function() {
        if ((this.id) === "yes") {
            $(".notice").hide();
            $("#H132").html("0" + roundCounter);
            runningTallyAI = [];
            buttonTiming(randomButton(), 1);
        } else {
            noticeFace("marketing");
        }
    });

    $(".hex-img").hover(function() {
        $("#tester").html(this.id);
    });

    //OPENING ANIMATION & ON MENU PUSH
    function buttonFlourish() {
        for (var i = 0; i < buttonColor.length; i++) {
            var str = [i];
            for (var j = 1; j < 4; j++) {
                str.push((i + j) % buttonColor.length);
            }
            for (var e = 0; e < gameUI.top.length; e++) {
                $("#H" + gameUI.top[e]).animate({
                        backgroundColor: buttonColor[str[1]]
                    },
                    500
                );
                $("#H" + gameUI.right[e]).animate({
                        backgroundColor: buttonColor[str[2]]
                    },
                    500
                );
                $("#H" + gameUI.bottom[e]).animate({
                        backgroundColor: buttonColor[str[3]]
                    },
                    500
                );
                $("#H" + gameUI.left[e]).animate({
                        backgroundColor: buttonColor[str[0]]
                    },
                    500
                );
            }
        }
    }

    function startcountdown(cat) {
        clearInterval(objInterval);
        objInterval = setInterval(function() {
            openingShow(cat);
        }, 1);
    }

    function openingShow(him) {
        //STOP OPERATING AFTER GOING THROUGH ALL HEXES
        if (him < 1) {
            clearInterval(objInterval);
            buttonFlourish();
        } else {
            //11s
            if (col === 0) {
                if (bob > 243) {
                    clearInterval(objInterval);
                    bob = him + 10;
                    col = 1;
                    startcountdown(bob);
                } else {
                    $("#H" + bob).fadeIn(500);
                    bob += 21;
                }
                //10s
            } else {
                if (bob > 243) {
                    clearInterval(objInterval);
                    bob = him - 11;
                    col = 0;
                    startcountdown(bob);
                } else {
                    $("#H" + bob).fadeIn(250);
                    bob += 21;
                }
            }
        }
    }
    startcountdown(bob);
});
