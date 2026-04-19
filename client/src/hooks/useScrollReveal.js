import { useEffect } from 'react';
import { initScrollReveal } from '../utils/scrollReveal';

const useScrollReveal = () => {
  useEffect(() => {
    let observer;
    const timer = setTimeout(() => {
      observer = initScrollReveal();
    }, 60);
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);
};

export default useScrollReveal;
