/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
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
      /*var deck;
      $('.restart').on('click',reset(deck));
      //reset(deck);*/
    };


    //add event listern to each card - if clicked reveal card
    //then add card to temp array
    function displayCard(deck){
      deck.each(function(){
        $(this).on('click', function(){
          $(this).hasClass('show open') ? void(0):$(this).addClass("show open");
          checkCard($(this));
        
        });


      //a = $('li.card').eq(0);
      //console.log($(this));
      });
    };

    //check if clicked card is a match
    function checkCard(card){
      var userGuess, listIsEven;
      userGuess = getSymbol(card);
      listIsEven = isEven(openCards.length);
      console.log(openCards);
      if (listIsEven) { //add guess to openCards
        openCards.push(userGuess);
        console.log(openCards);
        return;
      }
      else{
        if (isMatch(userGuess)){
          keepOpen(card);
          openCards.push(userGuess);
        } //change class to match push userGuess to list
        else {
          card.removeClass('show open');
          openCards.pop();

        }//change class to card pop last guess
      }


      function keepOpen(card){
        card.attr('class', 'card match');
        $('.deck').find('card show open');
        card.attr('card show open', 'card match')
      };

      function isMatch(userGuess){
        //get last element from openCards
        lastGuess = openCards[openCards.length-1];
        return (lastGuess === userGuess) ? true : false;
      };


      function getSymbol(card){
        symbol = card.children().attr('class');
        return symbol;
      };







    //  openCards.push(a);
      //console.log(openCards[openCards.length]);
      if (openCards.length > 1) {
            //openCards.push(a);
            //console.log(openCards);
            openCards.forEach(function(match){
              if (a === match){
                console.log(match);
                console.log(openCards)
                //add attr 'keep open'

              };
              //console.log(openCards);
            });
          };

    };


}); //jquery close bracket



//revert all cards to original state - takes in an array, changes all className to 'card'
function reset(array){
  //var i;
  for (var i = 0; i < array.length; i++){
    if (array[i].className === "card match" || array[i].className === "card open show"){
      array[i].className = "card";
    }
  }
  return array;
}
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
