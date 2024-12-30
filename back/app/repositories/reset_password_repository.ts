import BaseRepository from '#repositories/base/base_repository';
import ResetPassword from '#models/reset_password';
import { inject } from '@adonisjs/core';

@inject()
export default class ResetPasswordRepository extends BaseRepository<typeof ResetPassword> {
    constructor() {
        super(ResetPassword);
    }
}
