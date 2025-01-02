import BaseRepository from '#repositories/base/base_repository';
import { inject } from '@adonisjs/core';
import UploadedFile from '#models/uploaded_file';

@inject()
export default class UploadedFileRepository extends BaseRepository<typeof UploadedFile> {
    constructor() {
        super(UploadedFile);
    }

    public async findOneForDetails(frontId: string): Promise<UploadedFile | null> {
        return await UploadedFile.query()
            .where('frontId', frontId)
            .preload('owner')
            .preload('file')
            .preload('fileTags', (fileTagsQuery): void => {
                fileTagsQuery.preload('tag');
            })
            .first();
    }
}
