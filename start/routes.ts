import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const AuthController = () => import('#controllers/auth_controller');
const ProfileController = () => import('#controllers/profile_controller');

// API requests
router
    .group((): void => {
        router.post('/login', [AuthController, 'login']);
        router
            .group((): void => {
                router.post('/send-mail', [ProfileController, 'sendResetPasswordEmail']);
                router.post('/confirm/:token', [ProfileController, 'resetPassword']);
            })
            .prefix('reset-password');

        router
            .group((): void => {
                router.post('/send-mail', [AuthController, 'sendAccountCreationEmail']);
                router.get('/confirm/:token', [AuthController, 'confirmAccountCreation']);
            })
            .prefix('account-creation');

        router.get('/logout', [AuthController, 'logout']);



        router
            .group((): void => {
                router.get('/', (): { sessionTokenIsValid: boolean } => {
                    return { sessionTokenIsValid: true };
                });

                router
                    .group((): void => {
                        router.get('/', [ProfileController, 'getProfile']);
                        router.post('/update', [ProfileController, 'updateProfile']);
                    })
                    .prefix('profile');
            })
            .prefix('auth')
            .use([middleware.auth({ guards: ['api'] })]);
    })
    .prefix('api')
    .use([middleware.language()]);
