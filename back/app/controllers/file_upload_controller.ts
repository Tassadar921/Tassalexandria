import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import Tag from '#models/tag';
import UploadedFile from '#models/uploaded_file';
import { cuid } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import SlugifyService from '#services/slugify_service';
import FileTag from '#models/file_tag';
import FileService from '#services/file_service';
import RegexService from '#services/regex_service';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import { Stats } from 'node:fs';

@inject()
export default class FileUploadController {
    constructor(
        private readonly fileService: FileService,
        private readonly slugifyService: SlugifyService,
        private readonly regexService: RegexService
    ) {}

    public async upload({ request, auth, response }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        const { title, tags } = request.only(['title', 'tags']);

        if (!title) {
            return response.badRequest({ error: 'Title is required' });
        } else if (!this.regexService.isValidFileTitle(title)) {
            return response.badRequest({ error: 'Emojis are forbidden into file title' });
        }

        const foundTags: Tag[] = await this.fileService.getFoundTags(tags);

        const inputFile = request.file('file', {
            size: '100mb',
            extnames: ['jpg', 'png', 'gif', 'jpeg', 'webp', 'mp3', 'mp4', 'mov', 'txt', 'docx', 'xls', 'xlsx', 'pdf'],
        });

        if (!inputFile) {
            return response.badRequest({ message: 'File is required' });
        } else if (!inputFile.isValid) {
            return response.badRequest({ message: 'File is not valid' });
        } else if (!inputFile.tmpPath) {
            return response.badRequest({ error: "File can't be retrieved: try again" });
        }

        console.log(inputFile.headers);

        inputFile.clientName = `${cuid()}-${this.slugifyService.slugify(inputFile.clientName)}`;
        const path = `static/upload/${user.frontId}`;
        await inputFile.move(app.makePath(path));
        const file: File = await File.create({
            name: inputFile.clientName,
            path: `${path}/${inputFile.clientName}`,
            extension: inputFile.extname,
            mimeType: `${inputFile.type}/${inputFile.subtype}`,
            size: inputFile.size,
        });
        await file.refresh();

        const uploadedFile: UploadedFile = await UploadedFile.create({
            title,
            userId: user.id,
            fileId: file.id,
        });
        await uploadedFile.refresh();

        if (file.mimeType.startsWith('video')) {
            const thumbnailName: string = `${file.name.split('.')[0]}-thumbnail.png`;
            await new Promise((resolve, reject): void => {
                ffmpeg(app.makePath(file.path))
                    .on('end', resolve)
                    .on('error', reject)
                    .output(`${app.makePath(path)}/${thumbnailName}`)
                    .videoFilters('crop=iw:iw*9/16')
                    .setStartTime(0)
                    .frames(1)
                    .run();
            });

            const thumbnailStats: Stats = await fs.stat(app.makePath(`${path}/${thumbnailName}`));
            const thumbnail: File = await File.create({
                name: thumbnailName,
                path: `${path}/${thumbnailName}`,
                extension: 'png',
                mimeType: 'image/png',
                size: thumbnailStats.size,
            });
            await thumbnail.refresh();

            uploadedFile.thumbnailId = thumbnail.id;
            await uploadedFile.save();
        } else if (!file.mimeType.startsWith('image')) {
            const thumbnailFile = request.file('thumbnail', {
                size: '5mb',
                extnames: ['jpg', 'png', 'gif', 'jpeg', 'webp'],
            });

            if (thumbnailFile && thumbnailFile.isValid) {
                const thumbnailName: string = `${file.name.split('.')[0]}-thumbnail.png`;
                thumbnailFile.clientName = thumbnailName;
                await thumbnailFile.move(app.makePath(path));
                const thumbnail: File = await File.create({
                    name: thumbnailName,
                    path: `${path}/${thumbnailName}`,
                    extension: thumbnailFile.extname,
                    mimeType: `${thumbnailFile.type}/${thumbnailFile.subtype}`,
                    size: thumbnailFile.size,
                });
                await thumbnail.refresh();

                uploadedFile.thumbnailId = thumbnail.id;
                await uploadedFile.save();
            }
        }

        for (const tag of foundTags) {
            await FileTag.create({
                tagId: tag.id,
                uploadedFileId: uploadedFile.id,
            });
        }

        return response.send({ fileId: uploadedFile.frontId });
    }
}
