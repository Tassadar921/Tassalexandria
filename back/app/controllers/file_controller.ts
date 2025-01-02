import { inject } from '@adonisjs/core';
import UploadedFileRepository from '#repositories/uploaded_file_repository';
import { HttpContext } from '@adonisjs/core/http';
import UploadedFile from '#models/uploaded_file';
import app from '@adonisjs/core/services/app';
import FileTag from '#models/file_tag';
import Tag from '#models/tag';
import FileService from '#services/file_service';

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

    public async download({ request, response }: HttpContext): Promise<void> {
        const { fileId } = request.params();

        const uploadedFile: UploadedFile | null = await this.uploadedFileRepository.findOneForDetails(fileId);
        if (!uploadedFile) {
            return response.notFound({ error: 'File not found' });
        }

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
}
