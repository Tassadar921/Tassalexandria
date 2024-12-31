import BaseRepository from '#repositories/base/base_repository';
import { inject } from '@adonisjs/core';
import UploadedFile from '#models/uploaded_file';

@inject()
export default class UploadedFileRepository extends BaseRepository<typeof UploadedFile> {
    constructor() {
        super(UploadedFile);
    }
}
