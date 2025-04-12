const { faker } = require("@faker-js/faker");

function createWorkout() {
  return {
    workout_name: faker.commerce.productName(),
    workout_type: faker.helpers.arrayElement([
      "Cardio",
      "Strength",
      "Flexibility",
      "Balance",
    ]),
    difficulty: faker.number.int({ min: 0, max: 5 }),
    equipment: faker.helpers.arrayElement([
      "Dumbbells",
      "Resistance Bands",
      "Treadmill",
      "None",
    ]),
    burn_estimate: faker.number.int({ min: 100, max: 1000 }),
    workout_vip: faker.number.int({ min: 0, max: 1 }),
    tutorial_video: "/public/images/tutorial_video.mp4",
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("workouts").del();
  await knex("workouts").insert(Array(50).fill().map(createWorkout));
};
