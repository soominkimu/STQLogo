// util-ui.js
import React, { useState, useEffect, useRef } from 'react';

// reacts only to the width change
export const useWindowWidth = () => {
  const [winWidth, setWinWidth] = useState(window.innerWidth);

  const handleWindowResize = () => {
    setWinWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return winWidth;
}

// reacts to both width and height changes
// aspect ration = w / h; Portrait (asp <= 1) Landscape (asp > 1)
export const useWindowSize = () => {
  const [winSize, setWinSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight
  });

  const handleWindowResize = () => setWinSize({
    w: window.innerWidth,
    h: window.innerHeight
  });

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return winSize;
}
/*
// Usage
function App() {
  // Call our hook for each key that we'd like to monitor
  const happyPress = useKeyPress('h');
  const sadPress = useKeyPress('s');
  const robotPress = useKeyPress('r');
  const foxPress = useKeyPress('f');

  return (
    <div>
      <div>h, s, r, f</div>
      <div>
        {happyPress && '😊'}
        {sadPress && '😢'}
        {robotPress && '🤖'}
        {foxPress && '🦊'}
      </div>
    </div>
  );
}
*/

// Hook
// left, up, right, down = 37, 38, 39, 40
export function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

// Mouse / TrackPad Event Handlers Wrapper
// props.render should be provided, that handles changed x, y position
export const EventMove = props => {
  const [mousedown,  setMouseDown] = useState(false);
  const [mouse,      setMouse]     = useState({x: 0, y: 0});

  const _moveStart = ev => {
    const p = (ev.type === 'touchstart') ?
      {x: ev.touches[0].pageX,
       y: ev.touches[0].pageY} :
      {x: ev.clientX,
       y: ev.clientY};
    setMouseDown(true);
    setMouse(p);
  }

  const _move = ev => {
    if (mousedown) {
      const p = (ev.type === 'touchmove') ?
        {x: ev.touches[0].pageX,
         y: ev.touches[0].pageY} :
        {x: ev.clientX,
         y: ev.clientY};
      props.render(p.x - mouse.x, p.y - mouse.y);  // Render Props
      setMouse(p);
    }
  }

  const _moveEnd = () => { setMouseDown(false); }
    
  const handleMouseDown = ev => { _moveStart(ev); }
  const handleMouseMove = ev => { _move(ev); }
  const handleMouseUp   = ev => { _moveEnd(); }

  const handleTouchStart = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    _moveStart(ev);
  }

  const handleTouchMove = ev => {
    ev.preventDefault();
    ev.stopPropagation();  // seems not working
    ev.nativeEvent.stopImmediatePropagation();
    _move(ev);
  }
  const handleTouchEnd = () => {
    _moveEnd();
  }

  return (
    <div
      onMouseUp    = {handleMouseUp}
      onMouseMove  = {handleMouseMove}
      onMouseDown  = {handleMouseDown}
      onTouchStart = {handleTouchStart}
      onTouchMove  = {handleTouchMove}
      onTouchEnd   = {handleTouchEnd}
    >
      {props.children}
    </div>
  );
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 05/10/2019 by Soomin
// Idle time CPU usage: 2% WTH?
export function useAnimationFrame(callback, delay) {
  const savedCallback = useRef();
  // const [lastTs, setLastTs] = useState(0);  // lastTs remained 0 in the tick loop even though setLastTs(ts) called.
  const lastTs = useRef(0);  // returned object will persist for the full lifetime of the component

  // Remember the latest callback
  useEffect(() => {
    //console.log(callback);
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    let frameId;

    const tick = ts => {  // loop called repeatedly by rAF
      if (ts - lastTs.current >= delay) {
        //console.log(ts, lastTs.current, ts - lastTs.current);
        lastTs.current = ts;
        savedCallback.current();
      }
      frameId = requestAnimationFrame(tick);
    }
    tick(0);  // called once at the start
    return () => cancelAnimationFrame(frameId);
  }, [delay]);
}
