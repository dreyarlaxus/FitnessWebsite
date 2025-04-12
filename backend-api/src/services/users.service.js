const knex = require("../database/knex");
const Paginator = require("./paginator");
const bcrypt = require("bcrypt");

function userRepository() {
   return knex("users");
}

function readUser(payload) {
   return {
      username: payload.username,
      password: payload.password,
      fullname: payload.fullname,
      email: payload.email,
      phone: payload.phone,
      vip: payload.vip,
   };
}

async function createUser(payload) {
   const user = readUser(payload);
   user.password = await bcrypt.hash(user.password, 10);
   const [user_id] = await userRepository().insert(user);
   return { user_id, ...user };
}

async function getManyUsers(query) {
   const { username, phone, page = 1, limit = 6 } = query;
   const paginator = new Paginator(page, limit);
   let results = await userRepository()
      .where((builder) => {
         if (username) {
            builder.where("username", "like", `%${username}%`);
         }
         if (phone) {
            builder.where("phone", "like", `%${phone}%`);
         }
      })
      .select(
         knex.raw("count(user_id) OVER() AS recordCount"),
         "user_id",
         "username",
         "password",
         "fullname",
         "email",
         "phone",
         "vip"
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
      users: results,
   };
}

async function updateUser(user_id, payload) {
   const updatedUser = await userRepository()
      .where("user_id", user_id)
      .select("*")
      .first();
   if (!updatedUser) {
      return null;
   }
   const update = readUser(payload);
   await userRepository().where("user_id", user_id).update(update);
   return { ...updatedUser, ...update };
}

async function deleteUser(user_id) {
   const deletedUser = await userRepository().where("user_id", user_id).first();
   if (!deletedUser) {
      return null;
   }
   await userRepository().where("user_id", user_id).del();
   return deletedUser;
}

async function loginUser(payload) {
   const { username, password } = payload;
   const user = await userRepository().where({ username }).first();
   if (!user) {
      throw new Error("Invalid username or password");
   }
   // Kiểm tra mật khẩu
   const passwordMatch = await bcrypt.compare(password, user.password);
   if (!passwordMatch) {
      throw new Error("Invalid username or password");
   }
   // Xóa mật khẩu trước khi trả về thông tin người dùng
   delete user.password;
   return user;
}

async function updateVip(user_id) {
   console.log(user_id);
   const user = await userRepository().where("user_id", user_id).first();
   if (!user) {
      return null; // User not found
   }
   // Update vip status to 1
   await userRepository().where("user_id", user_id).update({ vip: 1 });
   // Return the updated user information
   return { ...user, vip: 1 };
}

module.exports = {
   createUser,
   getManyUsers,
   updateUser,
   deleteUser,
   loginUser,
   updateVip,
};
//cho em gi
