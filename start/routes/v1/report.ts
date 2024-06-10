const ReportsController = () => import('#controllers/reports_controller')
import router from '@adonisjs/core/services/router'

export default function reportsRoutes(){
    router.group(() => {
        router.get('/', [ReportsController, 'index'])
        router.get('/stats', [ReportsController, 'getStats'])
        router.post('/', [ReportsController,'store'])
        router.patch('/:id', [ReportsController, 'updateStatus'])
    }).prefix('/reports')
}