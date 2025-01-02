import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import TagRepository from '#repositories/tag_repository';
import Tag from '#models/tag';
import UploadedFileRepository from "#repositories/uploaded_file_repository";
import UploadedFile from "#models/uploaded_file";
import {cuid} from "@adonisjs/core/helpers";
import app from "@adonisjs/core/services/app";
import File from "#models/file";
import SlugifyService from "#services/slugify_service";
import FileTag from "#models/file_tag";

@inject()
export default class FileUploadController {
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly uploadedFileRepository: UploadedFileRepository,
        private readonly slugifyService: SlugifyService,
    ) {}
    public async getTags({ request, response }: HttpContext): Promise<void> {
        const fileId = request.qs().fileId;
        const file: UploadedFile | null = fileId ? await this.uploadedFileRepository.findOneBy({ frontId: fileId }) : null;
        const { excludedNames } = request.only(['excludedNames']);

        return response.send({
            tags: await this.tagRepository.search(request.qs().query || '', excludedNames ?? [],  file),
        });
    }

    public async upload({ request, auth, response }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        const { tags } = request.only(['tags']);

        const foundTags: Tag[] = [];
        for (const name of tags) {
            const tag: Tag = await this.tagRepository.firstOrCreate({ name }, { name });
            await tag.refresh();

            foundTags.push(tag);
        }

        const inputFile = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'gif'],
        });

        if (inputFile && inputFile.isValid && inputFile.tmpPath) {
            inputFile.clientName = `${cuid()}-${this.slugifyService.slugify(inputFile.clientName)}`;
            const path = `upload/${user.email}`;
            await inputFile.move(app.publicPath(path));
            const file: File = await File.create({
                name: inputFile.clientName,
                path: `${path}/${inputFile.clientName}`,
                extension: inputFile.extname,
                mimeType: `${inputFile.type}/${inputFile.subtype}`,
                size: inputFile.size,
            });
            await file.refresh();

            const uploadedFile: UploadedFile = await UploadedFile.create({
                userId: user.id,
                fileId: file.id,
            });
            await uploadedFile.refresh();

            for (const tag of foundTags) {
                await FileTag.create({
                    tagId: tag.id,
                    uploadedFileId: uploadedFile.id,
                });
            }

            return response.send({ fileId: uploadedFile.frontId });
        }
    }
}
