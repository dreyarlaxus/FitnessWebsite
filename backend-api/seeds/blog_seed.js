const { faker } = require("@faker-js/faker");

function createBlog() {
  return {
    title: faker.lorem.sentence(),
    blog_description: faker.lorem.sentences(2),
    content: faker.lorem.paragraphs(3),
    author: faker.person.fullName(),
    blog_image: "/public/images/blank-profile-picture.png",
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("blog").del();
  await knex("blog").insert(Array(50).fill().map(createBlog));
};
