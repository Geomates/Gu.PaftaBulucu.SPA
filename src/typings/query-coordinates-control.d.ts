import 'leaflet';

declare module 'leaflet' {
    export namespace Control {
        export function queryCoordinatesTool(options?: any): any;
    }
}