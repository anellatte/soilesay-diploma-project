import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { addPuzzle } from './api';
import { useNavigate } from 'react-router-dom';

const AdminPuzzleAdd = () => {
    const [numPairs, setNumPairs] = useState(0);
    const [pairs, setPairs] = useState([]);
    const navigate = useNavigate();

    const handleNumPairsChange = (e) => {
        const value = e.target.value;
        const num = parseInt(value, 10);

        if (value === '') {
            setNumPairs(0);
            setPairs([]);
        } else if (!isNaN(num) && num > 0) {
            setNumPairs(num);
            setPairs(Array.from({ length: num }, () => ({ part1: '', part2: '' })));
        } else {
            setNumPairs(0);
            setPairs([]);
        }
    };

    const handlePart1Change = (index, value) => {
        const newPairs = [...pairs];
        newPairs[index].part1 = value;
        setPairs(newPairs);
    };

    const handlePart2Change = (index, value) => {
        const newPairs = [...pairs];
        newPairs[index].part2 = value;
        setPairs(newPairs);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addPuzzle({ wordPairs: pairs });
            navigate('/admin/puzzle');
        } catch (error) {
            console.error('Error adding puzzle:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADD PUZZLE</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNumPairs">
                        <Form.Label>Number of Word Pairs</Form.Label>
                        <Form.Control
                            type="number"
                            value={numPairs === 0 ? '' : numPairs}
                            onChange={handleNumPairsChange}
                            min="0"
                            required
                        />
                    </Form.Group>
                    {Array.from({ length: numPairs }).map((_, index) => (
                        <Row key={index} className="mb-3">
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder={`Part 1 of Word ${index + 1}`}
                                    value={pairs[index]?.part1 || ''}
                                    onChange={(e) => handlePart1Change(index, e.target.value)}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder={`Part 2 of Word ${index + 1}`}
                                    value={pairs[index]?.part2 || ''}
                                    onChange={(e) => handlePart2Change(index, e.target.value)}
                                    required
                                />
                            </Col>
                        </Row>
                    ))}
                    <Button variant="primary" type="submit">Add Puzzle</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminPuzzleAdd;
