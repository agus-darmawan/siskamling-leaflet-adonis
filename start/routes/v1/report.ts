const ReportsController = () => import('#controllers/reports_controller')
import router from '@adonisjs/core/services/router'

export default function reportsRoutes(){
    router.group(() => {
        router.get('/', [ReportsController, 'index'])
        router.get('/meta', [ReportsController, 'indexMeta'])
        router.get('/stats', [ReportsController, 'getStats'])
        router.post('/', [ReportsController,'store'])
        router.patch('/:id', [ReportsController, 'updateStatus'])
        router.delete('/:id', [ReportsController, 'destroy'])
    }).prefix('/reports')
}