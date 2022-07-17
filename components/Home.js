import { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient'

//const res = await supabase
//  .from('profiles')
//  .update('username', 'ccc4')
//  .eq('username', 'ccc3')

//console.log(res)

const Home = () => {
  const [change, setChange] = useState({});

  useEffect(() => {
    const subscription = supabase
      .from("profiles")
      .on("*", (payload) => {
        console.log('Change ', payload);
        setChange(payload)
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return ( 
    <>
      <div>{ JSON.stringify(change)}</div>
      id: <div>{change.new && JSON.stringify(change.new.id)}</div>
      username: <div>{change.new && JSON.stringify(change.new.username)}</div>
    </>
  )
};

export default Home;
