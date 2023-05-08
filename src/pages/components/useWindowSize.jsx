import { useState, useEffect } from 'react';

function useWindowSize() {
    const [window_size, set_window_size] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  
    useEffect(() => {
      const handle_resize = () => {
        set_window_size({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
  
      window.addEventListener('resize', handle_resize);
  
      return () => {
        window.removeEventListener('resize', handle_resize);
      };
    }, []);
  
    return window_size;
  }

  export default useWindowSize;