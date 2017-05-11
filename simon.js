//TODO
//MENU SLIDE FROM THE RIGHT WITH INSTRUCTION
//THE MENU BUTTONS SEEEM A BIT WEAK TO ME

//NEED A BUTTON / POP UP FOR REPLAY
// a running function for the header height, checks on resize of the screen?
$(document).ready(function() {
    $(".hex-img").hide();
    var aCounter = 0,
        bob = 11,
        col = 0,
        objInterval = 0,
        buttonChoice = ["top", "right", "bottom", "left"],
        buttonColor = ["red", "green", "blue", "yellow"],
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
        ],
        dog = 0,
        time = 1000,
        hexContainer = $("#hexagonContainer").css("height");

    $("#leftPanel").height(hexContainer);
    $("#rightPanel").height(hexContainer);
    $(".banner").height(hexContainer);
    $(".banner").hide();



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
    //BUG STILL SKIPS ON OCCASION...
    function purr(sound) {
        console.log(dog, sound);
        if (dog < 4) {
            sound[dog].play();
            dog += 1;
        } else {
            dog = 0;
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
        console.log("length", kitten.length);
        for (var b = 0; b < kitten.length; b++) {
            $("#H" + kitten[b]).animate({
                    backgroundColor: "white"
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
        if (speed % 5 === 0) {
            time = time / 1.4;
        }
        clearInterval(objInterval);
        objInterval = setInterval(function() {
            buttonCycle(stuff);
        }, time);
    }

    //CYCLE THROUGH & ANIMATE runningTallyAI ELEMENTS
    function buttonCycle(times) {
        var tempTimes = times.slice();
        if (tempTimes.length === 1) {
            glow(buttonChoice[tempTimes[0]], buttonColor[tempTimes[0]]);
            tempTimes.shift();
            clearInterval(objInterval);
        } else if (tempTimes.length > 1) {
            glow(buttonChoice[tempTimes[0]], buttonColor[tempTimes[0]]);
            tempTimes.shift();
            buttonTiming(tempTimes, 1);
        }
    }

    //CHECK USER ANSWERS & END OF GAME
    function tallyCheck(user, ai) {
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
                    } else {
                        console.log("thats alright buddy, keep playing");
                        buttonTiming(runningTallyAI, 1);
                    }
                }
            }
            if (gameOverCheck() === true) {
                console.log("you done won!!!");
                runningTallyAI = [];
                runningTallyUSER = [];
                roundCounter = 1;
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
            //START BUTTON
        } else if (catsup === "H208") {
            if (roundCounter === 1) {
                $("#H132").css({
                    'text-align': 'center',
                    'font-size': '2vw',
                    'padding-top': '0.4vw'
                });
                $("#H132").html("0" + roundCounter);
                runningTallyAI = [];
                buttonTiming(randomButton(), 1);
            }

            //TODO GET THROUGH THESE BUTTONS FOR FINCTION AND ANIMATION
            //SPAZCOOL.COM BUTTON
        } else if (catsup === "H56") {
            console.log("home");
            //MENU WITH INFO ON HOW TO PLAY ETC
        } else if (catsup === "H61") {
            console.log("menu");
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
                } else {
                    gameMode = "STRICT";
                }
            }
            $("#H203").css({
                'text-align': 'center',
                'font-size': '1vw',
                'padding-top': '1.1vw'
            });
            $("#moder").css({
                'text-align': 'center',
                'font-size': '1vw',
                'padding-top': '1.1vw'
            });
            $("#H203").html(gameMode);
            $("#moder").html(gameMode);
            console.log(gameMode);
        } else if (catsup === "H132") {
            purr(extraSound);
        } else {
            var cutID = catsup.substring(1, 4);
            console.log(cutID);
            glow(cutID, "#200000");
        }
    });

    $(".hex-img").hover(function() {
        $("#tester").html(this.id);
    });

    //OPENING ANIMATION
    function buttonFlourish() {
        for (var i = 0; i < buttonColor.length; i++) {
            var str = [i];
            for (var j = 1; j < 4; j++) {
                str.push((i + j) % buttonColor.length);
            }
            // console.log(str);
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
        // console.log("him: ", him, " || bob: ", bob, " || col: ", col);
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
