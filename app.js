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
    var openCards, moves, totalCards, winner;
    winnerCalled = false;
    openCards = [];
    getDeck();
    totalCards = 16;
    /**gets new deck by resetting all parent classes in card list to 'card'
    * - calls various functions:
    + - shuffle()
    + - displayCard()
    + - moveCounter()
    * - sets restartButton
    */
    function getDeck(){
      var cardTypes, shuffledCards, deck;
      cardTypes = ["diamond","paper-plane-o","anchor","bolt", "cube","anchor", "leaf", "bicycle","diamond","bomb","leaf","bomb","bolt","bicycle", "paper-plane-o","cube"];
      shuffledCards = shuffle(cardTypes);
      $('.card').each(function(index){
        $(this).children().attr("class", "fa fa-" + shuffledCards[index]);
      })
      deck = $('.deck').children('*');
      moves = 0;
      moveCounter();
      displayCard(deck);
      restart();

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
            $("div").remove("#winner");
            winnerCalled = false;
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
          format: '%h:%m:%s'
        },'start');
      }

      if (state === "reset"){
        $("#timer").timer({
          //format: '%H:%M:%S',
        }, 'reset');
        $("#timer").timer({
          format: '%H:%M:%S',
        }, 'remove');
      //  $("#timer").timer('remove');
      //  $("#timer").timer('remove');
      }

      if (state === "win"){
        $("#timer").timer('remove');
        return $("#timer").timer('seconds');
      }
    }
    /** removes all cards from screen with 'puff' effect
    * - prints winning message on screen
    */
    function winner(){
      //$('.deck').hide('explode');
      var finishTime = callTimer('win');
      var message = "you finished!\nYour score is: " + moves + "\nYou finished in " + finishTime;
      alert(message);
      //alert(finishTime);
      //$('body').append("<div><script>document.write(moves)</script></div>");
      //winnerCalled = true;

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
            //console.log("shcek");
            checkCard($(this));
            (openCards.length === totalCards) ? winner():null;
          }
        });
      });
    };

    /** function checks if clicked card is a match
    * - first check whether there is a card open ie. list is not even
    * - if even - return
    * - if odd - check if it's match - if match call keepOpen
    * - if no match call resestCards
    */
    function checkCard(card){
      var userGuess, listIsEven;
      //userGuess = getSymbol(card);
      listIsEven = isEven(openCards.length);
      if (listIsEven) {
        openCards.push(card);
        return;
      }
      else{
        moveCounter();
        var secondCard = openCards[openCards.length-1];
        isMatch(card, secondCard);
      }
    };
    
    /** called when no match is found
    * - removes 'show open' class from open card after __milliseconds
    * - removes last card from openCards
    */
    function resetCards(firstCard, secondCard){
      //var lastGuess = $('.deck').find(className);
      openCards.pop();
      //var num = lastGuess.length-1;
      //console.log(lastGuess[num-1].hasClass("match"));
      //if (lastGuess.hasClass('noMatch') === false){
        firstCard.addClass('noMatch', 800);
        secondCard.addClass('noMatch', 800);
        firstCard.effect("shake",{distance:15, times:3},1000);
        secondCard.effect("shake",{distance:15, times:3},1000);
      //}
      setTimeout(function(){
    //    console.log(lastGuess);
        firstCard.removeClass('noMatch');
        firstCard.removeClass('show open' );
        secondCard.removeClass('noMatch');
        secondCard.removeClass('show open');
      }, 2000);
    }

    
    
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
      console.log(openCards[openCards.length-1]);
      resetCards(openCards[openCards.length-1],card);
    }

    /** params are two matching cards
    * - adds 'match' class to both
    * - adds last card to openCards list
    */
    function keepOpen(matchCard, firstCard){
      matchCard.switchClass('show open', 'match');
      firstCard.switchClass('show open', 'match');
      openCards.push(matchCard);
    }


      /** updates move counter on screen after two cards are clicked
      */
    function moveCounter(){
      $('span.moves').text(moves);
      starRating();
      moves ++;

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
