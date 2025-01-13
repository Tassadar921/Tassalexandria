import { inject } from '@adonisjs/core';
import UploadedFileRepository from '#repositories/uploaded_file_repository';
import { HttpContext } from '@adonisjs/core/http';
import UploadedFile from '#models/uploaded_file';
import app from '@adonisjs/core/services/app';
import RegexService from '#services/regex_service';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';

@inject()
export default class FileController {
    constructor(
        private readonly uploadedFileRepository: UploadedFileRepository,
        private readonly userRepository: UserRepository,
        private readonly regexService: RegexService
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
        } else if (!this.regexService.isValidFileTitle(title)) {
            return response.badRequest({ error: 'Emojis are forbidden into file title' });
        }

        uploadedFile.title = title;
        await uploadedFile.save();

        return response.send({ message: 'File renamed' });
    }

    public async serveStaticUploadedFile({ request, response }: HttpContext): Promise<void> {
        const { fileId } = request.params();

        const uploadedFile: UploadedFile | null = await this.uploadedFileRepository.findOneBy({ frontId: fileId }, ['file']);
        if (!uploadedFile) {
            return response.notFound({ error: 'File not found' });
        }

        return response.download(app.makePath(uploadedFile.file.path));
    }

    public async serveStaticProfilePictureFile({ request, response }: HttpContext): Promise<void> {
        const { userId } = request.params();

        const user: User | null = await this.userRepository.findOneBy({ frontId: userId });
        if (!user) {
            return response.notFound({ error: 'User not found' });
        }

        await user.load('profilePicture');
        if (!user.profilePicture) {
            return response.notFound({ error: "User's profile picture not found" });
        }

        return response.download(app.makePath(user.profilePicture.path));
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
