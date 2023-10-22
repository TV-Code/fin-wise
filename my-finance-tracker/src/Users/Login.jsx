import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { Link, Typography, CircularProgress } from '@mui/material';
import { CommonStyledTextField } from '../CommonStyledComponents';
import './authstyles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        if (username.trim() === '' || password.trim() === '') {
            setErrorMessage("Both username and password are required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        console.log("Before preventDefault");
        e.preventDefault();
        console.log("After preventDefault");
    
        if (!validateInputs()) return;
    
        setIsLoading(true);
        try {
            const response = await loginUser(username, password, rememberMe);
            if (response) { 
                setIsLoggedIn(true);
                navigate("/");
                console.log(rememberMe);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response ? error.response.data.detail : 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            
                <h5 className="auth-text">Login</h5>
                <form className="auth-form" onSubmit={handleSubmit}>
                        <CommonStyledTextField
                            className="auth-input"
                            fullWidth
                            variant="outlined"
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            margin="normal"
                            autoComplete="off"
                        />
                        <CommonStyledTextField
                            className="auth-input"
                            fullWidth
                            variant="outlined"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            margin="normal"
                            autoComplete="off"
                        />
                        <div className="auth-additional-text">
                            Remember Me
                            <input 
                                type="checkbox" 
                                className="auth-checkbox" 
                                checked={rememberMe} 
                                onChange={e => setRememberMe(e.target.checked)} 
                            />
                        </div>
                        <button
                            className="auth-button"
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                        >
                            <div className="auth-button-text">
                            {isLoading ? <CircularProgress size={24} /> : 'Login'}
                            </div>
                        </button>
                    {errorMessage && <h4 className="auth-error-text">{errorMessage}</h4>}
                    <h4 className="auth-additional-text">
                        Don't have an account? <Link href="/signup">Sign up here</Link>
                    </h4>
                </form>
            </div>
        </div>
    );
}

export default Login;
