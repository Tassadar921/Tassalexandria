import BaseRepository from '#repositories/base/base_repository';
import { inject } from '@adonisjs/core';
import Tag from '#models/tag';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import UploadedFile from '#models/uploaded_file';
import PaginatedTags from '#types/paginated/paginated_tags';
import SerializedTag from '#types/serialized/serialized_tag';

@inject()
export default class TagRepository extends BaseRepository<typeof Tag> {
    constructor() {
        super(Tag);
    }

    public async search(query: string, page: number, perPage: number, uploadedFile: UploadedFile): Promise<PaginatedTags> {
        const tags: ModelPaginatorContract<Tag> = await Tag.query()
            .select('tags.*')
            .leftJoin('file_tags', 'tags.id', 'file_tags.tag_id')
            .where('file_tags.uploaded_file_id', uploadedFile.id)
            .andWhere('tags.name', 'ILIKE', `%${query}%`)
            .orderBy('tags.name')
            .paginate(page, perPage);

        return {
            tags: await Promise.all(
                tags.all().map((tag: Tag): SerializedTag => {
                    return tag.apiSerialize();
                })
            ),
            ...tags,
        };
    }
}
