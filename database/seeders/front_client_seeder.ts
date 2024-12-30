import { BaseSeeder } from '@adonisjs/lucid/seeders';
import FrontClientRepository from '#repositories/front_client_repository';
import FrontClient from '#models/front_client';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const frontClientRepository: FrontClientRepository = new FrontClientRepository();
        const frontClient: FrontClient | null = await frontClientRepository.findOneBy({ name: 'Tassadraft' });
        if (!frontClient) {
            await FrontClient.create({
                name: 'Tassadraft',
                productionUri: 'https://tassadraft.com',
                repositoryUri: 'https://github.com/Tassadraft/Tassadraft-v2',
                enabled: true,
            });
        }
    }
}
