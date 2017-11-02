/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//starts game with new shuffled deck
$(document).ready(function() {
    var openCards, moves, totalCards, winner, winnerCalled,cardTypes;
    cardTypes = ["diamond","paper-plane-o","anchor","bolt", "cube","anchor", "leaf", "bicycle","diamond","bomb","leaf","bomb","bolt","bicycle", "paper-plane-o","cube"];
    winnerCalled = false;
    openCards = [];
    //getDeck();
    totalCards = 16;

    start();
    function start(){
      $("form").show();
      $('.deck').hide();
      $('.score-panel').hide();
      //$('.card').hide();
      $('.error').hide();
      $('#button').click(function( e ){ //https://code.tutsplus.com/tutorials/submit-a-form-without-page-refresh-using-jquery--net-59
        e.preventDefault();
        var val = $("input#playerName").val();
        if (val == "") {
          //$("label#name_error").show();
          $("#playerName").attr("placeholder", "REQUIRED FIELD"); //https://stackoverflow.com/questions/9232810/change-placeholder-text-using-jquery
          return false;
        }
        var val;
        playerName = $("#playerName").val();
        $("form").hide();
        $('.score-panel').prepend('<h2 id="player"> '+playerName+'</h2>');
        getDeck();
      })
    }
    /**gets new deck by resetting all parent classes in card list to 'card'
    * - calls various functions:
    + - shuffle()
    + - displayCard()
    + - moveCounter()
    * - sets restartButton
    */

    function getDeck(){
      var shuffledCards, deck;
      $('.deck').show("explode", 1000);
      $('.score-panel').show();
      //$('.deck').children('*').show("explode" );

      shuffledCards = shuffle(cardTypes);
      $('.card').each(function(index){
        $(this).show("explode" );
        $(this).children().attr("class", "fa fa-" + shuffledCards[index]);
      })
      deck = $('.deck').children();
      moves = 0;
      moveCounter();
      displayCard(deck);
      restart();
      }

      function validateForm() {
      var x = document.forms["player"]["playerName"].value;
      console.log(x);
      if (x == "") {
          alert(x);
          return false;
      }
      }
    /** remove all open classes and reset openCards
    / - reverse explode effect
    / - remove winner message
    */
    function restart(){
      //  console.log(callTimer('win'));
        restartButton = $('div.restart').children();
        restartButton.unbind().click(function(){
            $('.card').each(function(){
                $(this).removeClass('show open');
                $(this).removeClass('match');
                openCards = [];
                getDeck();
                callTimer('reset');
              });
          if (winnerCalled !== false){
            $('.deck').show("explode");
            //$("div").remove("#winner");
            winnerCalled = false;
            start();
          }
        })
      }
    /** @params is string
    * - accepts as state: reset, start, win
    * - calls timer function FIX THIS
    */
    function callTimer(state){
      if (state === "start"){
        $("#timer").timer({
          format: '%H:%M:%S'
        },'start');
      }

      if (state === "reset"){
        $("#timer").timer('remove');
        $("#timer").timer({
          format: '%H:%M:%S'
          },'start');
        $("#timer").timer('remove');
        }
      if (state === "win"){
        $("#timer").timer('remove');
        //return $("#timer").data('seconds');

      }
    }
    /** removes all cards from screen with 'puff' effect
    * - prints winning message on screen
    */
    function winner(){
      $('.deck').hide('explode');
      var finishTime = $("#timer").data('seconds');
      var message = "you finished!\nYour score is: " + moves + "\nYou finished in " + finishTime + " second";
      alert(message);

    };

    /** add event listern to each card - on click add class show open
    * - if already clicked return
    * - else reveal card 'show open'
    * - call 'checkCard' with clicked card
    */
    function displayCard(deck){
      deck.each(function(){
        $(this).click(function(){
          callTimer('start');
          if (($(this).hasClass("show open")) || ($(this).hasClass("match"))){
            return;
          }
          else{
            $(this).addClass("show open");
            checkCard($(this));
          }
        })
      })
    };

    /** function checks if clicked card is a match
    * - first check whether there is a card open ie. list is not even
    * - if even - return
    * - if odd - check if it's match - if match call keepOpen
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
    * - removes 'show open' class from open card after __milliseconds
    * - removes last card from openCards
    */
  //  var num = 0
    function resetCards(firstCard, secondCard){
      moveCounter();
      openCards.pop();
      firstCard.addClass('noMatch', 800).effect("shake",{distance:15, times:3},1000);
      secondCard.addClass('noMatch', 800).effect("shake",{distance:15, times:3},1000);
      setTimeout(function(){
        firstCard.removeClass('noMatch').removeClass('show open' );
        secondCard.removeClass('noMatch').removeClass('show open');
      }, 2000);
    }



    /** params are two matching cards
    * - adds 'match' class to both
    * - adds last card to openCards list
    */
    function keepOpen(matchCard, firstCard){
      matchCard.switchClass('show open', 'toMatch',500);
      matchCard.switchClass('toMatch', 'match', 500);
      firstCard.switchClass('show open', 'toMatch',500);
      firstCard.switchClass('toMatch', 'match', 500);
      openCards.push(matchCard);
      console.log(openCards);
      console.log(matchCard, firstCard);
      moveCounter();
    }


      /** updates move counter on screen after two cards are clicked
      */
    function moveCounter(){
      $('span.moves').text(moves);
      starRating();
      (openCards.length === totalCards) ? winner():null;
      moves ++;
      //console.log(openCards.length);
    };

    function starRating(){
      const twoStars = 15;
      const oneStar = 20;
      const zeroStars = 25;
      moves === twoStars ? $("#star1").attr('class','fa fa-star-o'):null;
      moves === oneStar ? $("#star2").attr('class','fa fa-star-o'):null;
      moves === zeroStars ? $("#star3").attr('class','fa fa-star-o'):null;
    }

    /** accepts card param - returns only the icon/symbol
    */
    function getSymbol(card){
      symbol = card.children().attr('class');
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
