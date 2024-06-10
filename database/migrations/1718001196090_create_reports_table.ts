import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable();
      table.string('type').notNullable();
      table.dateTime('date').notNullable();
      table.string('phone').notNullable();
      table.string('lat').notNullable();
      table.string('long').notNullable();
      table.string('status').notNullable();
      table.text('location').notNullable();
      table.text('description').notNullable();
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}