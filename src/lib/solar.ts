/*
 * Where the sun is, from the UK, at a given instant.
 *
 * The low-precision model: a declination from the day of the year, an hour
 * angle from mean solar time, and the standard elevation identity. It ignores
 * the equation of time and refraction, so it is a few minutes out at the
 * solstices — which is invisible in a 20px dial, and the reason nothing here
 * pretends to be an ephemeris.
 *
 * Everything works from UTC, so the answer is the same wherever the page is
 * being read from. The sky over London does not move because a visitor is in
 * Sydney.
 */

export interface Observer {
  latitude: number;
  longitude: number;
}

/* Roughly Greenwich, which is as specific as "the UK" gets to be. */
export const ukObserver: Observer = { latitude: 51.5, longitude: -0.1 };

const degreesPerRadian = 180 / Math.PI;
const axialTilt = 23.44;
const millisecondsPerDay = 86_400_000;

function dayOfYear(when: Date): number {
  const yearStart = Date.UTC(when.getUTCFullYear(), 0, 1);
  return Math.floor((when.getTime() - yearStart) / millisecondsPerDay) + 1;
}

/** The sun's declination in degrees: +23.44 at midsummer, -23.44 at midwinter. */
export function solarDeclination(when: Date): number {
  // +10 puts the cosine's peak on the December solstice rather than 1 January.
  return -axialTilt * Math.cos(((2 * Math.PI) / 365) * (dayOfYear(when) + 10));
}

/** The sun's angle above the horizon in degrees. Negative means it has set. */
export function solarElevation(when: Date, observer: Observer = ukObserver): number {
  const utcHours =
    when.getUTCHours() + when.getUTCMinutes() / 60 + when.getUTCSeconds() / 3600;
  const solarHours = utcHours + observer.longitude / 15;
  const hourAngle = (15 * (solarHours - 12)) / degreesPerRadian;

  const latitude = observer.latitude / degreesPerRadian;
  const declination = solarDeclination(when) / degreesPerRadian;

  const sine =
    Math.sin(latitude) * Math.sin(declination) +
    Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);

  return degreesPerRadian * Math.asin(Math.min(1, Math.max(-1, sine)));
}

export type SkyBody = 'sun' | 'moon';

export interface Sky {
  body: SkyBody;
  /** How high the visible body is drawn: 0 on the horizon, 1 at its highest. */
  height: number;
  /** The dial's text alternative. The picture carries nothing this does not. */
  label: string;
}

/* The highest the sun reaches from these latitudes. Midnight in midwinter is
   about as far the other side, so one number does for both bodies. */
const peakElevation = 62;

export function describeSky(elevation: number): Sky {
  const body: SkyBody = elevation >= 0 ? 'sun' : 'moon';
  const magnitude = Math.abs(elevation);

  return {
    body,
    height: Math.min(1, magnitude / peakElevation),
    label:
      body === 'sun'
        ? `Daytime: the sun is ${Math.round(magnitude)} degrees above the horizon.`
        : `Night-time: the sun is ${Math.round(magnitude)} degrees below the horizon.`,
  };
}
