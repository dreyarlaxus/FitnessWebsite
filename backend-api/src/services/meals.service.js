const knex = require("../database/knex");
const Paginator = require("./paginator");
function mealRepository() {
  return knex("meals");
}

function readMeal(payload) {
  return {
    meal_name: payload.meal_name,
    meal_type: payload.meal_type,
    recipe: payload.recipe,
    calories: payload.calories,
    making: payload.making,
    meal_description: payload.meal_description,
    meal_vip: payload.meal_vip,
  };
}

async function createMeal(payload) {
  const meal = readMeal(payload);
  const [meal_id] = await mealRepository().insert(meal);
  return { meal_id, ...meal };
}

async function getManyMeals(query) {
  const { meal_name, meal_type, page = 1, limit = 6 } = query;
  const paginator = new Paginator(page, limit);
  let results = await mealRepository()
    .where((builder) => {
      if (meal_name) {
        builder.where("meal_name", "like", `%${meal_name}%`);
      }
      if (meal_type) {
        builder.where("meal_type", "like", `%${meal_type}%`);
      }
    })
    .where("meal_vip", "0")
    .select(
      knex.raw("count(meal_id) OVER() AS recordCount"),
      "meal_id",
      "meal_name",
      "meal_type",
      "recipe",
      "calories",
      "making",
      "meal_description",
      "meal_vip"
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });
  return {
    metadata: paginator.getMetadata(totalRecords),
    meals: results,
  };
}

async function getManyMealsVip(query) {
  const { meal_name, meal_type, page = 1, limit = 6 } = query;
  const paginator = new Paginator(page, limit);
  let results = await mealRepository()
    .where((builder) => {
      if (meal_name) {
        builder.where("meal_name", "like", `%${meal_name}%`);
      }
      if (meal_type) {
        builder.where("meal_type", "like", `%${meal_type}%`);
      }
    })
    .select(
      knex.raw("count(meal_id) OVER() AS recordCount"),
      "meal_id",
      "meal_name",
      "meal_type",
      "recipe",
      "calories",
      "making",
      "meal_description",
      "meal_vip"
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });
  return {
    metadata: paginator.getMetadata(totalRecords),
    meals: results,
  };
}

async function getMealById(meal_id) {
  return mealRepository().where("meal_id", meal_id).select("*").first();
}

async function updateMeal(meal_id, payload) {
  const updatedMeal = await mealRepository()
    .where("meal_id", meal_id)
    .select("*")
    .first();
  if (!updatedMeal) {
    return null;
  }

  const update = readMeal(payload);
  await mealRepository().where("meal_id", meal_id).update(update);
  return { ...updatedMeal, ...update };
}

async function deleteMeal(meal_id) {
  const deletedMeal = await mealRepository().where("meal_id", meal_id).first();

  if (!deletedMeal) {
    return null;
  }

  await mealRepository().where("meal_id", meal_id).del();

  return deletedMeal;
}

module.exports = {
  createMeal,
  getManyMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getManyMealsVip,
};
