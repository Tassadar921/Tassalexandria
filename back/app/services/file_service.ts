import { inject } from '@adonisjs/core';
import File from '#models/file';
import fs from 'fs';
import Tag from "#models/tag";
import TagRepository from "#repositories/tag_repository";

@inject()
export default class FileService {
    constructor(
        private readonly tagRepository: TagRepository,
    ) {
    }

    public delete(file: File): void {
        fs.unlink(`public/${file.path}`, (error): void => {
            if (error) {
                console.error(error.message);
            }
        });
    }

    public async getFoundTags(tags: string[]): Promise<Tag[]> {
        const foundTags: Tag[] = [];
        for (const name of tags) {
            const red: number = Math.floor(Math.random() * 255);
            const green: number = Math.floor(Math.random() * 255);
            const blue: number = Math.floor(Math.random() * 255);

            const tag: Tag = await this.tagRepository.firstOrCreate({ name }, { name, red, green, blue });
            await tag.refresh();

            foundTags.push(tag);
        }

        return foundTags;
    }
}
