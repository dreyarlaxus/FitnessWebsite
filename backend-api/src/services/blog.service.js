const knex = require("../database/knex");
const Paginator = require("./paginator");
const { unlink } = require("node:fs");

function blogRepository() {
   return knex("blog");
}

function readBlog(payload) {
   return {
      title: payload.title,
      blog_description: payload.blog_description,
      content: payload.content,
      author: payload.author,
      blog_image: payload.blog_image,
   };
}

async function createBlog(payload) {
   const blog = readBlog(payload);
   const [blog_id] = await blogRepository().insert(blog);
   return { blog_id, ...blog };
}

async function getManyBlogs(query) {
   const { title, author, page = 1, limit = 6 } = query;
   const paginator = new Paginator(page, limit);
   let results = await blogRepository()
      .where((builder) => {
         if (title) {
            builder.where("title", "like", `%${title}%`);
         }
         if (author) {
            builder.where("author", "like", `%${author}%`);
         }
      })
      .select(
         knex.raw("count(blog_id) OVER() AS recordCount"),
         "blog_id",
         "title",
         "blog_description",
         "content",
         "author",
         "blog_image"
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
      blogs: results,
   };
}

async function getBlogById(blog_id) {
   return blogRepository().where("blog_id", blog_id).select("*").first();
}

async function updateBlog(blog_id, payload) {
   console.log(blog_id, payload);
   const updatedBlog = await blogRepository()
      .where("blog_id", blog_id)
      .select("*")
      .first();
   if (!updatedBlog) {
      return null;
   }

   const update = readBlog(payload);
   if (!update.blog_image) {
      delete update.blog_image;
   }
   console.log(update);
   await blogRepository().where("blog_id", blog_id).update(update);
   if (
      update.blog_image &&
      updatedBlog.blog_image &&
      update.blog_image !== updatedBlog.blog_image &&
      updatedBlog.blog_image.startsWith("/public/uploads")
   ) {
      unlink(`.${updatedBlog.blog_image}`, (err) => {});
   }
   return { ...updatedBlog, ...update };
}

async function deleteBlog(blog_id) {
   const deletedBlog = await blogRepository()
      .where("blog_id", blog_id)
      .select("blog_image")
      .first();

   if (!deletedBlog) {
      return null;
   }

   await blogRepository().where("blog_id", blog_id).del();

   if (
      deletedBlog.blog_image &&
      deletedBlog.blog_image.startsWith("/public/uploads")
   ) {
      unlink(`.${deletedBlog.blog_image}`, (err) => {});
   }

   return deletedBlog;
}

module.exports = {
   createBlog,
   getManyBlogs,
   getBlogById,
   updateBlog,
   deleteBlog,
};
