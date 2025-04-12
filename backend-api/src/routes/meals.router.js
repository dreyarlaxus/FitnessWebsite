const express = require("express");
const mealsController = require("../controllers/meals.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();

module.exports.setup = (app) => {
  app.use("/meals", router);
  /**
   * @swagger
   * /meals:
   *  get:
   *    summary:  Get meals by filter
   *    description:  Get meals by filter
   *    parameters:
   *      - in: query
   *        name: meal_name
   *        schema:
   *          type: string
   *          description:  meal name
   *      - in: query
   *        name: meal_type
   *        schema:
   *          type: string
   *          enum: ["breakfast", "lunch", "dinner"]
   *          description:  meal type
   *    tags:
   *      - Meal
   *    responses:
   *      200:
   *        description: A list of meals
   *        content:
   *          application/json:
   *            schema:
   *              type: Object
   *              properties:
   *                status:
   *                  type: string
   *                  description: status of the meal
   *                  enum: [success]
   *                data:
   *                  type: Object
   *                  properties:
   *                    meal:
   *                      type: array
   *                      items:
   *                        $ref: '#/components/schemas/Meal'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.get("/", mealsController.getMealByFilter);
  /**
   * @swagger
   * /meals:
   *   post:
   *    summary:   Create a new meal
   *    description:  Create a new meal
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref:  '#/components/schemas/Meal'
   *    tags:
   *      - Meal
   *    responses:
   *      201:
   *        description: A new meal
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
   *                    meal:
   *                      $ref: '#/components/schemas/Meal'
   *      400:
   *        description: Bad Request (invalid query parameters)
   *        $ref: '#/components/responses/400BadRequest'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.post("/", mealsController.createMeal);
  router.all("/", methodNotAllowed);

  /**
   * @swagger
   * /meals/{meal_id}:
   *   get:
   *    summary:    Get a meal by id
   *    description:  Get a meal by id
   *    parameters:
   *        - $ref: '#/components/parameters/mealIdParam'
   *    tags:
   *        - Meal
   *    responses:
   *      200:
   *        description: A meal
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
   *                    meal:
   *                      $ref: '#/components/schemas/Meal'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.get("/:meal_id", mealsController.getMeal);
  /**
   * @swagger
   *  /meals/{meal_id}:
   *   put:
   *     summary: Update meal by ID
   *     description: Update meal by ID
   *     parameters:
   *       - $ref: '#/components/parameters/mealIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Meal'
   *     tags:
   *       - Meal
   *     responses:
   *       200:
   *         description: An updated meal
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
   *                     meal:
   *                       $ref: '#/components/schemas/Meal'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No contacts found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.put("/:meal_id", mealsController.updateMeal);
  /**
   * @swagger
   *  /meals/{meal_id}:
   *   delete:
   *     summary: Delete meal by ID
   *     description: Delete meal by ID
   *     parameters:
   *       - $ref: '#/components/parameters/mealIdParam'
   *     tags:
   *       - Meal
   *     responses:
   *       200:
   *         description: Meal deleted
   *         $ref: '#/components/responses/200NoData'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No meals found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.delete("/:meal_id", mealsController.deleteMeal);
  router.all("/:meal_id", methodNotAllowed);
};
