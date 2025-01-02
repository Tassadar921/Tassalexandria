import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const AuthController = () => import('#controllers/auth_controller');
const ProfileController = () => import('#controllers/profile_controller');
const FileUploadController = () => import('#controllers/file_upload_controller');

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
                router.get('/', (): { sessionTokenIsValid: boolean } => {
                    return { sessionTokenIsValid: true };
                });

                router.get('/logout', [AuthController, 'logout']);

                router.post('/tags', [FileUploadController, 'getTags']);
                router.get('/file/:fileId', [FileUploadController, 'getFile']);
                router.get('/file/:fileId/download', [FileUploadController, 'download']);
                router.post('/file/:fileId/rename', [FileUploadController, 'rename']);
                router.post('/file/:fileId/tags', [FileUploadController, 'updateTags']);
                router.post('/upload', [FileUploadController, 'upload']);

                router
                    .group((): void => {
                        router.get('/', [ProfileController, 'getProfile']);
                        router.post('/update', [ProfileController, 'updateProfile']);
                    })
                    .prefix('profile');
            })
            .use([middleware.auth({ guards: ['api'] })]);
    })
    .prefix('api')
    .use([middleware.language()]);
