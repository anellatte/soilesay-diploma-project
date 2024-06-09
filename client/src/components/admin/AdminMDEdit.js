import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { getMaqalDropById, editMaqalDrop } from './api';
import { useNavigate, useParams } from 'react-router-dom';

const AdminMDEdit = () => {
    const [sentence, setSentence] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaqalDrop = async () => {
            try {
                const maqalDrop = await getMaqalDropById(id);
                setSentence(maqalDrop.sentence);
            } catch (error) {
                console.error('Error fetching MaqalDrop:', error);
            }
        };
        fetchMaqalDrop();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await editMaqalDrop(id, { sentence });
            navigate('/adminMaqalDrop');
        } catch (error) {
            console.error('Error editing MaqalDrop:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">EDIT MAQALDROP LEVEL</h2>
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
                    <Button variant="primary" type="submit">Edit Level</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminMDEdit;
