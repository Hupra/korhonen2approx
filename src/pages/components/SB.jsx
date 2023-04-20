import React, { useEffect, useRef } from 'react';
import Scrollbar from 'smooth-scrollbar';

const SB = ({ children, ...rest }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollbar = Scrollbar.init(containerRef.current, {
      damping: 0.1, // Adjust the damping value (0 to 1) as needed
      thumbMinSize: 20, // Adjust the thumb minimum size as needed
      renderByPixels: true, // Set to false for smoother rendering on non-integer values
      alwaysShowTracks: true, // Set to true to always show the scrollbar tracks
      continuousScrolling: true, // Set to false for a more traditional scrollbar behavior
      ...rest,
    });

    return () => {
      scrollbar.destroy();
    };
  }, [rest]);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        padding: '14px'
      }}
    >
      <div className="scrollcontainer" style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>{children}</div>
    </div>
  );
};

export default SB;