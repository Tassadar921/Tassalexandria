import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import TagRepository from '#repositories/tag_repository';
import Tag from '#models/tag';
import SerializedTag from '#types/serialized/serialized_tag';

@inject()
export default class FileUploadController {
    constructor(private readonly tagRepository: TagRepository) {}
    public async getTags({ response }: HttpContext): Promise<void> {
        // TODO : optimize this with infinite scroll
        const tags: Tag[] = await this.tagRepository.all();
        return response.send({
            tags: tags.map((tag: Tag): SerializedTag => tag.apiSerialize()),
        });
    }

    public async upload({ request, auth, response }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        const { tags } = request.only(['tags']);
        console.log(tags);
    }
}
