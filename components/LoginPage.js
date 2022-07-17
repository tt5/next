import { Auth, Card } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return (
      <>
      <div style={{maxWidth: "600px"}}>
        <Card>
          <Auth
            supabaseClient={supabase}
            providers={["google", "github"]}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Card>
      </div>
      </>
    );
  }

  return (
    <>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </>
  );
};

export default LoginPage;
