import { inject } from '@adonisjs/core';
import UploadedFileRepository from '#repositories/uploaded_file_repository';
import { HttpContext } from '@adonisjs/core/http';
import UploadedFile from '#models/uploaded_file';
import FileTag from '#models/file_tag';
import Tag from '#models/tag';
import FileService from '#services/file_service';
import SerializedTag from '#types/serialized/serialized_tag';
import RegexService from '#services/regex_service';
import TagRepository from '#repositories/tag_repository';
import TagService from '#services/tag_service';
import StringService from '#services/string_service';

@inject()
export default class TagController {
    constructor(
        private readonly fileService: FileService,
        private readonly uploadedFileRepository: UploadedFileRepository,
        private readonly tagRepository: TagRepository,
        private readonly regexService: RegexService,
        private readonly tagService: TagService,
        private readonly stringService: StringService
    ) {}

    public async new({ request, response }: HttpContext): Promise<void> {
        const { name } = request.only(['name']);
        if (!name) {
            return response.badRequest({ error: 'Tag name is required' });
        } else if (!this.regexService.isValidTagName(name)) {
            return response.badRequest({ error: 'Tag name is not valid' });
        }

        const tag: Tag = await this.tagService.getTag(this.stringService.capitalizeFirstChar(name));

        return response.send({ tag: tag.apiSerialize() });
    }

    public async getTags({ request, response }: HttpContext): Promise<void> {
        const fileId = request.qs().fileId;
        const file: UploadedFile | null = fileId ? await this.uploadedFileRepository.findOneBy({ frontId: fileId }) : null;
        const { excludedNames } = request.only(['excludedNames']);

        return response.send({
            tags: await this.tagRepository.search(request.qs().query || '', excludedNames ?? [], file),
        });
    }

    public async updateTags({ request, response }: HttpContext): Promise<void> {
        const { fileId } = request.params();

        const uploadedFile: UploadedFile | null = await this.uploadedFileRepository.findOneForDetails(fileId);
        if (!uploadedFile) {
            return response.notFound({ error: 'File not found' });
        }

        const { tags } = request.only(['tags']);

        await Promise.all(
            uploadedFile.fileTags.map(async (fileTag: FileTag): Promise<void> => {
                await fileTag.delete();
            })
        );

        if (tags && Array.isArray(tags)) {
            const foundTags: Tag[] = await this.fileService.getFoundTags(tags);
            for (const tag of foundTags) {
                await FileTag.create({
                    tagId: tag.id,
                    uploadedFileId: uploadedFile.id,
                });
            }
        }

        return response.send({ message: 'Tags updated' });
    }

    public async getTagsDetails({ request, response }: HttpContext): Promise<void> {
        const { tags } = request.only(['tags']);

        if (tags && Array.isArray(tags)) {
            const foundTags: Tag[] = await this.fileService.getFoundTags(tags);
            return response.send({ tags: foundTags.map((tag: Tag): SerializedTag => tag.apiSerialize()) });
        }
        return response.send({ tags: [] });
    }
}
