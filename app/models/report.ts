import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Report extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare type: string;

  @column()
  declare date: DateTime;

  @column()
  declare phone: string;

  @column()
  declare lat: string;

  @column()
  declare long: string;

  @column()
  declare status: string;

  @column()
  declare location: string;

  @column()
  declare description: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
