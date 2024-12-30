import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { Authenticators } from '@adonisjs/auth/types';

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
    /**
     * The URL to redirect to, when authentication fails
     */
    redirectTo: string = '/login';

    async handle(
        ctx: HttpContext,
        next: NextFn,
        options: {
            guards?: (keyof Authenticators)[];
        } = {}
    ): Promise<any> {
        await ctx.auth.authenticateUsing(options.guards);
        return next();
    }
}