import { type CSSProperties } from 'react';

import { clockDateTime, formatClockTime } from '~/lib/clock';
import { describeSky, solarElevation, type Observer } from '~/lib/solar';

import '~/styles/sundial.css';

/*
 * The two things a bar says about the time: what o'clock it is, and where the
 * sun has got to.
 *
 * Both take the instant as a prop rather than reading the clock themselves, so
 * they stay pure and the caller decides what "now" means. Neither hydrates —
 * React is the authoring API, there is no `client:*` directive, and this
 * renders to static HTML. What the server renders is the build's instant,
 * which `src/lib/time-chrome.ts` corrects on load and then every minute. The
 * fields are fixed-width, so only the digits change.
 */

export interface ClockProps {
  now: Date;
}

export function Clock({ now }: ClockProps) {
  return (
    /*
     * Deliberately not a live region. A clock that announced itself every
     * minute would interrupt whatever was being read, for information nobody
     * asked for; a screen reader user reaches it the same way a sighted one
     * looks at it.
     */
    <time dateTime={clockDateTime(now)} data-clock className="tabular-nums">
      {formatClockTime(now)}
    </time>
  );
}

export interface SunDialProps {
  now: Date;
  observer?: Observer | undefined;
}

export function SunDial({ now, observer }: SunDialProps) {
  const sky = describeSky(solarElevation(now, observer));

  return (
    <span
      className="sundial"
      data-sundial
      data-body={sky.body}
      style={{ '--sky-height': sky.height } as CSSProperties}
    >
      <svg
        viewBox="0 0 16 16"
        className="sundial-sky"
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        <g className="sky-stars">
          <rect x="12" y="1" width="1" height="1" />
          <rect x="3" y="4" width="1" height="1" />
          <rect x="13" y="7" width="1" height="1" />
        </g>

        {/* Both bodies are drawn; CSS shows whichever one is up. Vanilla JS
            then only has to set an attribute and a number, never redraw. */}
        <g className="sky-body">
          <g className="sky-sun">
            <rect x="7" y="2" width="2" height="1" />
            <rect x="6" y="3" width="4" height="2" />
            <rect x="7" y="5" width="2" height="1" />
            <rect x="7" y="0" width="2" height="1" />
            <rect x="7" y="7" width="2" height="1" />
            <rect x="4" y="3" width="1" height="2" />
            <rect x="11" y="3" width="1" height="2" />
          </g>

          <g className="sky-moon">
            <rect x="7" y="2" width="2" height="1" />
            <rect x="6" y="3" width="2" height="1" />
            <rect x="6" y="4" width="2" height="1" />
            <rect x="7" y="5" width="2" height="1" />
          </g>
        </g>

        <rect className="sky-horizon" x="0" y="13" width="16" height="1" />
      </svg>

      <span className="sr-only" data-sundial-label>
        {sky.label}
      </span>
    </span>
  );
}
