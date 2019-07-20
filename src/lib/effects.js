import React, { useState, useRef, useEffect } from 'react';
import {
  randomRange, randomInt, randomElement, τ
} from './util-math';

// Actually, we don't have to regenerate the pattern for each screen resize.
// If we can save the result, just repaint with the same pattern for the new screen.
// UPDATE: Generate stars pattern only once, and reuse the pattern for each window resizing response
//         Separate useEffect
// - alpha should be set true to show the background color changes. And :root { background: black; }.
export const StarryNight = props => {
  const { width, height, ...others } = props;
  const canvasRef = useRef(null);  // React will set .current property to the corresponding DOM node
  const bufCvsRef = useRef(document.createElement('canvas'));  // to persist between renders

  useEffect(() => {  // Offscreen buffer canvas
    const bufW = 301;
    const bufCvs = bufCvsRef.current;  // texture buffer canvas
    bufCvs.width  = bufW - 1;
    bufCvs.height = bufW - 1;
    const buf = bufCvs.getContext('2d', { alpha: true });  // no transparent, to optimize rendering

    const randomHue = () => randomElement( [0, 30, 60, 90, 120, 180, 240] );  // colors
    const stars = 300 + randomInt( 200 );

    //buf.clearRect(0, 0, bufCvs.width, bufCvs.height);  // If repeated the pattern will be accumulated
    for (let i=0; i < stars; i++) {
      buf.beginPath();
      buf.arc(randomInt( bufW ), randomInt( bufW ), randomRange(.1, .9, 2), 0, τ);
      buf.fillStyle = `hsla(${randomHue()},${50 + randomInt( 50 )}%,88%,${randomRange(.4, 1-.4, 2)})`;
      buf.fill();  // fill() was faster than stroke()
    }
    console.log(`${stars} stars generated in ${bufW-1}x${bufW-1} pattern.`);
  }, []); // initialize only once

  useEffect(() => {  // On screen canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d'); //, { alpah: false });
    ctx.fillStyle = ctx.createPattern(bufCvsRef.current, 'repeat');  // create pattern from bufCvs canvas in ctx
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [width, height]);  // only when size changes

  return (
    <canvas ref={canvasRef} width={width} height={height}
      style={{
        position: 'absolute',
        left: 0,
        top : 0,
        ...others  // visiblity works only in style object
      }}
    />
  );
}

// When showing images just hide <StarryNight /> with visibility to prevent destroying it that will be costly.
// image files should be in ../public/images/
export const BackDrop = props => {
  const [backId, setBackId] = useState(0);
  const back = [
    "Black",
    "#000032",
    "#191970",  // MidnightBlue
    "url('images/back1.jpg')",
    "url('images/back2.jpg')",
    "url('images/back3.jpg')",
  ];
  const id = backId % back.length;

  return (
    <div style={{
        position:  'absolute',
        width:      props.width,
        height:     props.height,
        transition: 'background 2s',
        background: back[id],
        zIndex:     '-10'
      }}
      onDoubleClick={() => setBackId(backId + 1)}
    >
      <StarryNight width={props.width} height={props.height}
                   visibility={(back[id].substring(0,3) === 'url') ? 'hidden' : 'visible'} />
    </div>
  );
}
