const JSend = require("../jsend");
const workoutsService = require("../services/workouts.service");
const ApiError = require("../api-error");

async function createWorkout(req, res, next) {
  console.log(req.file);
  if (!req.body?.workout_name || typeof req.body.workout_name !== "string") {
    return next(
      new ApiError(400, "Workout's name should be a non-empty string")
    );
  }
  try {
    const workout = await workoutsService.createWorkout({
      ...req.body,
      tutorial_video: req.file ? `/public/uploads/${req.file.filename}` : null,
    });
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${workout.workout_id}`,
      })
      .json(
        JSend.success({
          workout,
        })
      );
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating the workout")
    );
  }
}

async function getWorkoutByFilter(req, res, next) {
  let result = {
    workouts: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await workoutsService.getManyWorkouts(req.query);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving workouts")
    );
  }

  return res.json(
    JSend.success({
      workouts: result.workouts,
      metadata: result.metadata,
    })
  );
}

async function getWorkout(req, res, next) {
  const { workout_id } = req.params;

  try {
    const workout = await workoutsService.getWorkoutById(workout_id);
    if (!workout) {
      return next(new ApiError(404, "Workout not found"));
    }
    return res.json(JSend.success({ workout }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        `Error retrieving workout with workout_id= ${workout_id}`
      )
    );
  }
}

async function updateWorkout(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    console.log(req.params, req.body);
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  const { workout_id } = req.params;

  try {
    const updated = await workoutsService.updateWorkout(workout_id, {
      ...req.body,
      tutorial_video: req.file ? `/public/uploads/${req.file.filename}` : null,
    });

    if (!updated) {
      return next(new ApiError(404, "Workout not found"));
    }

    return res.json(
      JSend.success({
        workout: updated,
      })
    );
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating workout with workout_id=${workout_id}`)
    );
  }
}

async function deleteWorkout(req, res, next) {
  const { workout_id } = req.params;

  try {
    const deleted = await workoutsService.deleteWorkout(workout_id);

    if (!deleted) {
      return next(new ApiError(404, "Workout not found"));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        `Could not delete workout with workout_id=${workout_id}`
      )
    );
  }
}

module.exports = {
  createWorkout,
  getWorkoutByFilter,
  getWorkout,
  updateWorkout,
  deleteWorkout,
};
