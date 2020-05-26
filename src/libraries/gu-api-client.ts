import { createClient } from '@/libraries/rest-client';
import * as config from '../../config.json';
import AuthProvider from '@/libraries/auth-provider';
import Project from '@/models/project';

export default class GuApiRestClient {
    private auth: AuthProvider;

    constructor() {
        this.auth = new AuthProvider();
    }

    public async getProjects(): Promise<any> {
        return createClient(await this.token()).get(`${config.api_base_url}/projects/`);
    }

    public async updateProject(project: Project): Promise<any> {
        return createClient(await this.token())
                    .put(`${config.api_base_url}/projects`, project);
    }

    public async addProject(project: Project): Promise<any> {
        return createClient(await this.token())
                    .post(`${config.api_base_url}/projects`, project);
    }

    public async deleteProject(projectId: number): Promise<any> {
        return createClient(await this.token())
                    .delete(`${config.api_base_url}/projects/${projectId}`);
    }

    public async findSheetByName(name: string, scale: number): Promise<any> {
        return createClient(await this.token())
                    .get(`${config.api_base_url}/sheets/${scale}/${name.trim()}`);
    }

    public async findSheetByCoordinate(latitude: number, longitude: number, scale: number): Promise<any> {
        return createClient(await this.token())
                    .get(`${config.api_base_url}/sheets/${scale}/${latitude}/${longitude}`);
    }

    private async token(): Promise<string> {
        const token = await this.auth.getToken();
        return token;
    }
}
