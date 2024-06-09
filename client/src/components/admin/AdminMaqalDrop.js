import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMaqalDrop, deleteMaqalDrop } from './api';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminMaqalDrop = () => {
  const [maqalDrop, setMaqalDrop] = useState([]);

  useEffect(() => {
    const fetchMaqalDrop = async () => {
      try {
        const fetchedMaqalDrop = await getAllMaqalDrop();
        if (Array.isArray(fetchedMaqalDrop)) {
          setMaqalDrop(fetchedMaqalDrop);
        } else if (fetchedMaqalDrop) {
          setMaqalDrop([fetchedMaqalDrop]);
        } else {
          setMaqalDrop([]);
        }
      } catch (error) {
        console.error('Error fetching MaqalDrop:', error);
        setMaqalDrop([]);
      }
    };
    fetchMaqalDrop();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMaqalDrop(id);
      setMaqalDrop(maqalDrop.filter(level => level._id !== id));
    } catch (error) {
      console.error('Error deleting MaqalDrop:', error);
    }
  };

  return (
      <Container className='admin content__body'>
        <div className='admin__inner'>
          <h2 className="admin__title title">ADMIN MAQALDROP</h2>
          <div className="d-flex justify-content-center mb-4">
            <Link to="/admin/maqaldrop/add" className="btn btn-primary mb-4">Add Level</Link>
          </div>

          <Row>
            {Array.isArray(maqalDrop) && maqalDrop.length > 0 ? (
                maqalDrop.map(level => (
                    <Col key={level._id} md={4} className="mb-4">
                      <Card>
                        <Card.Body>
                          <Card.Title>Level {level.level}</Card.Title>
                          <Card.Text>{level.sentence}</Card.Text>
                          <Link to={`/admin/maqaldrop/edit/${level._id}`} className="btn btn-secondary mr-2">Edit</Link>
                          <Button variant="danger" onClick={() => handleDelete(level._id)}>Delete</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                ))
            ) : (
                <p>No MaqalDrop levels found.</p>
            )}
          </Row>
        </div>
      </Container>
  );
};

export default AdminMaqalDrop;
