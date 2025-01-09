import { inject } from '@adonisjs/core';
import Tag from '#models/tag';
import TagRepository from '#repositories/tag_repository';

@inject()
export default class TagService {
    constructor(private readonly tagRepository: TagRepository) {}

    public async getTag(name: string): Promise<Tag> {
        const tag: Tag = await this.tagRepository.firstOrCreate(
            { name },
            {
                name,
                red: Math.floor(Math.random() * 255),
                green: Math.floor(Math.random() * 255),
                blue: Math.floor(Math.random() * 255),
            }
        );
        await tag.refresh();

        return tag;
    }
}
