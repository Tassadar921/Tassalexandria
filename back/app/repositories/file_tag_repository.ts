import BaseRepository from '#repositories/base/base_repository';
import { inject } from '@adonisjs/core';
import FileTag from '#models/file_tag';

@inject()
export default class FileTagRepository extends BaseRepository<typeof FileTag> {
    constructor() {
        super(FileTag);
    }
}
