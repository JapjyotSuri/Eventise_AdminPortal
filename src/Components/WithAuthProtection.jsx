import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const WithAuthProtection = (WrappedComponent) => {
  const WithAuth = (props) => {
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        console.log("User not signed in, redirecting...");
        navigate('/');
      }
    }, [user, navigate]);
    if (!user) return <div><p>Login first</p></div>;
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default WithAuthProtection;
