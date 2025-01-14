import BaseRepository from '#repositories/base/base_repository';
import UploadedFile from '#models/uploaded_file';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedUploadedFile from '#types/paginated/paginated_uploaded_file';
import SerializedUploadedFile from '#types/serialized/serialized_uploaded_file';

export default class UploadedFileRepository extends BaseRepository<typeof UploadedFile> {
    constructor() {
        super(UploadedFile);
    }

    public async findOneForDetails(frontId: string): Promise<UploadedFile | null> {
        return await UploadedFile.query()
            .where('frontId', frontId)
            .preload('owner', (ownerQuery): void => {
                ownerQuery.preload('profilePicture');
            })
            .preload('file')
            .preload('fileTags', (fileTagsQuery): void => {
                fileTagsQuery.preload('tag');
            })
            .first();
    }

    public async search(query: string, tags: string[], page: number, perPage: number): Promise<PaginatedUploadedFile> {
        const uploadedFiles: ModelPaginatorContract<UploadedFile> = await UploadedFile.query()
            .select('uploaded_files.*')
            .leftJoin('file_tags', 'uploaded_files.id', 'file_tags.uploaded_file_id')
            .leftJoin('tags', 'tags.id', 'file_tags.tag_id')
            .leftJoin('users', 'users.id', 'uploaded_files.user_id')
            .where((queryBuilder): void => {
                queryBuilder
                    .where('uploaded_files.title', 'ILIKE', `%${query}%`)
                    .orWhere('users.email', 'ILIKE', `%${query}%`)
                    .orWhere('users.username', 'ILIKE', `%${query}%`);
            })
            .if(tags.length > 0, (queryBuilder): void => {
                queryBuilder.andWhereRaw(
                    `
            (
                SELECT COUNT(DISTINCT tags.name)
                FROM file_tags
                INNER JOIN tags ON tags.id = file_tags.tag_id
                WHERE file_tags.uploaded_file_id = uploaded_files.id
                AND tags.name IN (${tags.map((): string => '?').join(', ')})
            ) = ?
        `,
                    [...tags, tags.length]
                );
            })
            .preload('owner')
            .preload('file')
            .preload('fileTags', (fileTagsQuery): void => {
                fileTagsQuery.preload('tag');
            })
            .distinct('uploaded_files.id')
            .orderBy('uploaded_files.title')
            .paginate(page, perPage);

        return {
            uploadedFiles: await Promise.all(
                uploadedFiles.all().map((uploadedFile: UploadedFile): SerializedUploadedFile => {
                    return uploadedFile.apiSerialize();
                })
            ),
            firstPage: uploadedFiles.firstPage,
            lastPage: uploadedFiles.lastPage,
            perPage,
            total: uploadedFiles.total,
            currentPage: page,
        };
    }
}
