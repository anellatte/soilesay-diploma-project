import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./components/account/Account";
import Sidebar from "./components/sidebar/Sidebar";
import SuraqJauap from "./components/suraq-jauap/SuraqJauap";
import MaqalDrop from "./components/maqal-drop/MaqalDrop";
import Talda from "./components/talda/Talda";
import Tanda from "./components/tanda/Tanda";
import Sozdly from "./components/sozdly/Sozdly";
import Tynda from "./components/tynda/Tynda";
import Home from "./components/home/Home";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import Profile from "./components/account/Profile";
import AdminMaqalDrop from "./components/admin/AdminMaqalDrop";
import AdminSuraqJauap from "./components/admin/AdminSuraqJauap";
import AdminPage from "./components/admin/AdminPage";
import AdminAddNews from "./components/admin/AdminAddNews";
import AdminEditNews from "./components/admin/AdminEditNews";
import AdminTalda from "./components/admin/AdminTalda";
import AdminTaldaAdd from "./components/admin/AdminTaldaAdd";
import AdminTaldaEdit from "./components/admin/AdminTaldaEdit";
import AdminSJAdd from "./components/admin/AdminSJAdd";
import AdminSJEdit from "./components/admin/AdminSJEdit";
import EventForm from './components/home/EventForm';
import LeaderBoard from './components/home/LeaderBoard';
import AdminMDAdd from './components/admin/AdminMDAdd';
import AdminMDEdit from './components/admin/AdminMDEdit';
import AdminSozdly from './components/admin/AdminSozdly';
import AdminSozdlyAdd from './components/admin/AdminSozdlyAdd';
import AdminSozdlyEdit from './components/admin/AdminSozdlyEdit';
import AdminPuzzle from "./components/admin/AdminPuzzle";
import AdminPuzzleAdd from "./components/admin/AdminPuzzleAdd";
import AdminPuzzleEdit from "./components/admin/AdminPuzzleEdit";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from './components/landing/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import AdminTyndaAdd from "./components/admin/AdminTyndaAdd";
import AdminTyndaEdit from "./components/admin/AdminTyndaEdit";
import AdminTynda from "./components/admin/AdminTynda";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        // Check if there is a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Decode token and set user data
            const storedUserData = JSON.parse(localStorage.getItem('userData'));
            setIsAuthenticated(true);
            setUserData(storedUserData);
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUserData(userData);
        // Store user data and token in localStorage
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData({});
        // Remove user data and token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    };

    return (
        <Router>
            <ErrorBoundary>
                <div className="App">
                    {!isAuthenticated ? (
                        <div className="authorization">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
                                <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
                            </Routes>
                        </div>
                    ) : (
                        <>
                            <Sidebar isAdmin={userData.isAdmin} />
                            <div className="content">
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/home" element={
                                        <>
                                            <Home />
                                            <Account username={userData.username} email={userData.email} onLogout={handleLogout} />
                                        </>
                                    } />
                                    <Route path="/tanda" element={<Tanda />} />
                                    <Route path="/maqalDrop" element={<MaqalDrop />} />
                                    <Route path="/suraqJauap" element={<SuraqJauap />} />
                                    <Route path="/talda" element={<Talda />} />
                                    <Route path="/sozdly" element={<Sozdly />} />
                                    <Route path="/tynda" element={<Tynda />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/eventForm" element={<EventForm />} />
                                    <Route path="/leaderBoard" element={<LeaderBoard />} />
                                    {userData.isAdmin && (
                                        <>
                                            <Route path="/adminMaqalDrop" element={<AdminMaqalDrop username={userData.username} />} />
                                            <Route path="/admin/sj" element={<AdminSuraqJauap username={userData.username} />} />
                                            <Route path="/admin/talda" element={<AdminTalda />} />
                                            <Route path="/admin/sozdly" element={<AdminSozdly />} />
                                            <Route path="/admin/puzzle" element={<AdminPuzzle />} />
                                            <Route path="/admin/tynda" element={<AdminTynda />} />

                                            <Route path="/admin" element={
                                                <>
                                                    <AdminPage />
                                                </>
                                            } />
                                            <Route path="/admin/add" element={<AdminAddNews />} />
                                            <Route path="/admin/edit/:id" element={<AdminEditNews />} />
                                            <Route path="/admin/talda/add" element={<AdminTaldaAdd />} />
                                            <Route path="/admin/talda/edit/:id" element={<AdminTaldaEdit />} />
                                            <Route path="/admin/sj/add" element={<AdminSJAdd />} />
                                            <Route path="/admin/sj/edit/:id" element={<AdminSJEdit />} />
                                            <Route path="/admin/maqaldrop/add" element={<AdminMDAdd />} />
                                            <Route path="/admin/maqaldrop/edit/:id" element={<AdminMDEdit />} />
                                            <Route path="/admin/sozdly/add" element={<AdminSozdlyAdd />} />
                                            <Route path="/admin/sozdly/edit/:id" element={<AdminSozdlyEdit />} />
                                            <Route path="/admin/puzzle/add" element={<AdminPuzzleAdd />} />
                                            <Route path="/admin/puzzle/edit/:id" element={<AdminPuzzleEdit />} />
                                            <Route path="/admin/tynda/add" element={<AdminTyndaAdd />} />
                                            <Route path="/admin/tynda/edit/:id" element={<AdminTyndaEdit />} />
                                        </>
                                    )}
                                </Routes>
                            </div>
                        </>
                    )}
                </div>
            </ErrorBoundary>
        </Router>
    );
}

export default App;