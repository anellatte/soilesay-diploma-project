import React, { useState, useEffect } from 'react';
import { getAllNews } from '../admin/api';
import { getApprovedEvents, getNotifications, markNotificationAsRead } from '../api'; // Adjust import path as needed
import { Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [events, setEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

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
                const fetchedEvents = await getApprovedEvents();
                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await getNotifications();
                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchPosts();
        fetchEvents();
        fetchNotifications();
    }, []);

    const handleAddEvent = () => {
        navigate('/eventForm');
    };

    const handleDismissNotification = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(notifications.filter(notification => notification._id !== id));
        } catch (error) {
            console.error('Error dismissing notification:', error);
        }
    };

    return (
        <Container className='home content__body'>
            <div className='container'>
                <div className='home__inner'>
                    <h1 className='home__title title'>HOME</h1>
                    <Button variant="primary" onClick={handleAddEvent} className="mb-4">Add Event</Button>
                    {notifications.map(notification => (
                        <Alert key={notification._id} variant="info" onClose={() => handleDismissNotification(notification._id)} dismissible>
                            {notification.message}
                        </Alert>
                    ))}

                    {posts.map(post => (
                        <Row key={post._id} className="mb-4">
                            <Col>
                                <Card>
                                    <Card.Img variant="top" src={`http://localhost:8000/uploads/${post.image}`} alt="Post" />
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text>{post.message}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}

                    {events.map(event => (
                        <Row key={event._id} className="mb-4">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{event.title}</Card.Title>
                                        <Card.Text>{event.description}</Card.Text>
                                        <Card.Text>{new Date(event.date).toLocaleDateString()}</Card.Text>
                                        <Card.Text>{event.place}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default Home;
