const { faker } = require("@faker-js/faker");
function createUser() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullname: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.string.numeric("09########"),
    vip: faker.number.int({
      min: 0,
      max: 1,
    }),
  };
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert(Array(50).fill().map(createUser));
};
