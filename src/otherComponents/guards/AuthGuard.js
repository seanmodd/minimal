import { useState } from 'react';
// import { Navigate } from 'react-router-dom';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
// hooks
import useAuth from 'src/otherComponents/hooks/useAuth';
// pages
import Login from 'src/allTemplateComponents/authentication/login/LoginForm';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();

  const { pathname } = useRouter();
  console.log(
    '🚀 ~ file: AuthGuard.js ~ line 20 ~ AuthGuard ~ pathname',
    pathname
  );
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return (
      <>
        <button> 😮 Check src/guards/AuthGuard.js!</button>
        {/* 
     <Navigate href={requestedLocation} /> */}
      </>
    );
  }

  return <>{children}</>;
}
