let word = "KITTEN"
let wordScramble = "ITTNEK"
let wordLength = word.length
let currentLocation = 0

console.log(wordLength)
console.log(word)
//comment
const instructionButton = document.querySelector('#instructionButton')
if (instructionButton != null) {
    instructionButton.onclick = instructions;
}

const startButton = document.querySelector('#start')
startButton.onclick = startGame;

const newRoundButton = document.querySelector('#newRound')
newRoundButton.onclick = newRound;

function instructions() {
    alert("The purpose of this game is to fill in the correct word from a pool of scrambled letters \n\n When all possible letters have been selected the text will glow green if it is correct and red if it is not!");
}

function startGame() {
    let playZone = document.querySelector('#playZone');
    let startBtn = document.querySelector('#start');
    let answerZone = document.querySelector('#answerZone');
    startBtn.remove();

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
}

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

function newRound() {
    // remove last round buttons
    let answerZone = document.querySelector('#answerZone')
    let playZone = document.querySelector('#playZone')
    while (answerZone.firstChild) {
        answerZone.removeChild(answerZone.firstChild);
    }
    while (playZone.firstChild) {
        playZone.removeChild(playZone.firstChild);
    }

    // set up new round with new word
    word = 'BEAVERS'
    wordScramble = 'VABERSE'
    wordLength = word.length
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
}

function guessButtonFunc() {
    console.log(currentLocation + ' : ' + wordLength )
    if (currentLocation < wordLength) {
        let answerLoc = currentLocation
        let selectedID = this.id
        let selectCritieria = '#' + selectedID
        const selectedButton = document.querySelector(selectCritieria)
        let buttonChar = selectedButton.textContent
        selectedButton.textContent= ''
        let answerButton = document.querySelector('#answerButton'+answerLoc)
        answerButton.append(buttonChar)
        currentLocation ++

    }

    if (currentLocation == word.length) {
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
