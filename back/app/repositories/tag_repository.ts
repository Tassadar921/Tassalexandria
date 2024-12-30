import BaseRepository from '#repositories/base/base_repository';
import { inject } from '@adonisjs/core';
import Tag from "#models/tag";

@inject()
export default class TagRepository extends BaseRepository<typeof Tag> {
    constructor() {
        super(Tag);
    }
}
