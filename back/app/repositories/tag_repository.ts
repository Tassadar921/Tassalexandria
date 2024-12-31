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

    public async search(query: string, page: number, perPage: number, uploadedFile: UploadedFile | null): Promise<PaginatedTags> {
        let queryBuilder = Tag.query().select('tags.*');

        if (uploadedFile) {
            queryBuilder = queryBuilder
                .leftJoin('file_tags', 'tags.id', 'file_tags.tag_id')
                .where('file_tags.uploaded_file_id', uploadedFile.id);
        }

        const tags: ModelPaginatorContract<Tag> = await queryBuilder
            .andWhere('tags.name', 'ILIKE', `%${query}%`)
            .orderBy('tags.name')
            .paginate(page, perPage);

        return {
            tags: await Promise.all(
                tags.all().map((tag: Tag): SerializedTag => {
                    return tag.apiSerialize();
                })
            ),
            firstPage: tags.firstPage,
            lastPage: tags.lastPage,
            perPage: tags.perPage,
            total: tags.total,
            currentPage: tags.currentPage,
        };
    }
}
