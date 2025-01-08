import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
      const username = user?.providerData[0].displayName
        ? user?.providerData[0].displayName
        : user?.email.substring(0, user.email.indexOf("@"));
      setUserName(username);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, userName, isLoading };
};

export default useUser;
