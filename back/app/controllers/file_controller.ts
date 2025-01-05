import { inject } from '@adonisjs/core';
import UploadedFileRepository from '#repositories/uploaded_file_repository';
import { HttpContext } from '@adonisjs/core/http';
import UploadedFile from '#models/uploaded_file';
import app from '@adonisjs/core/services/app';
import FileTag from '#models/file_tag';
import Tag from '#models/tag';
import FileService from '#services/file_service';
import SerializedTag from '#types/serialized/serialized_tag';

@inject()
export default class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly uploadedFileRepository: UploadedFileRepository
    ) {}

    public async get({ request, response }: HttpContext): Promise<void> {
        const { fileId } = request.params();

        const uploadedFile: UploadedFile | null = await this.uploadedFileRepository.findOneForDetails(fileId);
        if (!uploadedFile) {
            return response.notFound({ error: 'File not found' });
        }

        return response.send({ file: uploadedFile.apiSerialize() });
    }

    public async rename({ request, response }: HttpContext): Promise<void> {
        const { fileId } = request.params();

        const uploadedFile: UploadedFile | null = await this.uploadedFileRepository.findOneForDetails(fileId);
        if (!uploadedFile) {
            return response.notFound({ error: 'File not found' });
        }

        const { title } = request.only(['title']);
        if (!title) {
            return response.badRequest({ error: 'Title is required' });
        }

        uploadedFile.title = title;
        await uploadedFile.save();

        return response.send({ message: 'File renamed' });
    }

    public async serveStaticFile({ request, response }: HttpContext): Promise<void> {
        const { fileId } = request.params();

        const uploadedFile: UploadedFile | null = await this.uploadedFileRepository.findOneBy({ frontId: fileId }, ['file']);
        if (!uploadedFile) {
            return response.notFound({ error: 'File not found' });
        }

        response.header('Access-Control-Allow-Origin', '*'); // Replace '*' with your frontend URL if needed
        response.header('Content-Type', 'application/octet-stream'); // Modify as per the file type
        response.header('Content-Disposition', `attachment; filename="${uploadedFile.title}"`);
        response.header('Content-Type', uploadedFile.file.mimeType);

        return response.download(app.makePath(uploadedFile.file.path));
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

    public async search({ request, response }: HttpContext): Promise<void> {
        const tags = request.qs().tags;
        const splitTags = tags?.split(',');
        if (tags && Array.isArray(splitTags) && splitTags.length) {
            return response.send({
                uploadedFiles: await this.uploadedFileRepository.search(
                    request.qs().query ?? '',
                    splitTags,
                    request.qs().page ?? 1,
                    request.qs().perPage ?? 24
                ),
            });
        }
        return response.send({
            uploadedFiles: await this.uploadedFileRepository.search(request.qs().query ?? '', [], request.qs().page ?? 1, request.qs().perPage ?? 24),
        });
    }
}
