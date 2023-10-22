import { Outlet, useNavigate } from 'react-router-dom';
import { authCheck } from './api';
import React from 'react';

const PrivateWrapper = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                await authCheck(); 
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [navigate]);

    return <Outlet />;
}

export default PrivateWrapper;


