
$(document).ready(function() {
    var openCards, moves, totalCards, winner, winnerCalled, cardTypes, stars;
    cardTypes = ["diamond","paper-plane-o","anchor","bolt", "cube","anchor", "leaf", "bicycle","diamond","bomb","leaf","bomb","bolt","bicycle", "paper-plane-o","cube"];
    openCards = [];
    totalCards = 16;

   /*
    * - retrieves/validates playerName and calls getDeck()
    */
    start();
    function start(){
      winnerCalled = false;
      stars = 3;
      document.getElementById("inputName").reset();//code from https://www.w3schools.com/jsref/met_form_reset.asp
      $("form").show();
      $(".deck").hide();
      $(".score-panel").hide();
      $("#button").click(function(e){ //form validation  html and javascript code from https://code.tutsplus.com/tutorials/submit-a-form-without-page-refresh-using-jquery--net-59
        e.preventDefault();
        var val = $("input#playerName").val();
        if (val === "") {
          $("#playerName").attr("placeholder", "REQUIRED FIELD"); //https://stackoverflow.com/questions/9232810/change-placeholder-text-using-jquery
          return false;
        }
        playerName = $("#playerName").val();
        $("form").hide();
        $("#player").remove();
        $(".score-panel").prepend("<h2 id='player'> " + playerName + "</h2>");
        getDeck();
      })
    }

    /**
    * - gets new deck by resetting all parent classes in card list to "card"
    * - calls various functions:
    + - shuffle()
    + - displayCard()
    + - moveCounter()
    * - sets restartButton
    */
    function getDeck(){
      var shuffledCards, deck;
      $(".deck").show("explode", 1000);
      $(".score-panel").show();

      shuffledCards = shuffle(cardTypes);
      $(".card").each(function(index){
        $(this).show("explode" );
        $(this).children().attr("class", "fa fa-" + shuffledCards[index]);
      })
      deck = $(".deck").children();
      moves = 0;
      moveCounter();
      displayCard(deck);
      restart();
      }

    /**
    * - remove all open/match/flip classes and reset openCards
    * - reset star rating
    * - if game over (winnerCalled) explodes deck calls start()
    */
    function restart(){
        restartButton = $("div.restart").children();
        restartButton.unbind().click(function(){
          $(".card").each(function(){
            $(this).removeClass("show open match flip");
            $("#star1").attr("class","fa fa-star");
            $("#star2").attr("class","fa fa-star");
            $("#star3").attr("class","fa fa-star");
            openCards = [];
            getDeck();
            callTimer("reset");
          });
          if (winnerCalled !== false){
            $(".deck").hide("explode",1000);
            setTimeout(function(){
              start();
            },1000)
          }
        })
    }
    /**
    * - timer script from: https://cdnjs.cloudflare.com/ajax/libs/timer.jquery/0.7.0/timer.jquery.js
    * - paramaters is state: reset, start, win
    * - calls timer function depending on state
    */
    function callTimer(state){
      if (state === "start"){
        $("#timer").timer({
          format: "%H:%M:%S"
        },"start");
      }

      if (state === "reset"){
        $("#timer").timer("remove");
        $("#timer").timer({
          format: "%H:%M:%S"
          },"start");
        $("#timer").timer("remove");
        }
      if (state === "win"){
        $("#timer").timer("remove");

      }
    }

    /**
    * - displays winning alert message
    * - freezes timer until restart clicked
    */
    function winner(){
      var finishTime = $("#timer").data("seconds");
      var finalStars;
      if (stars === 1){
        finalStars = "star";
      }
      else {
        finalStars = "stars";
      }
      var winningMessage = "Congrats " + playerName + "!!\nYou got: " + stars + " " + finalStars + "\nYou finished in: " + moves + "\nYour time was: " + finishTime + "seconds.";
      winnerCalled = true;
      callTimer("win");
      setTimeout(function(){
        alert(winningMessage);
      },600)
    };

    /** add event listern to each card - on click add class show open
    * - if already clicked return
    * - else reveal card "show open"
    * - call "checkCard" with clicked card
    */
    function displayCard(deck){
      deck.each(function(){
        $(this).click(function(){
          (winnerCalled === false) ? callTimer("start"): null;
          if ($(this).hasClass("flip")){
            return;
          }
          else{
            var flipCard = $(this);
            flipCard.addClass("open");
            flipCard.addClass("flip");
            setTimeout(function(){
               flipCard.addClass("show");
             }, 150);
            checkCard(flipCard);
          }
        })
      })
    };

    /** function checks if clicked card is a match
    * - first check whether there is a card open ie. list is not even
    * - if even - return
    * - if odd - check if it"s match - if match call keepOpen
    * - if no match call resestCards
    */
    function checkCard(card){
      var userGuess, listIsEven;
      listIsEven = isEven(openCards.length);
      if (listIsEven) {
        openCards.push(card);
        return;
      }
      else{
        isMatch(card);
      }
    };

    /** compares last clicked card with present clicked
    * - get last element from openCards
    * - if same return true
    * - if for loop exists - no match - call resetCards()
    */
    function isMatch(card){
      var userGuess = getSymbol(card);
      for(i=0; i < openCards.length; i++){
        if (getSymbol(openCards[i]) === userGuess){
          keepOpen(card, openCards[i]); // fix this
          return;
        }
      }
      var secondCard = openCards[openCards.length-1];
      resetCards(card, secondCard);
    }

    /** called when no match is found
    * - runs noMatch animation by adding and then removing classes
    */
    function resetCards(firstCard, secondCard){
      moveCounter();
      openCards.pop();
      firstCard.addClass("noMatch", 800).effect("shake", {distance:15, times:3}, 1000);
      secondCard.addClass("noMatch", 800).effect("shake", {distance:15, times:3}, 1000);
      setTimeout(function(){
        firstCard.removeClass("flip");
        secondCard.removeClass("flip");
      }, 2000);
      setTimeout(function(){
        firstCard.removeClass("noMatch").removeClass("show open");
        secondCard.removeClass("noMatch").removeClass("show open");
      }, 2150);

    }



    /** params are two matching cards
    * - adds "match" class to both
    * - adds last card to openCards list
    */
    function keepOpen(matchCard, firstCard){
      matchCard.switchClass("open", "match",1000);
      firstCard.switchClass("open", "match",1000);
      openCards.push(matchCard);
      moveCounter();
    }


      /** updates move counter on screen
      */
    function moveCounter(){
      $("span.moves").text(moves);
      starRating();
      if (openCards.length === totalCards) {
        winner();
        return;
      }
      else{
        moves ++;
      }
    };
   /*
    * - updates on screen star rating
    * - when moves = x star is hollowed out on screen
    */
    function starRating(){
      const twoStars = 15;
      const oneStar = 20;
      const zeroStars = 25;
      if (moves === twoStars){
        $("#star1").attr("class","fa fa-star-o");
        stars = 2;
      }
      if (moves === oneStar){
        $("#star2").attr("class","fa fa-star-o");
        stars = 1;
      }
      if (moves === zeroStars){
        $("#star3").attr("class","fa fa-star-o");
        stars = 0;
      }
    }

    /** accepts card param - returns only the icon/symbol
    */
    function getSymbol(card){
      symbol = card.children().attr("class");
      return symbol;
    };

}); //jquery close bracket


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// returns true if num is even else false
function isEven(num){
  if (num % 2 === 0) {
    return true;
  }
  else{
    return false;
  }
};
