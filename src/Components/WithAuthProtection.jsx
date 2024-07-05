import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const WithAuthProtection = (WrappedComponent) => {
  const WithAuth = (props) => {
    const [user,setState] = useState(null)
    const navigate = useNavigate();
    const [loading,isLoading]=useState(true);

    useEffect(() => {
      const unsubscribe=onAuthStateChanged(auth,(user) => {
        if(user){
          setState(user)
          console.log('logged in')
        }
        else{
         
          navigate('/');
        }
        isLoading(false);
      })
      //unsubscribe is the function returned by onAuthStateChanged to stop listening to state changes
      return ()=> unsubscribe();//This is a clean up function it runs when the component is unmounted fro the dom
      //it is used for memory clean up so that there isno outdated data present  and helps in reducing memory leaks
      
    }, [user, navigate]);
    if (loading) {
      return <div className='mt-[40px]'>
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">

      </div>
  </div>; // Show a loading indicator while checking auth state
    }
    if (!user) {
      alert('log in first')
      console.log("User not signed in, redirecting...");
      
    }
    
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};
export default WithAuthProtection;