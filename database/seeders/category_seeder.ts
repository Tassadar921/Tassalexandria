import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Category from '#models/category';
import CategoryRepository from '#repositories/category_repository';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const categoryRepository: CategoryRepository = new CategoryRepository();
        const categories: string[] = [
            'Creature',
            'Instant',
            'Sorcery',
            'Enchantment',
            'Artifact',
            'Planeswalker',
            'Land',
            'Default',
            'Commander',
            'Visual representation',
        ];
        for (const name of categories) {
            if (!(await categoryRepository.findOneBy({ name }))) {
                await Category.create({
                    name,
                    autoCreated: true,
                    canBeDeleted: false,
                });
                console.log(`Category ${name} created`);
            }
        }
    }
}
