import React, { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { getUserProfile, getMaqalDropByLevel, updateMaqalDropLevel } from '../api';

const MaqalDrop = () => {
    const [initialWords, setInitialWords] = useState([]);
    const [arrangedWords, setArrangedWords] = useState([]);
    const [maqalDropLevel, setMaqalDropLevel] = useState(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [noMoreLevels, setNoMoreLevels] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                console.log('User Data:', userData);
                setMaqalDropLevel(userData.maqalLevel);
                setCurrentLevel(userData.maqalLevel);

                const maqalDropData = await getMaqalDropByLevel(userData.maqalLevel);
                console.log('MaqalDrop Data:', maqalDropData);
                if (maqalDropData && maqalDropData.sentence) {
                    setInitialWords(shuffleWords(maqalDropData.sentence.split(' ')));
                } else {
                    setFeedbackMessage('Failed to load MaqalDrop level');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFeedbackMessage('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    const shuffleWords = (words) => {
        let shuffled;
        do {
            shuffled = words.slice().sort(() => Math.random() - 0.5);
        } while (shuffled.join(' ') === words.join(' '));
        return shuffled;
    };

    const onDragStart = (event, word, fromInitial) => {
        event.dataTransfer.setData("text/plain", JSON.stringify({ word, fromInitial }));
    };

    const onDragOver = (event) => {
        event.preventDefault();
    };

    const onDrop = (event, dropOnInitial) => {
        const { word, fromInitial } = JSON.parse(event.dataTransfer.getData("text/plain"));

        if (dropOnInitial === fromInitial) return;

        if (dropOnInitial) {
            setInitialWords([...initialWords, word]);
            setArrangedWords(arrangedWords.filter(w => w !== word));
        } else {
            setArrangedWords([...arrangedWords, word]);
            setInitialWords(initialWords.filter(w => w !== word));
        }
    };

    const resetWords = () => {
        setArrangedWords([]);
        setInitialWords([...initialWords, ...arrangedWords]);
    };

    const checkAnswers = async () => {
        const sentence = arrangedWords.join(' ');
        const maqalDropData = await getMaqalDropByLevel(currentLevel);
        if (sentence === maqalDropData.sentence) {
            setFeedbackMessage('Correct!');
            try {
                const response = await updateMaqalDropLevel(currentLevel);
                console.log('Update Response:', response);
                if (response.message === 'No more levels') {
                    setNoMoreLevels(true);
                    setFeedbackMessage('');
                } else {
                    const nextLevel = response.maqalLevel;
                    setMaqalDropLevel(nextLevel);
                    setCurrentLevel(nextLevel);
                    // Fetch new data for the new level
                    const newMaqalDropData = await getMaqalDropByLevel(nextLevel);
                    if (newMaqalDropData && newMaqalDropData.sentence) {
                        setInitialWords(shuffleWords(newMaqalDropData.sentence.split(' ')));
                        setArrangedWords([]);
                        setNoMoreLevels(false); // New level found, reset no more levels message
                    } else {
                        setNoMoreLevels(true); // No new level found, set no more levels message
                    }
                }
            } catch (error) {
                console.error('Error updating MaqalDrop level:', error);
                setFeedbackMessage('Error updating MaqalDrop level');
            }
        } else {
            setFeedbackMessage('Try again.');
        }
    };

    const handleLevelClick = async (level) => {
        try {
            const maqalDropData = await getMaqalDropByLevel(level);
            console.log('Level Click Data:', maqalDropData);
            if (maqalDropData) {
                setInitialWords(shuffleWords(maqalDropData.sentence.split(' ')));
                setArrangedWords([]);
                setFeedbackMessage('');
                setCurrentLevel(level);
                setNoMoreLevels(false); // Reset no more levels message when switching levels
            } else {
                setFeedbackMessage('Failed to load MaqalDrop level');
            }
        } catch (error) {
            console.error('Error loading MaqalDrop level:', error);
            setFeedbackMessage('Failed to load MaqalDrop level');
        }
    };

    return (
        <Container className='maqal-drop content__body'>
            <div className='container'>
                <div className='maqal-drop__inner'>
                    <h1 className="maqal-drop__title title">MAQAL DROP</h1>

                    <div className='suraq-desc'>
                        <p className='suraq-desc__title'>Level {currentLevel}</p>
                        <div className="word-containers">
                            <div className="word-container"
                                 onDragOver={onDragOver}
                                 onDrop={(event) => onDrop(event, false)}
                                 style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px' }}
                            >
                                {arrangedWords.map((word, index) => (
                                    <Button
                                        key={index}
                                        draggable
                                        onDragStart={(event) => onDragStart(event, word, false)}
                                        variant="outline-primary"
                                        className="m-2"
                                        style={{ padding: "8px", cursor: "move" }}
                                    >
                                        {word}
                                    </Button>
                                ))}
                            </div>
                            {initialWords.length > 0 && (
                                <div className="word-container"
                                     onDragOver={onDragOver}
                                     onDrop={(event) => onDrop(event, true)}
                                     style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px', marginTop: '20px' }}
                                >
                                    {initialWords.map((word, index) => (
                                        <Button
                                            key={index}
                                            draggable
                                            variant="outline-primary"
                                            onDragStart={(event) => onDragStart(event, word, true)}
                                            className="m-2"
                                            style={{ padding: "8px", cursor: "move" }}
                                        >
                                            {word}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button variant="success" className="mt-4" onClick={checkAnswers}>Check</Button>
                        <Button variant="secondary" className="mt-4 ml-2" onClick={resetWords}>Reset</Button>
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
                        {[...Array(maqalDropLevel).keys()].map(i => {
                            const level = i + 1;
                            const isDisabled = level > maqalDropLevel;

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

export default MaqalDrop;
