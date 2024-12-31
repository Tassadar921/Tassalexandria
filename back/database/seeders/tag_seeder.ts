import { BaseSeeder } from '@adonisjs/lucid/seeders';
import env from '#start/env';
import User from '#models/user';
import UserRepository from '#repositories/user_repository';
import UserRoleEnum from "#types/enum/user_role_enum";
import TagRepository from "#repositories/tag_repository";
import Tag from "#models/tag";

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const tagRepository: TagRepository = new TagRepository();
        const tags: string[] = [
            "Singe",
            "Paul",
            "Gabriel",
            "Gringalet",
            "Cuck",
            "Léo",
            "Martin",
            "Adrien",
            "Hugo",
            "César",
            "Siméon",
            "Florent",
            "Evan",
            "Vacances",
            "Collège",
            "Lycée",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
            "2025",
        ];

        for (const name of tags) {
            if (!(await tagRepository.findOneBy({ name }))) {
                await Tag.create({
                    name
                });
                console.log(`Tag ${name} created`);
            }
        }
    }
}
