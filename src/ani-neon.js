import React          from 'react';
import { isSafari }   from './lib/util-ui';

const mixBlendMode = isSafari ? 'screen' : undefined;  // or 'normal'
// Animation Variations - combinations of the following:
// 1. Color Set [rainbow, blues]
// 2. Two classes with different CSS animations

/*  Structure of anidef.json
{
"transform": [  // transform parameters
  {"scale": 1, "opacity": 1},
],
"combination": [ // combination of transform parameters for each animation object (<div> elements)
  {"ref0": 0, "ref1": 0},  // ref0 and ref1 refer to the two animation objects
],
"factor": [  // different set of factors: for example, factor[0] inner circle, factor[1] outer circle
  { "xR": 1.3, "dr": 2, "t": 3,
    "colors":
  [ "rgb(0,  0,  128)", ...
  ]
  },
  { "xR": 1.5, "dr": 3, "t": 40,
    "colors":
  [ "rgba(148,0,211,.3)", ...
  ]
  }
],
}
*/

// This is the body of the animation object
// that can be referenced through rEl (ref to the DOM element)
export const AniNeonColors = ({factor, rEl, ani, R}) =>
  <div ref={rEl} className="l1">
    {factor.map( (f, q) =>
      f.colors.map( (color, i) =>
        <div className={ani} key={q*10 + i}
          style = {{
            '--ra': (Math.floor(R * f.xR) + f.dr * i) + 'px',
            '--cl': color,
            '--t' : (f.t + i) + 's',
            '--bm': mixBlendMode
          }}
        /> )
      )
    }
  </div>;
