import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { addMaqalDrop } from './api';
import { useNavigate } from 'react-router-dom';

const AdminMDAdd = () => {
    const [sentence, setSentence] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addMaqalDrop({ sentence, level: 1 });
            navigate('/adminMaqalDrop');
        } catch (error) {
            console.error('Error adding MaqalDrop:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADD MAQALDROP LEVEL</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formSentence">
                        <Form.Label>Sentence</Form.Label>
                        <Form.Control
                            type="text"
                            value={sentence}
                            onChange={(e) => setSentence(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Add Level</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminMDAdd;
