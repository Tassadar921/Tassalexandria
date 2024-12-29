import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

router.get('/', ({ inertia }: HttpContext) => {
    return inertia.render('home', { user: { name: 'julien' } })
})
router.on('/').renderInertia('home')
router.on('/').renderInertia('home')
