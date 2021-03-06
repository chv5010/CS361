// set up global variables
let word = 0;
let wordScramble = 0;
let wordLength = 0;
let currentLocation = 0;

// activate on click for buttons if they are present
const instructionButton = document.querySelector('#instructionButton')
if (instructionButton != null) {
    instructionButton.onclick = instructions;
}

const startButton = document.querySelector('#start')
if (startButton != null) {
    startButton.onclick = startGame;
}

const newRoundButton = document.querySelector('#newRound')
if (newRoundButton != null) {
    newRoundButton.onclick = newRound;
}

// alert instructions when instructionbutton is clicked
function instructions() {
    alert("The purpose of this game is to fill in the correct word from a pool of \
    scrambled letters \n\n When all possible letters have been selected the text will \
    glow green if it is correct and red if it is not!");
}

//temp random number generator to return random index of a list
function randomIndex(array) {
    let randomNum = Math.floor(Math.random()*array.length)
    return array[randomNum]
}

// function to randomize letters of the word by randoming swapping indices
function randomize(word) {
    let list = word.split('');
    
    for (let i=0; i < list.length-1; ++i) {
        let randomNum = Math.floor(Math.random()*list.length)
        let tempSwap = list[i];
        list[i] = list[randomNum]
        list[randomNum] = tempSwap
    }

    word = list.join('');
    return word
}

function minMaxRand(min,max) {
    return Math.floor(Math.random()*(max-min) + min);
}

function getRequest(callback) {
    let baseUrl = 'http://localhost:5152/amount/1/length/';
    let length = minMaxRand(5,7);
    let url = baseUrl + length
    console.log("Get Request sent to port service host at port 5152")
    const http = new XMLHttpRequest();
    http.onload = function(){
        callback(http.responseText);
    };
    http.open('GET', url);
    http.send();
}

function startGame() {
    getRequest(function(GetWord) {
        let playZone = document.querySelector('#playZone');
        let startBtn = document.querySelector('#start');
        let answerZone = document.querySelector('#answerZone');
        startBtn.remove();

        // call microservice for random word and randomize letters
        word = GetWord.slice(2,-2)
        console.log(word)
        wordScramble = randomize(word);
        wordLength = word.length


        // create guess and answer buttons
        for (let i = 0; i < wordLength; i++) {
            let guessButton = document.createElement('BUTTON');
            let text = document.createTextNode(wordScramble[i]);
            guessButton.setAttribute("class", "guessButton");
            guessButton.setAttribute("id", "guessButton"+i);
            guessButton.append(text);
            playZone.appendChild(guessButton);

            let answerButton = document.createElement('BUTTON');
            answerButton.setAttribute("class","answerButton");
            answerButton.setAttribute("id", "answerButton"+i);
            answerZone.appendChild(answerButton);
            guessButton.onclick = guessButtonFunc;
        }

        // create reset letters button
        let buttonBox = document.querySelector('#resetBox')
        let resetButton = document.createElement('BUTTON');
        resetButton.setAttribute("id", "resetButton");
        resetButton.textContent = "Reset Letters"
        resetButton.onclick = resetGame;
        buttonBox.appendChild(resetButton);
    });
};

// reset button function to reset letters back to starting point
function resetGame() {
    let playZone = document.querySelector('#playZone');
    let answerZone = document.querySelector('#answerZone');
    playZone.textContent ='';
    answerZone.textContent='';
    for (let i = 0; i < wordLength; i++) {
        let guessButton = document.createElement('BUTTON');
        let text = document.createTextNode(wordScramble[i]);
        guessButton.setAttribute("class", "guessButton");
        guessButton.setAttribute("id", "guessButton"+i);
        guessButton.append(text);
        playZone.appendChild(guessButton);

        let answerButton = document.createElement('BUTTON');
        answerButton.setAttribute("class","answerButton");
        answerButton.setAttribute("id", "answerButton"+i);
        answerZone.appendChild(answerButton);
        guessButton.onclick = guessButtonFunc;
    }
    currentLocation = 0
}

// new round button to start a new game with a new word
function newRound() {
    getRequest(function(GetWord) {
        // remove last round buttons
        let answerZone = document.querySelector('#answerZone')
        let playZone = document.querySelector('#playZone')
        while (answerZone.firstChild) {
            answerZone.removeChild(answerZone.firstChild);
        }
        while (playZone.firstChild) {
            playZone.removeChild(playZone.firstChild);
        }

        // call microservice
        word = GetWord.slice(2,-2)
        console.log(word)
        wordScramble = randomize(word);
        wordLength = word.length

        // set up new round with new word
        playZone.textContent ='';
        answerZone.textContent='';
        for (let i = 0; i < wordLength; i++) {
            let guessButton = document.createElement('BUTTON');
            let text = document.createTextNode(wordScramble[i]);
            guessButton.setAttribute("class", "guessButton");
            guessButton.setAttribute("id", "guessButton"+i);
            guessButton.append(text);
            playZone.appendChild(guessButton);

            let answerButton = document.createElement('BUTTON');
            answerButton.setAttribute("class","answerButton");
            answerButton.setAttribute("id", "answerButton"+i);
            answerZone.appendChild(answerButton);
            guessButton.onclick = guessButtonFunc;
        }
        currentLocation = 0

        // Reset reset button
        let resetButton = document.querySelector('#resetButton');
        resetButton.textContent = 'Reset Letters';
        resetButton.onclick = resetGame;
    })
}

// function to make the charater of the button you clicked pop up in the answer row
function guessButtonFunc() {
    if (currentLocation < wordLength) {
        let answerLoc = currentLocation
        let selectedID = this.id
        let selectCritieria = '#' + selectedID
        const selectedButton = document.querySelector(selectCritieria)
        let buttonChar = selectedButton.textContent

        if (buttonChar != '') {
            selectedButton.textContent= ''
            let answerButton = document.querySelector('#answerButton'+answerLoc)
            answerButton.append(buttonChar)
            currentLocation ++
        }

    }

    if (currentLocation == wordLength) {
        console.log('check for winner')
        let guessedWord = '';
        for (let i = 0; i < wordLength;i++) {
            letter = document.querySelector('#answerButton'+i).textContent  
            guessedWord += letter
        }
        console.log(word)
        console.log(guessedWord)
        if (guessedWord==word) {
            for (let i = 0; i < wordLength;i++) {
                let answerButton = document.querySelector('#answerButton'+i)
                answerButton.style.color = '#3B9E2B'
                answerButton.style.border = 'solid 1px #3B9E2B'
            }
            let resetButton = document.querySelector('#resetButton');
            resetButton.textContent = 'New Round?';
            resetButton.onclick = newRound;

        }
        else{
            for (let i = 0; i < wordLength;i++) {
                let answerButton = document.querySelector('#answerButton'+i)
                answerButton.style.color = '#D7421D'
                answerButton.style.border = 'solid 1px #D7421D'
            }
        }
    }
}
