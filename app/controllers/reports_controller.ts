import type { HttpContext } from '@adonisjs/core/http';
import { responseUtil } from '../../helper/response_util.js';
import Report from '#models/report';
import { DateTime } from 'luxon';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import db from '@adonisjs/lucid/services/db'

export default class ReportsController {
  public async index({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = request.qs();

      const query = Report.query();

      if (search) {
        query.where((builder) => {
          builder.where('name', 'like', `%${search}%`)
                 .orWhere('type', 'like', `%${search}%`)
                 .orWhere('location', 'like', `%${search}%`);
        });
      }

      if (status) {
        query.where('status', status);
      }

      const reports = await query.paginate(page, limit);

      return responseUtil.success(response, reports, 'Reports retrieved successfully');
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Failed to retrieve reports',
        error: error.message,
      });
    }
  }

  public async store({ request, response }: HttpContext) {
    const schema = vine.object({
      name: vine.string().trim(),
      type: vine.string().trim(),
      date: vine.string().trim(),
      phone: vine.string().trim(),
      lat: vine.string().trim(),
      long: vine.string().trim(),
      location: vine.string().trim(),
      description: vine.string().trim(),
    });

    const messages = new SimpleMessagesProvider({
      'required': 'The {{ field }} field is required.',
    });

    try {
      const data = await vine.compile(schema).validate(request.all(), { messagesProvider: messages });

      const report = await Report.create({
        name: data.name,
        type: data.type,
        date: DateTime.fromISO(data.date),
        phone: data.phone,
        lat: data.lat,
        long: data.long,
        status: 'terlapor',
        location: data.location,
        description: data.description,
      });

      return responseUtil.created(response, report, 'Report created successfully');
    } catch (error) {
      console.error(error);
      return response.badRequest(error.messages || 'Failed to create report');
    }
  }

  public async updateStatus({ params, request, response }: HttpContext) {
    const schema = vine.object({
      status: vine.string().trim(),
    });

    const messages = new SimpleMessagesProvider({
      'required': 'The {{ field }} field is required.',
    });

    try {
      const data = await vine.compile(schema).validate(request.only(['status']), { messagesProvider: messages });

      const report = await Report.find(params.id);
      if (!report) {
        return responseUtil.notFound(response, 'Report not found');
      }

      report.status = data.status;
      await report.save();

      return responseUtil.success(response, report, 'Report status updated successfully');
    } catch (error) {
      console.error(error);
      return response.badRequest(error.messages || 'Failed to update report status');
    }
  }

  public async getStats({ response }: HttpContext) {
    try {
        const statuses = ['terlapor', 'tertangani', 'dalam penanganan', 'belum tertangani'];

        // Fetch counts for each status
        const statusCountsPromises = statuses.map(async (status) => {
            const count = await db.from('reports').where('status', status).count('* as total');
            return { status, count: count[0].total };
        });
        const statusCounts = await Promise.all(statusCountsPromises);

        // Fetch yearly and monthly statistics
        const yearlyMonthlyStats = await db
            .from('reports')
            .select(db.raw('EXTRACT(YEAR FROM date) as year'), db.raw('EXTRACT(MONTH FROM date) as month'))
            .count('* as count')
            .groupByRaw('EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)')
            .orderByRaw('EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)');

        // Organize the results by year and month
        const organizedStats = yearlyMonthlyStats.reduce((acc, { year, month, count }) => {
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push({ month, count });
            return acc;
        }, {});

        // Success response
        return response.status(200).json({
            status: 'success',
            data: { statusCounts, organizedStats },
            message: 'Statistics retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            status: 'error',
            message: 'Failed to retrieve statistics',
            error: error.message,
        });
    }
}

}
