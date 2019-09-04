const levels = {
    easy: 7,
    medium: 5,
    hard: 3
};

let time = 0;
let score = 0;
let highestScore = 0;
let currentLevel;

const difficultyLevel = document.querySelector('.difficulty');
const currentWord = document.querySelector('.word');
const wordInput = document.querySelector('.word-input');
const timeDisplay = document.querySelector('.time');
const scoreDisplay = document.querySelector('.score');
const HighestScoreDisplay = document.querySelector('.highest-score');
const HighestScoreText = document.querySelector('.highest-score-text');
const seconds = document.querySelector('.seconds');
const secondsText = document.querySelector('.seconds-text');
const message = document.querySelector('.message');

const words = [];

window.addEventListener('DOMContentLoaded', init());

function init() {

    // Difficulty level
    difficultyLevel.addEventListener('change', chooseLevel);

    // Request words from API to populate words[] array
    wordsRequestAPI();

    // Retrieve local storage data
    HighestScoreDisplay.innerHTML = Number(localStorage.getItem('highestScoreEver'));
}

function chooseLevel(e) {

    // Choose level
    if (e.target.value.includes('easy')) {
        time = levels.easy;
    } else if (e.target.value.includes('medium')) {
        time = levels.medium;
    } else {
        time = levels.hard;
    }

    // Set time for current level to be used on word match and game over 
     currentLevel = time;

    // Add auto focus to input field
    wordInput.focus();

    // Show/Hide top seconds information
    seconds.innerHTML = `${time} seconds`;
    secondsText.style.display = 'none';

    // Countdown timer
    countDown();

    // Show word
    showWord(words);

    // Get word input
    wordInput.addEventListener('input', startMatch);

    // Check game status
    checkStatus();
}

function wordsRequestAPI() {
    return fetch('https://api.datamuse.com/words?ml=ringing+in+the+ears&max=900')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((item) => {
                words.push(item.word);
            });
        })
        .catch((err) => {
            err = 'No word found!';
            currentWord.innerHTML = err;
        });
}

function showWord(words) {
    let randNum = Math.floor(Math.random() * words.length);
    currentWord.innerHTML = words[randNum];

    // Current word should display "No word found" if there is API error
    if (typeof words[randNum] === 'undefined') {
        currentWord.innerHTML = 'No word found!';
    }
}

function startMatch() {
    if (matchWords()) {
        showWord(words);
        wordInput.value = '';
        score++;

        //Increase highest score only if score is greater than 0
        if (score > 0) {
            highestScore++;
        }

        // Time checking and setting for current level
        if (currentLevel === levels.easy) {
            time = levels.easy;
        } else if (currentLevel === levels.medium) {
            time = levels.medium;
        } else {
            time = levels.hard;
        }
    }

    if (score === -1) {
        scoreDisplay.innerHTML = 0;
    } else {
        scoreDisplay.innerHTML = score;
        HighestScoreDisplay.innerHTML = `High Score: ${highestScore}`;
        HighestScoreText.style.display = 'none';
    }
}

function matchWords() {
    if (wordInput.value === currentWord.innerHTML) {
        message.innerHTML = 'Correct!!!';
        return true;
    } else {
        message.innerHTML = '';
        return false;
    }
}

function countDown() {
    setInterval(() => {
        if (time > 0) {
            time--;
        } else if (time === 0) {

            // Set local storage on game over
            if (Number(localStorage.getItem('highestScoreEver')) < highestScore) {
                localStorage.setItem('highestScoreEver', highestScore);
            }

        }
        timeDisplay.innerHTML = time;
    }, 1000);
}

function checkStatus() {
    setInterval(() => {
        if (time === 0) {
            message.innerHTML = 'Game Over!!!';
            score = -1;
        }
    }, 50);
    time = currentLevel;
}




