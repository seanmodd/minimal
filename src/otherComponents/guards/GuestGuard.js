import PropTypes from 'prop-types';
// import { Navigate } from 'react-router-dom';
// hooks
import useAuth from 'src/otherComponents/hooks/useAuth';
// routes
import { PATH_DASHBOARD } from 'src/otherComponents//routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated } = useAuth();

  console.log('🥸🥸🥸', useAuth());

  if (isAuthenticated) {
    console.log(
      '🚀 ~ file: GuestGuard.js ~ line 18 ~ GuestGuard ~ isAuthenticated is true: ',
      isAuthenticated
    );
    // return <Navigate href={PATH_DASHBOARD.root} />;

    return (
      <>
        {/* <Navigate href={PATH_DASHBOARD.root} /> */}
        <button style={{ backgroundColor: '#ff0000' }}>Logout?</button>
        {children}
      </>
    );
  }

  console.log(
    '🚀 ~ file: GuestGuard.js ~ line 18 ~ GuestGuard ~ isAuthenticated is false: ',
    isAuthenticated
  );

  return (
    <>
      {/* <Navigate href={PATH_DASHBOARD.root} /> */}
      <button style={{ backgroundColor: '#ff0000' }}>
        Login! Still Guest currently.
      </button>
      {children}
    </>
  );

  return <>{children}</>;
}
