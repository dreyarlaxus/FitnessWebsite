const JSend = require("../jsend");
const blogService = require("../services/blog.service");
const ApiError = require("../api-error");

async function createBlog(req, res, next) {
   console.log(req.body);
   if (!req.body?.title || typeof req.body.title !== "string") {
      console.log(req.body);
      return next(new ApiError(400, "Title should be a non-empty string"));
   }

   try {
      const blog = await blogService.createBlog({
         ...req.body,
         blog_image: req.file ? `/public/uploads/${req.file.filename}` : null,
      });
      return res
         .status(201)
         .set({
            Location: `${req.baseUrl}/${blog.blog_id}`,
         })
         .json(JSend.success({ blog }));
   } catch (error) {
      console.log(req.body);
      console.log(error);
      return next(
         new ApiError(500, "An error occurred while creating the blog")
      );
   }
}

async function getBlogByFilter(req, res, next) {
   let result = {
      blogs: [],
      metadata: {
         totalRecords: 0,
         firstPage: 1,
         lastPage: 1,
         page: 1,
         limit: 5,
      },
   };
   try {
      result = await blogService.getManyBlogs(req.query);
   } catch (error) {
      console.log(error);
      return next(
         new ApiError(500, "An error occurred while retrieving blogs")
      );
   }
   return res.json(
      JSend.success({
         blogs: result.blogs,
         metadata: result.metadata,
      })
   );
}

async function getBlog(req, res, next) {
   const { blog_id } = req.params;

   try {
      const blog = await blogService.getBlogById(blog_id);
      if (!blog) {
         return next(new ApiError(404, "Blog not found"));
      }
      return res.json(JSend.success({ blog }));
   } catch (error) {
      console.log(error);
      return next(
         new ApiError(500, `Error retrieving blog with blog_id= ${blog_id}`)
      );
   }
}

async function updateBlog(req, res, next) {
   if (Object.keys(req.body).length === 0 && !req.file) {
      console.log(req.params, req.body);
      return next(new ApiError(400, "Data to update can not be empty"));
   }

   const { blog_id } = req.params;

   try {
      const updated = await blogService.updateBlog(blog_id, {
         ...req.body,
         blog_image: req.file ? `/public/uploads/${req.file.filename}` : null,
      });

      if (!updated) {
         return next(new ApiError(404, "Blog not found"));
      }

      return res.json(
         JSend.success({
            blog: updated,
         })
      );
   } catch (error) {
      console.log(error);
      return next(
         new ApiError(500, `Error updating user with blog_id=${blog_id}`)
      );
   }
}

async function deleteBlog(req, res, next) {
   const { blog_id } = req.params;

   try {
      const deleted = await blogService.deleteBlog(blog_id);

      if (!deleted) {
         return next(new ApiError(404, "Blog not found"));
      }

      return res.json(JSend.success());
   } catch (error) {
      console.log(error);
      return next(
         new ApiError(500, `Could not delete blog with blog_id=${blog_id}`)
      );
   }
}

module.exports = {
   createBlog,
   getBlogByFilter,
   getBlog,
   deleteBlog,
   updateBlog,
};
