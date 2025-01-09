import BaseRepository from '#repositories/base/base_repository';
import FileTag from '#models/file_tag';

export default class FileTagRepository extends BaseRepository<typeof FileTag> {
    constructor() {
        super(FileTag);
    }
}
