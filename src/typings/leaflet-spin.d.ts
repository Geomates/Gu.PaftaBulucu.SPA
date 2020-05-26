import "leaflet";

declare module 'leaflet' {
    export interface Map {
        spin(show: boolean, options?: any): any;
    }
}