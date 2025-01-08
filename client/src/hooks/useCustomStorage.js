import { useState, useEffect, useCallback } from "react";
import CustomStorage from "./CustomStorage";

const storage = new CustomStorage();

const useCustomStorage = () => {
  const [storedData, setStoredData] = useState(() => {
    // Load initial data from custom storage
    const keys = storage.getAllKeys();
    const initialData = {};
    keys.forEach((key) => {
      initialData[key] = storage.getItem(key);
    });
    return initialData;
  });

  const setItem = useCallback((key, value) => {
    storage.setItem(key, value);
    setStoredData((prevData) => ({ ...prevData, [key]: value }));
  }, []);

  const getItem = useCallback((key) => {
    return storage.getItem(key);
  }, []);

  const removeItem = useCallback((key) => {
    storage.removeItem(key);
    setStoredData((prevData) => {
      const newData = { ...prevData };
      delete newData[key];
      return newData;
    });
  }, []);

  const clear = useCallback(() => {
    storage.clear();
    setStoredData({});
  }, []);

  return {
    setItem,
    getItem,
    removeItem,
    clear,
    storedData,
  };
};

export default useCustomStorage;
