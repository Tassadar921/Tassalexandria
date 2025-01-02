import BaseRepository from '#repositories/base/base_repository';
import { inject } from '@adonisjs/core';
import Tag from '#models/tag';
import UploadedFile from '#models/uploaded_file';
import SerializedTag from '#types/serialized/serialized_tag';

@inject()
export default class TagRepository extends BaseRepository<typeof Tag> {
    constructor() {
        super(Tag);
    }

    public async search(query: string, excludedNames: string[], uploadedFile: UploadedFile | null): Promise<SerializedTag[]> {
        let queryBuilder = Tag.query().select('tags.*');

        if (uploadedFile) {
            queryBuilder = queryBuilder.leftJoin('file_tags', 'tags.id', 'file_tags.tag_id').where('file_tags.uploaded_file_id', uploadedFile.id);
        }

        const tags: Tag[] = await queryBuilder
            .andWhere('tags.name', 'ILIKE', `%${query}%`)
            .andWhereNotIn('tags.name', excludedNames)
            .orderBy('tags.name')
            .limit(25);

        return tags.map((tag: Tag): SerializedTag => {
            return tag.apiSerialize();
        });
    }
}
