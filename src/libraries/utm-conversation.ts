import UtmCoordinate from '@/models/utmCoordinate';

export default class UTMConversation {

  // taken from; https://github.com/Tronald/CoordinateSharp/blob/master/CoordinateSharp/UTM_MGRS/UTM.Methods.cs
  // Convert WGS84 geographic coordinates to UTM coordinates
  public toUtm(lat: number, lon: number, utmSpan: number): UtmCoordinate {
        const a: number = 6378137;
        const f: number = 1.0 / 298.257223563;
        const b: number = a * (1 - f);

        const e: number = Math.sqrt(1 - Math.pow(b, 2) / Math.pow(a, 2));

        const drad: number = Math.PI / 180;
        const k0: number = utmSpan === 6 ? 0.9996 : 1.0;

        const phi: number = lat * drad; // convert latitude to radians
        // This formula taken from; http://www.iobildirici.com/kartograf/cografi_gk.pdf
        const zcm: number = utmSpan === 6 ?
                                6 * Math.floor(lon / 6) + 3 :
                                3 * Math.floor((lon + 1.5) / 3);
        const esq: number = (1 - (b / a) * (b / a));
        const e0sq: number = e * e / (1 - Math.pow(e, 2));
        let M: number = 0;

        const N: number = a / Math.sqrt(1 - Math.pow(e * Math.sin(phi), 2));
        const T: number = Math.pow(Math.tan(phi), 2);
        const C: number = e0sq * Math.pow(Math.cos(phi), 2);
        const A: number = (lon - zcm) * drad * Math.cos(phi);

        // calculate M
        M = phi * (1 - esq * (1.0 / 4.0 + esq * (3.0 / 64.0 + 5.0 * esq / 256.0)));
        M = M - Math.sin(2.0 * phi) * (esq * (3.0 / 8.0 + esq * (3.0 / 32.0 + 45.0 * esq / 1024.0)));
        M = M + Math.sin(4.0 * phi) * (esq * esq * (15.0 / 256.0 + esq * 45.0 / 1024.0));
        M = M - Math.sin(6.0 * phi) * (esq * esq * esq * (35.0 / 3072.0));
        M = M * a; // Arc length along standard meridian

        const M0: number = 0;

        // Calculate the UTM values
        let x: number = k0 *
                        N *
                        A *
                        (
                            1 + A * A *
                            ((1 - T + C) / 6 + A * A * (5 - 18 * T + T * T + 72.0 * C - 58 * e0sq) / 120.0)
                        ); // Easting relative to CM
        x = x + 500000; // standard easting

        // Northing
        let y: number = k0 * (
                                M - M0 + N * Math.tan(phi) *
                                (
                                    A * A *
                                    (
                                        1 / 2.0 + A * A *
                                        (
                                            (5 - T + 9 * C + 4 * C * C) /
                                            24.0 + A * A *
                                            (61 - 58 * T + T * T + 600 * C - 330 * e0sq)
                                            / 720.0
                                        )
                                    )
                                )
                            );
        if (y < 0) {
            y = 10000000 + y;   // add in false northing if south of the equator
        }

        const result: UtmCoordinate = new UtmCoordinate();
        result.easting = x;
        result.northing = y;

        return result;
  }
}
