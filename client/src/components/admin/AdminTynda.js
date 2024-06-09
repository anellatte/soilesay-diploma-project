import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTynda, deleteTynda } from './api';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminTynda = () => {
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const fetchedLevels = await getAllTynda();
                setLevels(fetchedLevels);
            } catch (error) {
                console.error('Error fetching Tynda levels:', error);
            }
        };
        fetchLevels();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteTynda(id);
            setLevels(levels.filter(level => level._id !== id));
        } catch (error) {
            console.error('Error deleting Tynda level:', error);
        }
    };

    return (
        <Container className="admin content__body">
            <div className='admin__inner'>
                <h2 className="admin__title title">Manage Tynda Levels</h2>
                <div className="mb-4">
                    <Link to="/admin/tynda/add" className="btn btn-primary">Add New Level</Link>
                </div>
                <Row>
                    {levels.map(level => (
                        <Col key={level._id} md={4} className="mb-4">
                            <Card className="h-100 d-flex flex-column">
                                <Card.Body className="d-flex flex-column">
                                    <div>
                                        <Card.Title>{level.word}</Card.Title>
                                        <Card.Text><strong>Level:</strong> {level.level}</Card.Text>
                                    </div>
                                    <div className="mt-3">
                                        <audio controls style={{ width: '100%' }} src={`http://localhost:8000/${level.audioPath}`} />
                                    </div>
                                    <div className="mt-4 d-flex justify-content-between">
                                        <Link to={`/admin/tynda/edit/${level._id}`} className="btn btn-secondary">Edit</Link>
                                        <Button variant="danger" onClick={() => handleDelete(level._id)}>Delete</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default AdminTynda;
