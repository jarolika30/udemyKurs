/*
GAME RULES:

- The game has 1 player
- The task is to guess a word
- The player types a letter. If there is in the word such a letter, 
the player continues the game. If not, then he looses.
- The count of mistakes is limited


*/

//GLOBAL VARIABLES

/*
. words - array of all words;
. word - the player has to guess;
. result - guessed letters;
. countMistakes - number of attempts

*/

var words = [];
var word;
var result;
var countMistakes;



//For starting new game

document.querySelector('#begin').addEventListener('click', e =>{
	e.preventDefault();
	
	word = getWord();
	
	hideForm();
	
	setTimeout(showForm, 1000 );

	displayWord(word);

	init();
});

// leave the game

document.querySelector('#exit').addEventListener('click', e =>{
	e.preventDefault();
	document.querySelector('#wrap').innerHTML='';
	document.querySelector('#wrap').innerHTML='<h1 id = "goodBye" style="font-size:70px;' +
	 'color:blue; display:inline-block; margin-top:10%">See you later!!!</h1>';
});

// after each confirming the inputted letter

document.querySelector('#form1').addEventListener('submit', e => {

	e.preventDefault();
	
	let letter = recieveLetter();
	
	if(letter.length > 1 || letter === '' || letter === ' ') {
		let message = 'Input ONE letter!';
		showMessage(message);
	} else if (letter !== '') {
		updateResults(letter);
	} 
});

// random word choice

function getWord() {
	//read it from file or DB
	words = ['авантюрист', 'баклуши', 'деликатес', 'кикбоксинг', 'сведение', 
	'фальшивомонетчик','цветоводство','юрта','идеолог','уважение'];
	let index = Math.floor(Math.random() * words.length);
	return words[index];
}

// show the word to the player
function displayWord(word) {
	let res =[];
	for (var i = 0; i < word.length; i++){
		res[i]= '_ ';
	}
	result = res;
	document.querySelector('#word').innerHTML = res.join('');
}

// initianalization of state of page

function init() {
	countMistakes = 5;
	document.querySelector('#count').innerHTML = `Count of mistakes: <span>${countMistakes}</span>`;
}

// show updated result of state

function updateResults(letter) {

	let found = isLetterInAnswer(letter);
	showResults(found);

	let guessing = result.join('');
	
	if(isLooser()){
		showResultsOfGame(false);
	}else if( isWinner(guessing)){
		showResultsOfGame(true);
	}
	
}

// if a letter is guessed, we show it in the right position
function showResults(type) {
	if(type === true) {
		document.querySelector('#word').innerHTML = result.join('');	
		
	}else{
		document.querySelector('#letter').style.background = 'red';
		setTimeout(() => {
			document.querySelector('#letter').style.background = 'white';
		}, 1000);
		document.querySelector('#count').innerHTML = `Count of mistakes: <span>${countMistakes}</span>` ;
	}
}

// if the player won

function congratulations() {

 	const divForm = document.querySelector('#form');
 	
	divForm.style.display = 'none';
	
	var markup = `
	<div id ="main">
    </div>
    <div id ="resText">
        <h1 class ='winn'>Congratulations,</h1>
        <h1 class ='winn'>You WON!!!</h1>
		<h1 class ='winn'>:)</h1>
		
    </div>
    `; 
	
	
	document.querySelector('#wrap').style.minHeight =  '670px';
    document.querySelector('#all').insertAdjacentHTML('beforeend', markup);
    document.querySelector('#main').style.backgroundImage =  'url(happy.jpg)';
 	document.querySelector('#resText').style.backgroundImage = 'linear-gradient(rgba(176, 183,198 , 1), rgba(130, 181, 232, 1))';
}

// if the player lost

function apologize() {
	const divForm = document.querySelector('#form');
	divForm.style.display = 'none';
	document.querySelector('#all').innerHTML = '<span id="resWord">Write answer:<br/>' + word + '</span>';
	var markup = `
	<div id ="main">
    </div>
    <div id ="resText">
        <h1 class ='loose'>Sorry,</h1>
        <h1 class ='loose'>You lost!!!</h1>
        <h1 class ='loose'>:(</h1>
        
    </div>
    `;
	
	document.querySelector('#wrap').style.minHeight =  '670px';
    document.querySelector('#all').insertAdjacentHTML('beforeend', markup);
}

//show the form for input a letter

function showForm() {
	document.querySelector('#form').style.display = 'block';
}

//hide the form for input a letter

function hideForm() {
	document.querySelector('#form').style.display = 'none';
}

//recieve input from user

function recieveLetter() {

	let letter = document.querySelector('#letter').value.toLowerCase();
	document.querySelector('#letter').value = '';
	return letter;
}

//show a warning message for user

function showMessage(message) {

	let spanMessage = document.querySelector('#message');
	spanMessage.style.color = 'red';
	spanMessage.innerHTML = message;

	setTimeout(() => {
		spanMessage.innerHTML = '';
	}, 2000);

}

// hide the result of game

function hideResults() {
	document.querySelector('#all').innerHTML = '';
	
}

function isLooser() {
	return (countMistakes === 0) ? true : false;
}

function isWinner(guessingWord) {
	return (guessingWord.localeCompare(word) === 0 ) ? true : false;
}

function showResultsOfGame(endGame) {
	if(endGame){
		congratulations();
		setTimeout(hideResults,7000);
	}else{
		apologize(); 
		setTimeout(hideResults,7000); 
	}
	
}

function isLetterInAnswer(letter) {
	var found = false;
	for (var i = 0; i < word.length; i++) {

		if (letter === word[i]) {

			result[i] = letter;
			found = true;
			
		}
	}
	
	if (!found) {
		countMistakes--;
	}

	return found;
}