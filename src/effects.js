import React, { useState, useRef, useEffect } from 'react';
import {
  randomRange, randomInt, randomElement, τ
} from './util-math';

// Actually, we don't have to regenerate the pattern for each screen resize.
// If we can save the result, just repaint with the same pattern for the new screen.
// UPDATE: Generate stars pattern only once, and reuse the pattern for each window resizing response
//         Separate useEffect
export const StarryNight = props => {
  const { width, height, ...others } = props;
  const canvasRef = useRef(null);
  const txtCvsRef = useRef(document.createElement('canvas'));
  const txtW = 301;

  useEffect(() => {
    const txtCvs = txtCvsRef.current;  // texture buffer canvas, offscreen
    txtCvs.width  = txtW - 1;
    txtCvs.height = txtW - 1;
    const txt = txtCvs.getContext('2d', { alpha: false });  // no transparent, to optimize rendering

    const randomHue = () => randomElement( [0, 30, 60, 90, 120, 180, 240] );  // colors
    const stars = 300 + randomInt( 200 );

    txt.clearRect(0, 0, txtCvs.width, txtCvs.height);  // Otherwise the pattern will be accumulated
    for (let i=0; i < stars; i++) {
      txt.beginPath();
      txt.arc(randomInt( txtW ), randomInt( txtW ), randomRange(.1, .9, 2), 0, τ);
      txt.fillStyle = `hsla(${randomHue()},${50 + randomInt( 50 )}%,88%,${randomRange(.4, 1-.4, 2)})`;
      txt.fill();  // fill() was faster than stroke()
    }
    console.log(`${stars} stars generated in ${txtW-1}x${txtW-1} pattern.`);
  }, []); // initialize only once

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d'); //, { alpah: false });
    ctx.fillStyle = ctx.createPattern(txtCvsRef.current, 'repeat');  // create pattern from txtCvs canvas in ctx
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [width, height]);  // only when size changes

  return (
    <canvas ref={canvasRef} width={width} height={height}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
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
      background: back[id]
    }}
    onDoubleClick={() => setBackId(backId + 1)}>
      <StarryNight width={props.width} height={props.height}
                   visibility={(back[id].substring(0,3) === 'url') ? 'hidden' : 'visible'} />
    </div>
  );
}
