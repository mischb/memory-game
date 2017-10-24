/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
   var i = 0;
var openCards = [];
//starts game with new shuffled deck
$(document).ready(function() {
  getDeck();
  //gets new deck by resetting all parent classes in card list to 'card' and shuffling cards
    function getDeck(){
      var cardTypes = ["diamond","paper-plane-o","anchor","bolt", "cube","anchor", "leaf", "bicycle","diamond","bomb","leaf","bomb","bolt","bicycle", "paper-plane-o","cube"];
      shuffledCards = shuffle(cardTypes);
      $('.card').each(function(index){
        $(this).children().attr("class", "fa fa-" + shuffledCards[index]);
      });
      deck = $('.deck').children('*');
      displayCard(deck);
      restartButton = $('div.restart').children();
      restartButton.click(function(){
        restartButton.unbind('click');
        resetDeck();
        getDeck();
      });
    };
    //remove all open classes and reset openCards
    function resetDeck(){
      $('.card').each(function(){
        $(this).removeClass('show open');
        $(this).removeClass('match');
        openCards = [];

      });
    };
    //add event listern to each card - on click add class show open
    //if already clicked return
    //then add card to temp array
    function displayCard(deck){
      deck.each(function(){
        $(this).click(function(){
          if   (($(this).hasClass("show open")) || ($(this).hasClass("match"))){
            return;
          }
          else{
            //$(this).effect("shake");
            $(this).addClass("show open");
            checkCard($(this));
          }
        });
      });
    };

    //function checks if clicked card is a match
    //first check whether there is a card open ie. list is not even
    //if even - return
    //if odd - check if it's match - if match call keepOpen
    //if no match call resestCards
    function checkCard(card){
      var userGuess, listIsEven;
      userGuess = getSymbol(card);
      listIsEven = isEven(openCards.length);
      if (listIsEven) {
        openCards.push(userGuess);
        return;
      }
      else{
        if (isMatch(userGuess)){
          keepOpen(card, userGuess);
        }
        else {
          resetCards();
        }
      }
    };

      //takes no params - fin
      function resetCards(){
        lastGuess = $('.deck').find('.show');
        setTimeout(function(){
          lastGuess.removeClass('show open');
        },300);
        openCards.pop();
      };

      function keepOpen(card){
        userGuess = getSymbol;
        card.removeClass('show open');
        card.addClass('match');
        lastGuess = $('.deck').find('.show');
        lastGuess.removeClass('show open');
        lastGuess.addClass('match');
        openCards.push(userGuess);
      };
      //compares last clicked card with present clicked
      //if same return true else fase
      function isMatch(userGuess){
        //get last element from openCards
        lastGuess = openCards[openCards.length-1];
        return (lastGuess === userGuess) ? true : false;
      };


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
//function takes int checks if its even - return true if even else false
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
