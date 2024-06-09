import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPuzzles, deletePuzzle } from './api'; // Adjust the import path if necessary
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminPuzzle = () => {
    const [puzzles, setPuzzles] = useState([]);

    useEffect(() => {
        const fetchPuzzles = async () => {
            try {
                const fetchedPuzzles = await getAllPuzzles();
                setPuzzles(fetchedPuzzles);
            } catch (error) {
                console.error('Error fetching puzzles:', error);
            }
        };
        fetchPuzzles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deletePuzzle(id);
            setPuzzles(puzzles.filter(puzzle => puzzle._id !== id));
        } catch (error) {
            console.error('Error deleting puzzle:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADMIN PUZZLE</h2>
                <div className="d-flex justify-content-center mb-4">
                    <Link to="/admin/puzzle/add" className="btn btn-primary mb-4">Add Puzzle</Link>
                </div>
                <Row>
                    {Array.isArray(puzzles) && puzzles.length > 0 ? (
                        puzzles.map(puzzle => (
                            <Col key={puzzle._id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Level {puzzle.level}</Card.Title>
                                        <Card.Text>{puzzle.wordPairs.map(pair => `${pair.part1} + ${pair.part2}`).join(', ')}</Card.Text>
                                        <Link to={`/admin/puzzle/edit/${puzzle._id}`} className="btn btn-secondary mr-2">Edit</Link>
                                        <Button variant="danger" onClick={() => handleDelete(puzzle._id)}>Delete</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No puzzles found.</p>
                    )}
                </Row>
            </div>
        </Container>
    );
};

export default AdminPuzzle;
