'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/contexts/Authcontext.js';
import Loader from '@/components/Loader';

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (user === null || user === undefined) {
      return <Loader />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
