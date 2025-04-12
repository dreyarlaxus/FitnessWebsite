const express = require("express");
const blogController = require("../controllers/blog.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const router = express.Router();
const blogImageUpload = require("../middlewares/blog_image.middlewares");

module.exports.setup = (app) => {
  app.use("/blog", router);
  /**
   * @swagger
   * /blog:
   *   get:
   *      summary:  Get blogs by filter
   *      description:  Get blogs by filter
   *      parameters:
   *        - in: query
   *          name: title
   *          schema:
   *            type: string
   *            description:  title of blog
   *        - in: query
   *          name: author
   *          schema:
   *            type: string
   *            description:   author name
   *      tags:
   *        - Blog
   *      responses:
   *        200:
   *          description: A list of blogs
   *          content:
   *            application/json:
   *              schema:
   *                type: Object
   *                properties:
   *                  status:
   *                    type: string
   *                    description: status of the blog
   *                    enum: [success]
   *                  data:
   *                    type: Object
   *                    properties:
   *                      blog:
   *                        type: array
   *                        items:
   *                          $ref: '#/components/schemas/Blog'
   */
  router.get("/", blogController.getBlogByFilter);
  /**
   * @swagger
   * /blog:
   *   post:
   *    summary:   Create a new blog
   *    description:  Create a new blog
   *    requestBody:
   *      required: true
   *      content:
   *        multipart/form-data:
   *          schema:
   *            $ref:  '#/components/schemas/Blog'
   *    tags:
   *      - Blog
   *    responses:
   *      201:
   *        description: A new blog
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
   *                    blog:
   *                      $ref: '#/components/schemas/Blog'
   */
  router.post("/", blogImageUpload, blogController.createBlog);
  router.all("/", methodNotAllowed);

  /**
   * @swagger
   * /blog/{blog_id}:
   *   get:
   *    summary:    Get a blog by id
   *    description:  Get a blog by id
   *    parameters:
   *        - $ref: '#/components/parameters/blogIdParam'
   *    tags:
   *        - Blog
   *    responses:
   *      200:
   *        description: A blog
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
   *                    blog:
   *                      $ref: '#/components/schemas/Blog'
   */
  router.get("/:blog_id", blogController.getBlog);

  /**
   * @swagger
   *  /blog/{blog_id}:
   *   put:
   *     summary: Update blog by ID
   *     description: Update blog by ID
   *     parameters:
   *       - $ref: '#/components/parameters/blogIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Blog'
   *     tags:
   *       - Blog
   *     responses:
   *       200:
   *         description: An updated blog
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
   *                     blog:
   *                       $ref: '#/components/schemas/Blog'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No blogs found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.put("/:blog_id", blogImageUpload, blogController.updateBlog);

  /**
   * @swagger
   * /blog/{blog_id}:
   *   delete:
   *    summary: Delete blog by ID
   *    description: Delete blog by ID
   *    parameters:
   *        - $ref: '#/components/parameters/blogIdParam'
   *    tags:
   *        - Blog
   *    responses:
   *      200:
   *        description: Blog deleted
   *        $ref: '#/components/responses/200NoData'
   */
  router.delete("/:blog_id", blogController.deleteBlog);
  router.all("/:blog_id", methodNotAllowed);
};
