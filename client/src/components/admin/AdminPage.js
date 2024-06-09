import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews, deleteNews } from './api';
import { getAllEvents, approveEvent, deleteEvent } from '../api';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminPage = () => {
    const [posts, setPosts] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await getAllNews();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getAllEvents();
                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchPosts();
        fetchEvents();
    }, []);

    const handleDeleteNews = async (id) => {
        try {
            await deleteNews(id);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await approveEvent(id);
            setEvents(events.map(event => event._id === id ? { ...event, isApproved: true } : event));
        } catch (error) {
            console.error('Error approving event:', error);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await deleteEvent(id);
            setEvents(events.filter(event => event._id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADMIN PAGE</h2>
                <div className="d-flex justify-content-center mb-4">
                    <Link to="/admin/add" className="btn btn-primary mr-2">Add News</Link>
                    <Link to="/adminMaqalDrop" className="btn btn-secondary mr-2">Maqal Drop</Link>
                    <Link to="/admin/sj" className="btn btn-secondary mr-2">Suraq - Jauap</Link>
                    <Link to="/admin/talda" className="btn btn-secondary">Talda</Link>
                    <Link to="/admin/sozdly" className="btn btn-secondary">Sozdly</Link>
                    <Link to="/admin/puzzle" className="btn btn-secondary">Puzzle</Link>
                    <Link to="/admin/tynda" className="btn btn-secondary">Tynda</Link>

                </div>
                <h3>Events</h3>
                <Row>
                    {events.map(event => (
                        <Col key={event._id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{event.title}</Card.Title>
                                    <Card.Text>{event.description}</Card.Text>
                                    <Card.Text>{new Date(event.date).toLocaleDateString()}</Card.Text>
                                    <Card.Text>{event.place}</Card.Text>
                                    {event.isApproved ? (
                                        <Button variant="success" disabled>Approved</Button>
                                    ) : (
                                        <Button variant="success" onClick={() => handleApproveEvent(event._id)}>Approve</Button>
                                    )}
                                    <Button variant="danger" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <h3>News</h3>
                <Row>
                    {posts.map(post => (
                        <Col key={post._id} md={4} className="mb-4">
                            <Card>
                                <Card.Img variant="top" src={`http://localhost:8000/uploads/${post.image}`} alt="Post" />
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.message}</Card.Text>
                                    <Link to={`/admin/edit/${post._id}`} className="btn btn-secondary mr-2">Edit</Link>
                                    <Button variant="danger" onClick={() => handleDeleteNews(post._id)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default AdminPage;
