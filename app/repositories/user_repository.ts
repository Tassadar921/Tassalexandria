import BaseRepository from '#repositories/Base/base_repository';
import User from '#models/user';
import { inject } from '@adonisjs/core';

@inject()
export default class UserRepository extends BaseRepository<typeof User> {
    constructor() {
        super(User);
    }
}
