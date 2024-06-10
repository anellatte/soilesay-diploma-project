import React, { useState, useEffect } from "react";
import { getAllUsersWithLevels } from '../api';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LeaderBoard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsersWithLevels();
                const usersWithScores = usersData.map(user => ({
                    ...user,
                    totalScore: user.taldaLevel + user.SJLevel + user.sozdlyLevel + user.maqalLevel + user.tyndaLevel
                }));

                // Sort users by total score
                usersWithScores.sort((a, b) => b.totalScore - a.totalScore);

                // Assign ranks considering ties
                let currentRank = 1;
                usersWithScores.forEach((user, index, array) => {
                    if (index > 0 && user.totalScore < array[index - 1].totalScore) {
                        currentRank++;
                    }
                    user.rank = currentRank;
                });

                // Slice to top 10 users after ranking
                const topUsers = usersWithScores.slice(0, 10);
                setUsers(topUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Group users by rank
    const groupedUsers = users.reduce((acc, user) => {
        if (!acc[user.rank]) {
            acc[user.rank] = [];
        }
        acc[user.rank].push(user);
        return acc;
    }, {});

    return (
        <Container className='leader-board content__body'>
            <div className='leader__inner'>
                <h2 className="home__title title">LEADER BOARD</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th className="leader__td total-score">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedUsers).map((rank) => (
                            <tr key={rank}>
                                <td>{rank}</td>
                                <td>
                                    {groupedUsers[rank].map(user => (
                                        <div key={user._id}>{user.username}</div>
                                    ))}
                                </td>
                                <td>
                                    {groupedUsers[rank].map(user => (
                                        <div key={user._id}>{user.totalScore}</div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default LeaderBoard;
