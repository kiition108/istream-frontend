'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/contexts/Authcontext.js';

const withAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (user === undefined) {
        // do nothing yet (still loading auth)
      } else if (user === null) {
        router.push('/login');
      }
    }, [user]);

    if (user === null || user === undefined) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
