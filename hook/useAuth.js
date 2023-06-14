import { useState, useEffect } from 'react';

import auth from '@react-native-firebase/auth';

const useAuthorized = () => {
  const [isAppInit, setInitApp] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  // const navigation = useNavigation();
  const _watchUserLoggedin = () => {
    auth().onAuthStateChanged(user => {
      if (user) {
        // login
        setIsAuth(true);
      } else {
        // logout
        setIsAuth(false);
      }
      // remain login
      if (isAppInit) {
        setInitApp(false);
        setIsAuthLoading(false);
      }
    });
  };

  useEffect(() => {
    _watchUserLoggedin();
  }, []);

  return {
    isAuthorized: isAuth,
    isAuthorizing: isAuthLoading,
    isAppInit,
  };
};

export default useAuthorized;
