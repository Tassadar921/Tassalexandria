import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import TagRepository from '#repositories/tag_repository';
import Tag from '#models/tag';
import SerializedTag from '#types/serialized/serialized_tag';
import UploadedFileRepository from "#repositories/uploaded_file_repository";
import UploadedFile from "#models/uploaded_file";

@inject()
export default class FileUploadController {
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly uploadedFileRepository: UploadedFileRepository,
    ) {}
    public async getTags({ request, response }: HttpContext): Promise<void> {
        const query = request.qs().query;
        if (!query || query.length < 3) {
            return response.badRequest({ error: 'Query is required and must be at least 3 characters long' });
        }

        const fileId = request.qs().fileId;

        const file: UploadedFile | null = fileId ? await this.uploadedFileRepository.findOneBy({ frontId: fileId }) : null;

        console.log(request.qs());

        return response.send({
            tags: await this.tagRepository.search(query, request.qs().page || 1, request.qs().perPage || 24, file),
        });
    }

    public async upload({ request, auth, response }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        const { tags } = request.only(['tags']);
        console.log(tags);
    }
}
