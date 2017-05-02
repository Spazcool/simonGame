$(document).ready(function() {
    var aCounter = 0,
        objInterval = 0,
        buttonChoice = ["top", "right", "bottom", "left"],
        buttonColor = ["red", "green", "blue", "yellow"],
        gameUI = {
            home: 56,
            howTo: 61,
            diffMode: 203,
            startReset: 208,
            roundCount: 132,
            top: [48, 58, 59, 69, 79, 80],
            bottom: [184, 185, 195, 205, 206, 216],
            left: [109, 119, 129, 140, 151, 130],
            right: [113, 124, 134, 135, 145, 155]
        },
        runningTallyAI = [],
        runningTallyUSER = [],
        roundCounter = 1,
        gameMode = "strict",
        topSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16275_1460570774.mp3")],
        rightSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16296_1460570779.mp3")],
        bottomSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16297_1460570779.mp3")],
        leftSound = [new Audio("http://www.freesfx.co.uk/rx2/mp3s/4/16298_1460570779.mp3")],
        extraSound = [new Audio("http://www.gravomaster.com/alarm/sounds/chime-low.mp3")],
        // cat = true,
        dog = 0,
        time = 1000;
    //BUG ARRAY KEEP FILLING WITH EVERY CALL, NEED TO HAVE IT RESET EVERYTIME
    //FILLS THE AUDIO ARRAYS WITH 5 "CHANNELS" TO PLAY FROM
    function fillArray(arr) {
        var tempArr = [];
        tempArr = arr;
        for (var i = 0; i < 4; i++) {
            tempArr.push(arr[0]);
        }
        return tempArr;
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
        if (dog < 5) {
            sound[dog].play();
            dog += 1;
        } else {
            dog = 0;
        }
    }

    //ANIMATION OF THE BUTTONS & CALL FOR SOUND
    function glow(position, color) {
        // $("#" + position).animate({
        //         backgroundColor: "white"
        //     },
        //     500
        // );
        // $("#" + position).animate({
        //         backgroundColor: color
        //     },
        //     500
        // );
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
                console.log("you done fucked up");
        }
        // for (var z = 0; z < times; z++) {
        for (var b = 0; b < kitten.length; b++) {
            console.log("H" + kitten[b]);
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
        // }

        if (position === "top") {
            console.log(topSound);
            purr(fillArray(topSound));
        } else if (position === "right") {
            purr(fillArray(rightSound));
        } else if (position === "bottom") {
            purr(fillArray(bottomSound));
        } else if (position === "left") {
            purr(fillArray(leftSound));
        } else {
            purr(fillArray(extraSound));
        }
    }

    //RANDOMLY SELECT A BUTTON AND NUNBER OF GLOWS
    function randomButton() {
        var randoBut = Math.floor(Math.random() * 4);
        runningTallyAI.push([randoBut]);
        return runningTallyAI;
    }

    //TIME AND PACE OF THE AI BUTTON ANIMATIONS
    //if i add the roundcount to the args can i use it to influence the timing?
    function buttonTiming(stuff, speed) {
        if (speed % 5 === 0) {
            time = time / 1.4;
        }
        console.log(time);
        clearInterval(objInterval);
        objInterval = setInterval(function() {
            buttonCycle(stuff);
        }, time);
    }

    //CYCLE THROUGH & ANIMATE runningTallyAI ELEMENTS
    function buttonCycle(times) {
        var tempTimes = times.slice();
        if (tempTimes.length === 1) {
            console.log(
                "1 runningTallyAI: ",
                runningTallyAI,
                " || tempTimes: ",
                tempTimes
            );
            glow(buttonChoice[tempTimes[0]], buttonColor[tempTimes[0]]);
            tempTimes.shift();
            clearInterval(objInterval);
        } else if (tempTimes.length > 1) {
            glow(buttonChoice[tempTimes[0]], buttonColor[tempTimes[0]]);
            console.log(
                "2 runningTallyAI: ",
                runningTallyAI,
                " || tempTimes: ",
                tempTimes
            );
            tempTimes.shift();
            console.log(
                "2.5 runningTallyAI: ",
                runningTallyAI,
                " || tempTimes: ",
                tempTimes
            );
            buttonTiming(tempTimes, 1);
        }
    }

    //CHECK USER ANSWERS & END OF GAME
    function tallyCheck(user, ai) {
        if (user.length === ai.length) {
            console.log("user ", user, " || ai ", ai);
            for (var l = 0; l < user.length; l++) {
                console.log("user l", user[l][0], " || ai l ", ai[l][0], " || LOOP #: ", l);
                if (user[l][0] !== ai[l][0]) {
                    if (gameMode === "strict") {
                        console.log("you done hit the wrong button || game over man!");
                        runningTallyAI = [];
                        runningTallyUSER = [];
                        roundCounter = 1;
                        $("#counter").html(roundCounter);
                    } else {
                        console.log("thats alright buddyh");
                        buttonTiming(runningTallyAI, 1);
                    }
                }
            }
            if (gameOverCheck() === true) {
                console.log("you done won");
                runningTallyAI = [];
                runningTallyUSER = [];
                roundCounter = 1;
            } else if (runningTallyAI.length >= 1) {
                console.log("breaking things? || runningTallyUSER: ", runningTallyUSER);
                roundCounter += 1;
                $("#counter").html(roundCounter);
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
            $("#counter").html(roundCounter);
        }
    }

    //BUTTON SPECIFIC
    $(".hex-img").click(function() {
        var catsup = this.id;
        if (gameUI.top.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([0]);
            glow("top", "red");
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (gameUI.right.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([1]);
            glow("right", "green");
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (gameUI.bottom.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([2]);
            glow("bottom", "blue");
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (gameUI.left.includes(Number(catsup.substring(1, 4)))) {
            runningTallyUSER.push([3]);
            glow("left", "yellow");
            tallyCheck(runningTallyUSER, runningTallyAI);
        } else if (catsup === "start") {
            //adds an AI chosen button to the list
            if (roundCounter === 1) {
                $("#counter").html(roundCounter);
                runningTallyAI = [];
                buttonTiming(randomButton(), 1);
            }

            //TODO GET THROUGH THESE BUTTONS FOR FINCTION AND ANIMATION
        } else if (catsup === "home") {
            console.log("home");
        } else if (catsup === "menu") {
            console.log("menu");
            purr(extraSound);
        } else if (catsup === "counter") {
            console.log("counter");
        } else if (catsup === "mode") {
            if (roundCounter === 1) {
                if (gameMode === "strict") {
                    gameMode = "casual";
                } else {
                    gameMode = "strict";
                }
            }
            $("#mode").html(gameMode);
            console.log(gameMode);
        }
    });

    $(".hex-img").hover(function() {
        $("#tester").html(this.id);
    });
});
