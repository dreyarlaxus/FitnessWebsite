const express = require("express");
const usersController = require("../controllers/users.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();

module.exports.setup = (app) => {
  app.use("/auth", router);
  /**
   * @swagger
   * /auth/users:
   *  get:
   *    summary:  Get users by filter
   *    description:  Get users by filter
   *    parameters:
   *      - in: query
   *        name: username
   *        schema:
   *          type: string
   *          description: username
   *      - in: query
   *        name: phone
   *        schema:
   *          type: string
   *          description:  phone number of user
   *      - $ref: '#/components/parameters/limitParam'
   *      - $ref: '#/components/parameters/pageParam'
   *    tags:
   *      - User
   *    responses:
   *      200:
   *        description: A list of users
   *        content:
   *          application/json:
   *            schema:
   *              type: Object
   *              properties:
   *                status:
   *                  type: string
   *                  description: status of the user
   *                  enum: [success]
   *                data:
   *                  type: Object
   *                  properties:
   *                    user:
   *                      type: array
   *                      items:
   *                        $ref: '#/components/schemas/User'
   *                    metadata:
   *                      $ref: '#/components/schemas/PaginationMetadata'
   *      500:
   *        description: Internal Server Error
   *        $ref: '#/components/responses/500ServerError'
   */
  router.get("/users", usersController.getUserByFilter);
  router.all("/users", methodNotAllowed);
  /**
   * @swagger
   * /auth/vip/{user_id}:
   *   put:
   *     summary: Update VIP status for a user
   *     description: Update the VIP status of a user by their user ID.
   *     parameters:
   *       - name: user_id
   *         in: path
   *         required: true
   *         description: The ID of the user to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               vipStatus:
   *                 type: integer
   *                 default: 1
   *                 description: The VIP status to set for the user.
   *                 example: 1
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         description: The user's VIP status has been updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status.
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad Request (invalid input data)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/500ServerError'
   */
  router.put("/vip/:user_id", usersController.updateVip);
  router.all("/vip/:user_id", methodNotAllowed);

  /**
   * @swagger
   *  /auth/users/{user_id}:
   *   put:
   *     summary: Update user by ID
   *     description: Update user by ID
   *     parameters:
   *       - $ref: '#/components/parameters/userIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         description: An updated user
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
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No users found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.put("/users/:user_id", usersController.updateUser);
  /**
   * @swagger
   *  /auth/users/{user_id}:
   *   delete:
   *     summary: Delete user by ID
   *     description: Delete user by ID
   *     parameters:
   *       - $ref: '#/components/parameters/userIdParam'
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         description: user deleted
   *         $ref: '#/components/responses/200NoData'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No users found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.delete("/users/:user_id", usersController.deleteUser);
  router.all("/users/:user_id", methodNotAllowed);

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Create a new user
   *     description: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     tags:
   *       - User
   *     responses:
   *       201:
   *         description: A new user created successfully
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
   *                     user:
   *                       $ref: '#/components/schemas/User'
   */
  router.post("/register", usersController.createUser);
  router.all("/register", methodNotAllowed);

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     description: Authenticates a user with username and password.
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: "tienanh"
   *                 description: The user's username
   *               password:
   *                 type: string
   *                 example: "securePassword123"
   *                 description: The user's password
   *     responses:
   *       200:
   *         description: Login successfully!
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
   *                     message:
   *                       type: string
   *                       example: "Login successful"
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad Request (missing or invalid parameters)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/400BadRequest'
   *       401:
   *         description: Unauthorized (invalid credentials)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "fail"
   *                 message:
   *                   type: string
   *                   example: "Invalid username or password"
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/500ServerError'
   */
  router.post("/login", usersController.loginUser);
  router.all("/login", methodNotAllowed);

  router.post("/logout", usersController.logoutUser);
  router.all("/logout", methodNotAllowed);
};
