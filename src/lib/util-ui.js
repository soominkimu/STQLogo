// util-ui.js
import React, { useState, useEffect, useRef } from 'react';

export const copyright = title => {
// ASCII ART: http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20
  console.log("╔═╗┌─┐┌─┐┌─┐┌─┐┌┬┐┬┌┬┐┌─┐╔═╗  " + title + " - contact: dev.spacetimeq@gmail.com");
  console.log("╚═╗├─┘├─┤│  ├┤  │ ││││├┤ ║═╬╗", Date());
  console.log("╚═╝┴  ┴ ┴└─┘└─┘ ┴ ┴┴ ┴└─┘╚═╝╚ (C)2019 SpacetimeQ Inc, CA 94583");
};

// reacts only to the width change
export const useWindowWidth = () => {
  const RESIZE = 'resize';
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const handleWindowResize = () => setWinWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener(RESIZE, handleWindowResize);
    return () => window.removeEventListener(RESIZE, handleWindowResize);
  }, []);

  return winWidth;
}

// reacts to both width and height changes
// aspect ration = w / h; Portrait (asp <= 1) Landscape (asp > 1)
export const useWindowSize = () => {
  const RESIZE = 'resize';
  const getWs = () => ({
    w: window.innerWidth,
    h: window.innerHeight
  });
  const [winSize, setWinSize] = useState(getWs());
  const handleWindowResize = () => setWinSize(getWs());

  useEffect(() => {
    window.addEventListener(RESIZE, handleWindowResize);
    return () => window.removeEventListener(RESIZE, handleWindowResize);
    // eslint-disable-next-line
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
  const { render, ...others }      = props;
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
      {...others}
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
      const id = setInterval(tick, delay);
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

// 0: Chrome, 1: Safari, 2: Firefox
export const detectBrowser = () => {
  console.log("detectBrowser()");
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1)
    return (ua.indexOf('chrome') > -1) ? 0 : 1;
  if (ua.indexOf('firefox'))
    return 2;
  return -1;
}

export const detectMobile = () => {
  // http://detectmobilebrowsers.com/
  let check = false;
// eslint-disable-next-line
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

export const isSafari = detectBrowser() === 1;
