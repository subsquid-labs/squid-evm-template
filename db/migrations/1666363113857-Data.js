module.exports = class Data1666363113857 {
  name = 'Data1666363113857'

  async up(db) {
    await db.query(`CREATE TABLE "my_entity" ("id" character varying NOT NULL, "foo" text NOT NULL, CONSTRAINT "PK_975e93eaea0e5d6008e21f7c93b" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "my_entity"`)
  }
}
