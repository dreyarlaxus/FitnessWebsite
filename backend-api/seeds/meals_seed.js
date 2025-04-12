const { faker } = require("@faker-js/faker");

function createMeal() {
  return {
    meal_name: faker.commerce.productName(),
    meal_type: faker.helpers.arrayElement([
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snack",
    ]),
    recipe: faker.lorem.words(5),
    calories: faker.number.int({ min: 100, max: 1000 }),
    making: faker.lorem.paragraphs(2),
    meal_description: faker.lorem.paragraphs(3),
    meal_vip: faker.number.int({ min: 0, max: 1 }),
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("meals").del();
  await knex("meals").insert(Array(50).fill().map(createMeal));
};
