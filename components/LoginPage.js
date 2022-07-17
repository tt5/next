import { Auth } from '@supabase/ui';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient'
import { useEffect, useState } from 'react';

const LoginPage = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


  if (!session)
    return (
      <>
        <Auth
          supabaseClient={supabase}
          providers={['google', 'github']}
          socialLayout="horizontal"
          socialButtonSize="xlarge"
        />
      </>
    );

  return (
    <>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </>
  );
};

export default LoginPage;
