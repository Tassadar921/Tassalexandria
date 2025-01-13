import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const AuthController = () => import('#controllers/auth_controller');
const ProfileController = () => import('#controllers/profile_controller');
const FileUploadController = () => import('#controllers/file_upload_controller');
const FileController = () => import('#controllers/file_controller');
const TagController = () => import('#controllers/tag_controller');

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

                router.post('/upload', [FileUploadController, 'upload']);

                router
                    .group((): void => {
                        router.post('/', [TagController, 'getTags']);
                        router.post('/new', [TagController, 'new']);
                        router.post('/details', [TagController, 'getTagsDetails']);
                    })
                    .prefix('/tags');

                router
                    .group((): void => {
                        router.get('/search', [FileController, 'search']);
                        router
                            .group((): void => {
                                router.get('/', [FileController, 'get']);
                                router.get('/download', [FileController, 'serveStaticUploadedFile']);
                                router.post('/rename', [FileController, 'rename']);
                                router.post('/tags', [TagController, 'updateTags']);
                            })
                            .prefix('/:fileId');
                    })
                    .prefix('/file');

                router
                    .group((): void => {
                        router.get('/', [ProfileController, 'getProfile']);
                        router.post('/update', [ProfileController, 'updateProfile']);
                    })
                    .prefix('profile');
            })
            .use([middleware.auth({ guards: ['api'] })]);

        router.get('/static/upload/:fileId', [FileController, 'serveStaticUploadedFile']).use([middleware.queryStringAuth()]);
        router.get('/static/profile-picture/:userId', [FileController, 'serveStaticProfilePictureFile']).use([middleware.queryStringAuth()]);
    })
    .prefix('api')
    .use([middleware.language()]);
