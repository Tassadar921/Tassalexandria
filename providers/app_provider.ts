import type { ApplicationService } from '@adonisjs/core/types'

export interface HttpContext {
    language: Language
}

export default class AppProvider {
    constructor(protected app: ApplicationService) {}

    /**
     * Register bindings to the container
     */
    register() {}

    /**
     * The container bindings have booted
     */
    async boot() {}

    /**
     * The application has been booted
     */
    async start() {}

    /**
     * The process has been started
     */
    async ready() {}

    /**
     * Preparing to shutdown the app
     */
    async shutdown() {}
}
