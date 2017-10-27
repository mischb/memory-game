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
    winnerCalled = 0;
    openCards = [];
    getDeck();
    totalCards = 16;
    /**gets new deck by resetting all parent classes in card list to 'card'
    * - calls various functions:
    + - shuffle()
    + - displayCard()
    + -
    nter()
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
        restartButton = $('div.restart').children();
        restartButton.unbind().click(function(){
            $('.card').each(function(){
                $(this).removeClass('show open');
                $(this).removeClass('match');
                openCards = [];
                getDeck();
              });
          if (winnerCalled > 0){
            $('.deck').show("explode");
            winnerCalled = 0;
          }
        })
      }

    /** removes all cards from screen with 'puff' effect
    * - prints winning message on screen
    */
    function winner(){
      $('.deck').hide('explode');
      $('body').append("<div id = 'winner'>YOU WIN!! Your score was $('.moves')</div>");
      winnerCalled++;
    };

    /** add event listern to each card - on click add class show open
    * - if already clicked return
    * - else reveal card 'show open'
    * - call 'checkCard' with clicked card
    */
    function displayCard(deck){
      deck.each(function(){
        $(this).click(function(){
          if (($(this).hasClass("show open")) || ($(this).hasClass("match"))){
            return;
          }
          else{
            //$('.flip').flip();
            $(this).addClass("show open");
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
      resetCards('.show.open');
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

    /** called when no match is found
    * - removes 'show open' class from open card after __milliseconds
    * - removes last card from openCards
    */
    function resetCards(className){
      var lastGuess = $('.deck').find(className);
      openCards.pop();
      setTimeout(function(){
        lastGuess.effect("shake");
      }, 700);
      setTimeout(function(){
        lastGuess.removeClass('show open');
      }, 800);
    };

      /** updates move counter on screen after two cards are clicked
      */
    function moveCounter(){
      $('span.moves').text(moves);
      starRating();
      moves ++;

    };
    function starRating(){
      twoStars = 15;
      oneStar = 20;
      zeroStars = 25;
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
