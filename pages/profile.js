import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { supabase } from '../utils/supabaseClient'

export default function Profile({ user, accessToken }) {
  
  return <div>Hello {user.email}</div>;
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
