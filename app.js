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
     //updates move counter on screen
     function moveCounter(){
      $('span.moves').text(moves);
      moves ++;
    };
    //remove all extra classes from cards, reset openCards, reset moveCounter
    function resetDeck(){
      $('.card').each(function(){
        $(this).removeClass('show open');
        $(this).removeClass('match');
        openCards = [];
        moves = 0;
        moveCounter();

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

      //called when no match is found
      //removes 'show open' class from open card after 300 milliseconds
      //removes last card from openCards
      function resetCards(){
        var lastGuess = $('.deck').find('.show');
        setTimeout(function(){
          lastGuess.removeClass('show open');
        },300);
        openCards.pop();
      };
   
      //locate open cards - removes extra classes
      //switches 'match' class for card and lastGuess
      //adds last card's symbol to openCards
      function keepOpen(card){
        var userGuess = getSymbol(card);
        card.switchClass('show open', 'match');
        var lastGuess = $('.deck').find('.show');
        lastGuess.switchClass('show open', 'match');
        openCards.push(userGuess);
      };
   
      //compares previous  card with present 
      //if same return true else fase
      function isMatch(userGuess){
        //get last element from openCards
        lastGuess = openCards[openCards.length-1];
        return (lastGuess === userGuess) ? true : false;
      };

      //returns the class of the reverse side of card 
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
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
