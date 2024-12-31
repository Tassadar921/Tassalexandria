import { BaseSeeder } from '@adonisjs/lucid/seeders';
import TagRepository from '#repositories/tag_repository';
import Tag from '#models/tag';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const tagRepository: TagRepository = new TagRepository();
        const tags: { name: string, color: string }[] = [
            { name: 'Singe', color: '#a1b2c3' },
            { name: 'Paul', color: '#d4e5f6' },
            { name: 'Gabriel', color: '#789abc' },
            { name: 'Gringalet', color: '#123456' },
            { name: 'Cuck', color: '#654321' },
            { name: 'Léo', color: '#abcdef' },
            { name: 'Martin', color: '#fedcba' },
            { name: 'Adrien', color: '#1a2b3c' },
            { name: 'Hugo', color: '#4d5e6f' },
            { name: 'César', color: '#7f8e9d' },
            { name: 'Siméon', color: '#0f1e2d' },
            { name: 'Florent', color: '#2d3c4b' },
            { name: 'Evan', color: '#4b5a6c' },
            { name: 'Vacances', color: '#6c7d8e' },
            { name: 'Collège', color: '#8e9fac' },
            { name: 'Lycée', color: '#acbdef' },
            { name: '2012', color: '#123abc' },
            { name: '2013', color: '#456def' },
            { name: '2014', color: '#7890ab' },
            { name: '2015', color: '#0ab1c2' },
            { name: '2016', color: '#3cd4e5' },
            { name: '2017', color: '#6f7a8b' },
            { name: '2018', color: '#9bacdf' },
            { name: '2019', color: '#cdef01' },
            { name: '2020', color: '#012345' },
            { name: '2021', color: '#6789ab' },
            { name: '2022', color: '#bcdef0' },
            { name: '2023', color: '#123456' },
            { name: '2024', color: '#abcdef' },
            { name: '2025', color: '#fedcba' },
        ];

        for (const tag of tags) {
            if (!(await tagRepository.findOneBy({ name: tag.name }))) {
                await Tag.create({
                    name: tag.name,
                    color: tag.color
                });
                console.log(`Tag ${tag.name} created`);
            }
        }
    }
}
