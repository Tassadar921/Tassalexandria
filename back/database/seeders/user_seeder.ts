import { BaseSeeder } from '@adonisjs/lucid/seeders';
import env from '#start/env';
import User from '#models/user';
import RoleEnum from '#types/enum/role_enum';
import UserRepository from '#repositories/user_repository';
import FrontClientRepository from '#repositories/front_client_repository';
import FrontClient from '#models/front_client';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const userRepository: UserRepository = new UserRepository();
        const frontClientRepository: FrontClientRepository = new FrontClientRepository();
        const frontClient: FrontClient | null = await frontClientRepository.findOneBy({ name: 'Tassadraft' });
        if (!frontClient) {
            console.error('Front client Tassadraft not found');
            return;
        }

        const emails: string[] = JSON.parse(env.get('FRIEND_EMAILS'));
        for (const email of emails) {
            if (!(await userRepository.findOneBy({ email }))) {
                await User.create({
                    username: email.split('@')[0],
                    email,
                    password: 'xxx',
                    role: email === 'paul.lecuisinier@gmail.com' ? RoleEnum.ADMIN : RoleEnum.FRIEND,
                    enabled: true,
                    frontClientId: frontClient.id,
                });
                console.log(`User ${email} created`);
            }
        }
    }
}
