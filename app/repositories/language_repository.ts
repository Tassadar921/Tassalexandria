import BaseRepository from '#repositories/Base/base_repository';
import Language from '#models/language';
import { inject } from '@adonisjs/core';

@inject()
export default class LanguageRepository extends BaseRepository<typeof Language> {
    constructor() {
        super(Language);
    }

    public async getEnglish(): Promise<Language> {
        const english: Language | null = await this.findOneBy({
            code: Language.LANGUAGE_ENGLISH.code,
        });
        if (!english) {
            throw new Error('English language not found');
        }

        return english;
    }
}
