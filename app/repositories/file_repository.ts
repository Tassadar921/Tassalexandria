import BaseRepository from '#repositories/Base/base_repository';
import File from '#models/file';
import { inject } from '@adonisjs/core';

@inject()
export default class FileRepository extends BaseRepository<typeof File> {
    constructor() {
        super(File);
    }
}
