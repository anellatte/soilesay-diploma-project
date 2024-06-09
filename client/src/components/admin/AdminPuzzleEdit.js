import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getPuzzleById, editPuzzle } from './api';
import { useNavigate, useParams } from 'react-router-dom';

const AdminPuzzleEdit = () => {
    const [pairs, setPairs] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPuzzle = async () => {
            try {
                const puzzle = await getPuzzleById(id);
                setPairs(puzzle.wordPairs);
            } catch (error) {
                console.error('Error fetching puzzle:', error);
            }
        };
        fetchPuzzle();
    }, [id]);

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
            await editPuzzle(id, { wordPairs: pairs });
            navigate('/admin/puzzle');
        } catch (error) {
            console.error('Error editing puzzle:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">EDIT PUZZLE</h2>
                <Form onSubmit={handleSubmit}>
                    {Array.isArray(pairs) && pairs.length > 0 ? (
                        pairs.map((pair, index) => (
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
                        ))
                    ) : (
                        <p>No pairs found.</p>
                    )}
                    <Button variant="primary" type="submit">Edit Puzzle</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminPuzzleEdit;
