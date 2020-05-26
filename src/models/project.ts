import SheetEntry from './sheet-entry';

export default class Project {
    public projectId?: number;
    public name?: string;
    public email?: string;
    public created?: number;
    public entries: SheetEntry[] = [];
}
