import { inject } from '@adonisjs/core';
import File from '#models/file';
import fs from 'fs';
import Tag from '#models/tag';
import TagService from '#services/tag_service';

@inject()
export default class FileService {
    constructor(private readonly tagService: TagService) {}

    public delete(file: File): void {
        fs.unlink(`public/${file.path}`, (error): void => {
            if (error) {
                console.error(error.message);
            }
        });
    }

    public async getFoundTags(tags: string | string[]): Promise<Tag[]> {
        if (!tags) {
            return [];
        }
        if (typeof tags === 'string') {
            return [await this.tagService.getTag(tags)];
        }
        const foundTags: Tag[] = [];
        for (const name of tags) {
            foundTags.push(await this.tagService.getTag(name));
        }

        return foundTags;
    }
}
