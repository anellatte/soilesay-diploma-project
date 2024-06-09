import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Alert, Form } from 'react-bootstrap';
import { getUserProfile, getSozdlyByLevel, updateSozdlyLevel } from '../api';

const kazakhAlphabet = [
    'А', 'Ә', 'Б', 'В', 'Г', 'Ғ', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Қ', 'Л', 'М', 'Н', 'Ң', 'О', 'Ө', 'П',
    'Р', 'С', 'Т', 'У', 'Ұ', 'Ү', 'Ф', 'Х', 'Һ', 'Ц', 'Ч', 'Ш', 'Щ', 'Ы', 'І', 'Э', 'Ю', 'Я', 'Ъ', 'Ь'
];

const Sozdly = () => {
    const [guesses, setGuesses] = useState(Array(6).fill(''));
    const [currentGuess, setCurrentGuess] = useState('');
    const [attempt, setAttempt] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [sozdlyLevel, setSozdlyLevel] = useState(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentWord, setCurrentWord] = useState('');
    const [noMoreLevels, setNoMoreLevels] = useState(false);
    const [isLevelCompleted, setIsLevelCompleted] = useState(false);
    const [wordsList, setWordsList] = useState([]);
    const [keyColors, setKeyColors] = useState({});
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setSozdlyLevel(userData.sozdlyLevel);
                setCurrentLevel(userData.sozdlyLevel);

                const sozdlyData = await getSozdlyByLevel(userData.sozdlyLevel);
                if (sozdlyData && sozdlyData.word) {
                    setCurrentWord(sozdlyData.word.toUpperCase());
                } else {
                    setFeedbackMessage('Failed to load sozdly level');
                }
            } catch (error) {
                setFeedbackMessage('Failed to fetch user data');
            }
        };

        const fetchWordsList = async () => {
            try {
                const response = await fetch('/sozdle/words.json');
                const data = await response.json();
                const upperCaseWords = data.map(word => word.toUpperCase());
                setWordsList(upperCaseWords);
            } catch (error) {
                setFeedbackMessage('Failed to load words list');
            }
        };

        fetchUserData();
        fetchWordsList();
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [attempt]);

    const handleGuessChange = (event) => {
        const value = event.target.value.toUpperCase();
        if (value.length <= 5) {
            setCurrentGuess(value);
            const newGuesses = [...guesses];
            newGuesses[attempt] = value;
            setGuesses(newGuesses);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    };

    const updateKeyColors = (guess) => {
        const newKeyColors = { ...keyColors };
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            if (currentWord[i] === letter) {
                newKeyColors[letter] = '#10B981';
            } else if (currentWord.includes(letter)) {
                if (newKeyColors[letter] !== '#10B981') {
                    newKeyColors[letter] = '#F59E0B';
                }
            } else {
                newKeyColors[letter] = '#94A3B8';
            }
        }
        setKeyColors(newKeyColors);
    };

    const checkAnswer = async () => {
        if (currentGuess.length !== 5) {
            setFeedbackMessage('The word must be exactly 5 letters long.');
            return;
        }

        if (!wordsList.includes(currentGuess)) {
            setFeedbackMessage('This word does not exist.');
            return;
        }

        const newGuesses = [...guesses];
        newGuesses[attempt] = currentGuess;
        setGuesses(newGuesses);

        updateKeyColors(currentGuess);

        if (currentGuess === currentWord) {
            setFeedbackMessage('Correct!');
            setIsLevelCompleted(true);
            try {
                const response = await updateSozdlyLevel(currentLevel);
                if (response.message === 'No more levels') {
                    setNoMoreLevels(true);
                    setFeedbackMessage('');
                } else if (response.sozdlyLevel !== sozdlyLevel) {
                    setSozdlyLevel(response.sozdlyLevel);
                    setCurrentLevel(response.sozdlyLevel);
                    const sozdlyData = await getSozdlyByLevel(response.sozdlyLevel);
                    if (sozdlyData && sozdlyData.word) {
                        setCurrentWord(sozdlyData.word.toUpperCase());
                        setGuesses(Array(6).fill(''));
                        setCurrentGuess('');
                        setAttempt(0);
                        setNoMoreLevels(false);
                    } else {
                        setNoMoreLevels(true);
                    }
                } else {
                    setFeedbackMessage('Correct, try the next level.');
                }
            } catch (error) {
                setFeedbackMessage('Error updating sozdly level');
            }
        } else if (attempt < 5) {
            setAttempt(attempt + 1);
            setCurrentGuess('');
            setFeedbackMessage('Try again.');
        } else {
            setFeedbackMessage(`Game over! The correct word was: ${currentWord}`);
        }
    };

    const handleLevelClick = async (level) => {
        try {
            const sozdlyData = await getSozdlyByLevel(level);
            if (sozdlyData) {
                setCurrentWord(sozdlyData.word.toUpperCase());
                setGuesses(Array(6).fill(''));
                setCurrentGuess('');
                setAttempt(0);
                setFeedbackMessage('');
                setCurrentLevel(level);
                setNoMoreLevels(false);
                setIsLevelCompleted(false);
                setKeyColors({});
            } else {
                setFeedbackMessage('Failed to load sozdly level');
            }
        } catch (error) {
            setFeedbackMessage('Failed to load sozdly level');
        }
    };

    const handleCellClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleKeyboardClick = (letter) => {
        if (letter === 'Enter') {
            checkAnswer();
            return;
        }

        if (letter === 'Delete') {
            setCurrentGuess(currentGuess.slice(0, -1));
            const newGuesses = [...guesses];
            newGuesses[attempt] = currentGuess.slice(0, -1);
            setGuesses(newGuesses);
            return;
        }

        if (currentGuess.length < 5) {
            const newGuess = currentGuess + letter;
            setCurrentGuess(newGuess);
            const newGuesses = [...guesses];
            newGuesses[attempt] = newGuess;
            setGuesses(newGuesses);
        }
    };

    const getBackgroundColor = (guess, index) => {
        const guessLetter = guess[index];
        const correctLetter = currentWord[index];

        if (guessLetter === correctLetter) {
            return '#10B981';
        }

        if (currentWord.includes(guessLetter)) {
            const guessLetterCount = guess.split('').filter(letter => letter === guessLetter).length;
            const correctLetterCount = currentWord.split('').filter(letter => letter === guessLetter).length;

            if (guessLetterCount <= correctLetterCount) {
                return '#F59E0B';
            }
        }

        return '#94A3B8';
    };

    return (
        <Container className='sozdly content__body'>
            <div className='container'>
                <div className='sozdly__inner'>
                    <h1 className="sozdly__title title">SOZDLY</h1>

                    <div className='sozdly-game__container'>
                        <div className='suraq-desc sozdly__grid'>
                            <p className='suraq-desc__title'>Level {currentLevel}</p>
                            {guesses.map((guess, attemptIndex) => (
                                <div key={attemptIndex} className="guess-input d-flex justify-content-between mb-2">
                                    {[...Array(5)].map((_, index) => (
                                        <Form.Control
                                            key={index}
                                            type="text"
                                            value={guess[index] || ''}
                                            readOnly
                                            onClick={attemptIndex === attempt ? handleCellClick : undefined}
                                            maxLength="1"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                textAlign: 'center',
                                                fontSize: '2em',
                                                backgroundColor: guess[index] && isLevelCompleted && guess === currentWord ? 'green' : attemptIndex < attempt ? getBackgroundColor(guess, index) : 'white'
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                            <Form.Control
                                ref={inputRef}
                                type="text"
                                value={currentGuess}
                                onChange={handleGuessChange}
                                onKeyPress={handleKeyPress}
                                maxLength="5"
                                style={{ opacity: 0, height: 0 }}
                            />
                            <Button className="mt-4 grid__button" onClick={checkAnswer}>Check</Button>
                            {feedbackMessage && (
                                <Alert variant={feedbackMessage.startsWith('Correct') ? 'success' : 'danger'} className="mt-4">
                                    {feedbackMessage}
                                </Alert>
                            )}
                            {noMoreLevels && (
                                <Alert variant="info" className="mt-4">
                                    Wow, you've reached the end of our current levels. Congratulations on your achievement. We're grateful for your dedication. We're working on adding new levels, and we'll let you know as soon as they're ready.
                                </Alert>
                            )}
                        </div>

                        <div className='keyboard'>
                            <div className='keyboard__inner'>
                                {kazakhAlphabet.map(letter => (
                                    <Button
                                        key={letter}
                                        className="keyboard__key"
                                        onClick={() => handleKeyboardClick(letter)}
                                        style={{ backgroundColor: keyColors[letter] || 'white', margin: '2px', width: '40px', height: '40px', color: 'black' }}
                                    >
                                        {letter}
                                    </Button>
                                ))}
                                <div className='sozdly-keys__buttons'>
                                    <Button
                                        className="keyboard__key delete"
                                        onClick={() => handleKeyboardClick('Delete')}
                                        style={{ backgroundColor: 'black', margin: '2px', width: '100px', height: '40px' }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        className="keyboard__key enter"
                                        onClick={() => handleKeyboardClick('Enter')}
                                        style={{ background: 'linear-gradient(#A6ECEC, #FAD7EA)', margin: '2px', width: '100px', height: '40px', color: 'black', border: '1px solid black' }}
                                    >
                                        Enter
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div className='levels'>
                    <div className='levels__inner'>
                        <h2 className="levels__title">LEVELS</h2>
                        {[...Array(sozdlyLevel).keys()].map(i => {
                            const level = i + 1;
                            const isDisabled = level > sozdlyLevel;

                            return (
                                <Button
                                    key={level}
                                    className="level__number"
                                    onClick={() => handleLevelClick(level)}
                                    disabled={isDisabled}
                                    style={isDisabled ? { backgroundColor: 'grey', cursor: 'not-allowed' } : {}}
                                >
                                    Level {level}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Sozdly;
