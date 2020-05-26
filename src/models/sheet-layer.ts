import SheetEntry from './sheet-entry';

export default class SheetLayer {
    public sheet: SheetEntry = new SheetEntry();
    public layerGroup!: L.LayerGroup;
}
