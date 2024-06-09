import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTyndaById, updateTynda } from './api';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const AdminTyndaEdit = () => {
    const { id } = useParams();
    const [word, setWord] = useState('');
    const [level, setLevel] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const levelData = await getTyndaById(id);
                setWord(levelData.word);
                setLevel(levelData.level);
                setPreview(`http://localhost:8000/${levelData.audioPath}`); // Update the URL to be relative to the server
            } catch (error) {
                console.error('Error fetching Tynda level:', error);
            }
        };
        fetchLevel();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('word', word);
        formData.append('level', level);
        if (file) {
            formData.append('audio', file);
        }

        try {
            await updateTynda(id, formData);
            navigate('/admin/tynda');
        } catch (error) {
            console.error('Error updating Tynda level:', error);
            setError(error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith('audio/')) {
            setError('Only audio files are allowed!');
            return;
        }
        setError(''); // Clear any existing errors
        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <Container className="admin content__body">
            <div className='admin__inner'>
                <h2 className="admin__title title">Edit Tynda Level</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="word">
                        <Form.Label>Word</Form.Label>
                        <Form.Control
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            placeholder="Enter the correct spelling"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="level">
                        <Form.Label>Level</Form.Label>
                        <Form.Control
                            type="number"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            placeholder="Enter the level"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="audio">
                        <Form.Label>Audio File</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            accept="audio/*"
                        />
                        {preview && <audio controls src={preview} className="mt-2"/>}
                    </Form.Group>

                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                    <Button variant="primary" type="submit" className="mt-3">Update Level</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminTyndaEdit;
