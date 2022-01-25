$(document).ready(function() {
    console.log(screen.height);
    var playing = false;
    var word = "";
    var guesses = 0;
    var letterRow = ['A','B','C','D','E'];
    var letterInWord = 1;
    var guessedWord = "";
    function getNewWord() {
        $("#info").html("Retrieving New Word");
        playing = false;
        guesses = 0;
        letterInWord = 1;
        $.ajax({
            url: "https://random-word-api.herokuapp.com/word?number=1",
            method: "GET"
          }).then(function(response) {
              var tempWord = response[0];
            //   try {
            //       var test = response.word.length;
            //       tempWord = response.word;
            //   } catch {
            //       tempWord = response[0].word;
            //   }
              console.log(tempWord);
            if (tempWord.length == 5) {
                word = tempWord.toUpperCase();
                console.log(word);
                $("#info").html("Make A Guess")
                playing=true;
            } else {
                console.log(tempWord +" is too long a word");
                getNewWord();
            }
          });
    }
    getNewWord();
    function checkWord(guess) {

        $.ajax({
            url: "https://api.dictionaryapi.dev/api/v2/entries/en/" + guess,
            method: "GET",
            success: function(response) {
                var def = response[0].meanings[0].definitions[0].definition;
                $("#info").html(def);
                if (word == guessedWord) {
                    $("#info").html("You Win!! Refresh to Play Again\n" + def );
                    playing = false;
                }
                for (let i = 0; i < 5; i++) {
                    var rLet = word.charAt(i).toUpperCase();
                    var tLet = guessedWord.charAt(i).toUpperCase();
                    console.log(word.toUpperCase().includes(tLet));
                    if (rLet == tLet) {
                        $("#"+tLet).addClass("right");
                        $("#" + letterRow[guesses] + (i+1)).addClass("right");
                    } else if (word.toUpperCase().includes(tLet)){
                        $("#"+tLet).addClass("close");
                        $("#" + letterRow[guesses] + (i+1)).addClass("close");
                    } else {
                        $("#"+tLet).addClass("wrong");
                        $("#" + letterRow[guesses] + (i+1)).addClass("wrong");
                    }
                }
                guesses++;
                letterInWord =1;
                guessedWord="";
                if (guesses >5) {
                    $("#info").html("Sorry! You Lose! Word was "+word+" Refresh to Play Again");
                    playing = false;
                }
            },
            error: function (e) {
                $("#info").html("Not in Word List");
            }
        })
    }
    $(".letter").click(function(button) {
        if (playing) {
            var guess = button.currentTarget.id;
            if (guess == "ENTER") {
                checkWord(guessedWord);
            } else if(guess == "UNDO") {
                if (letterInWord > 1) {
                    guessedWord = guessedWord.slice(0,-1);
                    letterInWord--;
                    $("#" + letterRow[guesses] + letterInWord).html("");
                }
                
            } else if (guesses < 5 && letterInWord < 6) {
                guessedWord = guessedWord +guess;
                $("#" + letterRow[guesses] + letterInWord).html(guess);
                letterInWord++;
                console.log(guessedWord);
            };
        }
    })
   
});
