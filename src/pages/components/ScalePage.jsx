import { useEffect } from 'react';

const ScalePage = (target_height) => {
//   useEffect(() => {
//     const setZoomBasedOnHeight = () => {
//       const screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//       const scale = screen_height / target_height;

//       document.body.style.transform = `scale(${scale})`;
//       document.body.style.transformOrigin = 'top';
//     };

//     setZoomBasedOnHeight();
//     window.addEventListener('load', setZoomBasedOnHeight);
//     window.addEventListener('resize', setZoomBasedOnHeight);

//     return () => {
//       window.removeEventListener('load', setZoomBasedOnHeight);
//       window.removeEventListener('resize', setZoomBasedOnHeight);
//     };
//   }, [target_height]);
};

export default ScalePage;