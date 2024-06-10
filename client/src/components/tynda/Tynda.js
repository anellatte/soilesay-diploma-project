import React, { useState, useEffect } from 'react';
import { Button, Container, Alert } from 'react-bootstrap';
import { getUserProfile, getTyndaByLevel, updateTyndaLevel } from '../api'; // Removed getCompletedTynda

const Tynda = () => {
    const [audioSrc, setAudioSrc] = useState('');
    const [tyndaLevel, setTyndaLevel] = useState(1);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [word, setWord] = useState('');
    const [inputWord, setInputWord] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [noMoreLevels, setNoMoreLevels] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setTyndaLevel(userData.tyndaLevel);
                setCurrentLevel(userData.tyndaLevel);

                const tyndaData = await getTyndaByLevel(userData.tyndaLevel);
                if (tyndaData && tyndaData.word) {
                    setAudioSrc(`http://localhost:8000/${tyndaData.audioPath}`);
                    setWord(tyndaData.word);
                } else {
                    setFeedbackMessage('Failed to load Tynda level');
                }

                // Generate all levels up to the current level
                const allLevels = Array.from({ length: userData.tyndaLevel }, (_, i) => ({ level: i + 1 }));
                setCompletedLevels(allLevels);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFeedbackMessage('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    const checkAnswer = async () => {
        if (inputWord.toLowerCase() === word.toLowerCase()) {
            setFeedbackMessage('Correct!');
            try {
                const response = await updateTyndaLevel(currentLevel);
                if (response.message === 'No more levels') {
                    setNoMoreLevels(true);
                    setFeedbackMessage('');
                } else if (response.tyndaLevel !== tyndaLevel) {
                    setTyndaLevel(response.tyndaLevel);
                    setCurrentLevel(response.tyndaLevel);
                    // Fetch new data for the new level
                    const tyndaData = await getTyndaByLevel(response.tyndaLevel);
                    if (tyndaData && tyndaData.word) {
                        setAudioSrc(`http://localhost:8000/${tyndaData.audioPath}`);
                        setWord(tyndaData.word);
                        setInputWord('');
                        setNoMoreLevels(false); // New level found, reset no more levels message
                    } else {
                        setNoMoreLevels(true); // No new level found, set no more levels message
                    }
                    // Update completed levels
                    const allLevels = Array.from({ length: response.tyndaLevel }, (_, i) => ({ level: i + 1 }));
                    setCompletedLevels(allLevels);
                } else {
                    setFeedbackMessage('Correct, try the next level.');
                }
            } catch (error) {
                console.error('Error updating Tynda level:', error);
                setFeedbackMessage('Error updating Tynda level');
            }
        } else {
            setFeedbackMessage('Try again.');
        }
    };

    const handleLevelClick = async (level) => {
        try {
            const tyndaData = await getTyndaByLevel(level);
            if (tyndaData) {
                setAudioSrc(`http://localhost:8000/${tyndaData.audioPath}`);
                setWord(tyndaData.word);
                setInputWord('');
                setFeedbackMessage('');
                setCurrentLevel(level);
                setNoMoreLevels(false); // Reset no more levels message when switching levels
            } else {
                setFeedbackMessage('Failed to load Tynda level');
            }
        } catch (error) {
            console.error('Error loading Tynda level:', error);
            setFeedbackMessage('Failed to load Tynda level');
        }
    };

    return (
        <Container className='tynda content__body'>
            <div className='container'>
                <div className='tynda__inner'>
                    <h1 className="tynda__title title">TYNDA</h1>

                    <div className='suraq-desc'>
                        <p className='suraq-desc__title'>Level {currentLevel}</p>
                        <audio controls src={audioSrc} className="mt-2" />
                        <div className="input-group mt-4">
                            <input
                                type="text"
                                value={inputWord}
                                onChange={(e) => setInputWord(e.target.value)}
                                className="form-control"
                                placeholder="Type the word you heard"
                            />
                        </div>
                        <Button variant="success" className="mt-4" onClick={checkAnswer}>Check</Button>
                        {feedbackMessage && (
                            <Alert variant={feedbackMessage === 'Correct!' || feedbackMessage === 'Correct, try the next level.' ? 'success' : 'danger'} className="mt-4">
                                {feedbackMessage}
                            </Alert>
                        )}
                        {noMoreLevels && (
                            <Alert variant="info" className="mt-4">
                                Wow, you've reached the end of our current levels. Congratulations on your achievement. We're grateful for your dedication. We're working on adding new levels, and we'll let you know as soon as they're ready.
                            </Alert>
                        )}
                    </div>
                </div>

                <div className='levels'>
                    <div className='levels__inner'>
                        <h2 className="levels__title">LEVELS</h2>
                        {completedLevels.map(level => (
                            <Button
                                key={level.level}
                                className="level__number"
                                onClick={() => handleLevelClick(level.level)}
                            >
                                Level {level.level}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Tynda;
