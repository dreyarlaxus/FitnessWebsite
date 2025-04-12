const express = require("express");
const workoutsController = require("../controllers/workouts.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const tutorialVideoUpload = require("../middlewares/tutorial_video.middlewares");

module.exports.setup = (app) => {
  app.use("/workouts", router);
  /**
   * @swagger
   * /workouts:
   *  get:
   *    summary:  Get workouts by filter
   *    description:  Get workouts by filter
   *    parameters:
   *      - in: query
   *        name: workout_name
   *        schema:
   *          type: string
   *          description:  workout name
   *      - in: query
   *        name: workout_type
   *        schema:
   *          type: string
   *          enum: [cardio, strength, flexibility]
   *          description:  Type of the workout
   *      - in: query
   *        name: difficulty
   *        schema:
   *          type: integer
   *          enum: [0, 1, 2, 3, 4, 5]
   *          description: Difficulty of the workout
   *    tags:
   *      - Workout
   *    responses:
   *      200:
   *        description: A list of workouts
   *        content:
   *          application/json:
   *            schema:
   *              type: Object
   *              properties:
   *                status:
   *                  type: string
   *                  description: status of the workout
   *                  enum: [success]
   *                data:
   *                  type: Object
   *                  properties:
   *                    workout:
   *                      type: array
   *                      items:
   *                        $ref: '#/components/schemas/Workout'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.get("/", workoutsController.getWorkoutByFilter);
  /**
   * @swagger
   * /workouts:
   *   post:
   *    summary:   Create a new workout
   *    description:  Create a new workout
   *    requestBody:
   *      required: true
   *      content:
   *        multipart/form-data:
   *          schema:
   *            $ref:  '#/components/schemas/Workout'
   *    tags:
   *      - Workout
   *    responses:
   *      201:
   *        description: A new workout
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description: The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    workout:
   *                      $ref: '#/components/schemas/Workout'
   *      400:
   *        description: Bad Request (invalid query parameters)
   *        $ref: '#/components/responses/400BadRequest'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.post("/", tutorialVideoUpload, workoutsController.createWorkout);
  router.all("/", methodNotAllowed);
  /**
   * @swagger
   * /workouts/{workout_id}:
   *   get:
   *    summary:    Get a workout by id
   *    description:  Get a workout by id
   *    parameters:
   *        - $ref: '#/components/parameters/workoutIdParam'
   *    tags:
   *        - Workout
   *    responses:
   *      200:
   *        description: A workout
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  description:  The response status
   *                  enum: [success]
   *                data:
   *                  type: object
   *                  properties:
   *                    workout:
   *                      $ref: '#/components/schemas/Workout'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.get("/:workout_id", workoutsController.getWorkout);

  /**
   * @swagger
   *  /workouts/{workout_id}:
   *   put:
   *     summary: Update workout by ID
   *     description: Update workout by ID
   *     parameters:
   *       - $ref: '#/components/parameters/workoutIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Workout'
   *     tags:
   *       - Workout
   *     responses:
   *       200:
   *         description: An updated workout
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     workout:
   *                       $ref: '#/components/schemas/Workout'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No workouts found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.put(
    "/:workout_id",
    tutorialVideoUpload,
    workoutsController.updateWorkout
  );

  /**
   * @swagger
   *  /workouts/{workout_id}:
   *   delete:
   *     summary: Delete workout by ID
   *     description: Delete workout by ID
   *     parameters:
   *       - $ref: '#/components/parameters/workoutIdParam'
   *     tags:
   *       - Workout
   *     responses:
   *       200:
   *         description: workout deleted
   *         $ref: '#/components/responses/200NoData'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No workouts found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.delete("/:workout_id", workoutsController.deleteWorkout);
  router.all("/:workout_id", methodNotAllowed);
};
