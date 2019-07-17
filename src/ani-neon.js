import React        from 'react';
import { isSafari } from './util-ui';
import colorset     from './colorset.json'; // edit this file to change colors

// Animation Variations - combinations of the following:
// 1. Color Set [rainbow, blues]
// 2. Two classes with different CSS animations

// This is the body of the animation object
// that can be referenced through rEl (ref to the DOM element)
export const AniNeonColors = ({rEl, ani, R}) => {

  const NeonColors = ({colors, ra, dr, t}) =>
    <>
      {colors.map( (c, i) =>
        <div className={ani} key={i}
          style = {{
            '--ra': (ra + dr*i) + 'px',
            '--cl': c,
            '--t' : (t + i) + 's',
            '--bm': isSafari ? 'screen' : undefined  // 'normal'
          }}
        /> )
      }
    </>;

  return (  // ref to the DOM element <div>
    <div ref={rEl} className="l1">
      <NeonColors colors={isSafari ? colorset.bluesSafari : colorset.blues}
        ra={Math.floor(R * 1.3)} dr={2} t={3} />
      <NeonColors colors={colorset.rainbow}
        ra={Math.floor(R * 1.5)} dr={2} t={40} />
    </div>
  );
}

