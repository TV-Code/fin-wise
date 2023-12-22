import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api';
import { Link, CircularProgress } from '@mui/material';
import { CommonStyledTextField } from '../CommonStyledComponents';
import "./authstyles.css";

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        if (username.trim() === '' || password.trim() === '') {
            setErrorMessage("Both username and password are required.");
            return false;
        }
        return true;
    };

    const checkConfirmPassword = () => {
        if (password != confirmPassword) {
            setErrorMessage("Passwords do not match.")
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs() || !checkConfirmPassword()) return;

        setIsLoading(true);
        try {
            const response = await signupUser(username, password);
            if (response) {
                navigate('/login')
            }
        } catch (error) {
            setErrorMessage(error.response.data.message || 'Signup failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div>
                <h1 className="auth-text" variant="h5" gutterBottom>
                    Sign Up
                </h1>
                <form className="auth-form" onSubmit={handleSubmit} >
                    <CommonStyledTextField
                        fullWidth
                        variant="outlined"
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        margin="normal"
                        autoComplete="off"
                    />
                    <CommonStyledTextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="new-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        margin="normal"
                        autoComplete="off"
                    />
                    <CommonStyledTextField
                        fullWidth
                        variant="outlined"
                        label="Confirm Password"
                        type="new-password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        margin="normal"
                        autoComplete="off"
                    />
                    <button
                        className="auth-button"
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        <div className="auth-button-text">
                            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                        </div>
                    </button>
                    {errorMessage && <h4 className="auth-error-text">{errorMessage}</h4>}
                    <h4 className="auth-additional-text">
                        <Link href="/login">Back</Link>
                    </h4>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
