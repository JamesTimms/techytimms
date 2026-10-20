/* Low-precision sun position over the UK, in UTC; ignores equation of time and refraction (minutes out at solstices). */

export interface Observer {
  latitude: number;
  longitude: number;
}

export const ukObserver: Observer = { latitude: 51.5, longitude: -0.1 };

const degreesPerRadian = 180 / Math.PI;
const axialTilt = 23.44;
const millisecondsPerDay = 86_400_000;

function dayOfYear(when: Date): number {
  const yearStart = Date.UTC(when.getUTCFullYear(), 0, 1);
  return Math.floor((when.getTime() - yearStart) / millisecondsPerDay) + 1;
}

export function solarDeclination(when: Date): number {
  // The sun's declination in degrees: +23.44 at midsummer, -23.44 at midwinter.
  // +10 puts the cosine's peak on the December solstice rather than 1 January.
  return -axialTilt * Math.cos(((2 * Math.PI) / 365) * (dayOfYear(when) + 10));
}

export function solarElevation(when: Date, observer: Observer = ukObserver): number {
  // The sun's angle above the horizon in degrees. Negative means it has set.
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
  height: number;  // How high the visible body is drawn: 0 on the horizon, 1 at its highest.
  label: string;  // The dial's text alternative. The picture carries nothing this does not.
}

/* Peak elevation; midwinter midnight is symmetric, so it serves both bodies. */
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
