const JSend = require("../jsend");
const mealsService = require("../services/meals.service");
const ApiError = require("../api-error");

async function createMeal(req, res, next) {
  console.log(req.body);
  if (!req.body?.meal_name || typeof req.body.meal_name !== "string") {
    return next(new ApiError(400, "Meal's name should be a non-empty string"));
  }
  try {
    const meal = await mealsService.createMeal({
      ...req.body,
    });
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${meal.meal_id}`,
      })
      .json(
        JSend.success({
          meal,
        })
      );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating the meal"));
  }
}

async function getMealByFilter(req, res, next) {
  let result = {
    meals: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await mealsService.getManyMeals(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving meals"));
  }
  return res.json(
    JSend.success({
      meals: result.meals,
      metadata: result.metadata,
    })
  );
}

async function getMeal(req, res, next) {
  const { meal_id } = req.params;

  try {
    const meal = await mealsService.getMealById(meal_id);
    if (!meal) {
      return next(new ApiError(404, "Meal not found"));
    }
    return res.json(JSend.success({ meal }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving meal with meal_id= ${meal_id}`)
    );
  }
}

async function updateMeal(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    console.log(req.params, req.body);
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  const { meal_id } = req.params;

  try {
    const updated = await mealsService.updateMeal(meal_id, {
      ...req.body,
    });

    if (!updated) {
      return next(new ApiError(404, "Meal not found"));
    }

    return res.json(
      JSend.success({
        meal: updated,
      })
    );
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating meal with meal_id=${meal_id}`)
    );
  }
}

async function deleteMeal(req, res, next) {
  const { meal_id } = req.params;

  try {
    const deleted = await mealsService.deleteMeal(meal_id);

    if (!deleted) {
      return next(new ApiError(404, "Meal not found"));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Could not delete meal with meal_id=${meal_id}`)
    );
  }
}

module.exports = {
  createMeal,
  getMealByFilter,
  getMeal,
  updateMeal,
  deleteMeal,
};
