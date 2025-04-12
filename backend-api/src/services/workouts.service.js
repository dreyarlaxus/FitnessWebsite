const knex = require("../database/knex");
const Paginator = require("./paginator");
const { unlink } = require("node:fs");

function workoutRepository() {
  return knex("workouts");
}

function readWorkout(payload) {
  return {
    workout_name: payload.workout_name,
    workout_type: payload.workout_type,
    difficulty: payload.difficulty,
    equipment: payload.equipment,
    burn_estimate: payload.burn_estimate,
    workout_vip: payload.workout_vip,
    tutorial_video: payload.tutorial_video,
  };
}

async function createWorkout(payload) {
  const workout = readWorkout(payload);
  const [workout_id] = await workoutRepository().insert(workout);
  return { workout_id, ...workout };
}

async function getManyWorkouts(query) {
  const { workout_name, workout_type, difficulty, page = 1, limit = 6 } = query;
  const paginator = new Paginator(page, limit);
  let results = await workoutRepository()
    .where((builder) => {
      if (workout_name) {
        builder.where("workout_name", "like", `%${workout_name}%`);
      }
      if (workout_type) {
        builder.where("workout_type", "like", `%${workout_type}%`);
      }
      if (difficulty) {
        builder.where("difficulty", "like", `%${difficulty}%`);
      }
    })
    .where("workout_vip", "0")
    .select(
      knex.raw("count(workout_id) OVER() AS recordCount"),
      "workout_id",
      "workout_name",
      "workout_type",
      "difficulty",
      "equipment",
      "burn_estimate",
      "workout_vip",
      "tutorial_video"
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
    workouts: results,
  };
}

async function getManyWorkoutsVip(query) {
  const { workout_name, workout_type, difficulty, page = 1, limit = 6 } = query;
  const paginator = new Paginator(page, limit);
  let results = await workoutRepository()
    .where((builder) => {
      if (workout_name) {
        builder.where("workout_name", "like", `%${workout_name}%`);
      }
      if (workout_type) {
        builder.where("workout_type", "like", `%${workout_type}%`);
      }
      if (difficulty) {
        builder.where("difficulty", "like", `%${difficulty}%`);
      }
    })
    .select(
      knex.raw("count(workout_id) OVER() AS recordCount"),
      "workout_id",
      "workout_name",
      "workout_type",
      "difficulty",
      "equipment",
      "burn_estimate",
      "workout_vip",
      "tutorial_video"
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
    workouts: results,
  };
}

async function getWorkoutById(workout_id) {
  return workoutRepository()
    .where("workout_id", workout_id)
    .select("*")
    .first();
}

async function updateWorkout(workout_id, payload) {
  const updatedWorkout = await workoutRepository()
    .where("workout_id", workout_id)
    .select("*")
    .first();
  if (!updatedWorkout) {
    return null;
  }
  const update = readWorkout(payload);
  if (!update.tutorial_video) {
    delete update.tutorial_video;
  }
  await workoutRepository().where("workout_id", workout_id).update(update);
  if (
    update.tutorial_video &&
    updatedWorkout.tutorial_video &&
    update.tutorial_video !== updatedWorkout.tutorial_video &&
    updatedWorkout.tutorial_video.startsWith("/public/uploads")
  ) {
    unlink(`.${updatedWorkout.workout_image}`, (err) => {});
  }
  return { ...updatedWorkout, ...update };
}

async function deleteWorkout(workout_id) {
  const deletedWorkout = await workoutRepository()
    .where("workout_id", workout_id)
    .first();

  if (!deletedWorkout) {
    return null;
  }

  await workoutRepository().where("workout_id", workout_id).del();

  return deletedWorkout;
}

async function deleteWorkout(workout_id) {
  const deletedWorkout = await workoutRepository()
    .where("workout_id", workout_id)
    .select("tutorial_video")
    .first();

  if (!deletedWorkout) {
    return null;
  }

  await workoutRepository().where("workout_id", workout_id).del();

  if (
    deletedWorkout.tutorial_video &&
    deletedWorkout.tutorial_video.startsWith("/public/uploads")
  ) {
    unlink(`.${deletedWorkout.tutorial_video}`, (err) => {});
  }

  return deletedWorkout;
}

module.exports = {
  createWorkout,
  getManyWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getManyWorkoutsVip,
};
