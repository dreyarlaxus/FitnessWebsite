const usersService = require("../services/users.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

// function createUser(req, res) {
//   return res.status(201).json(JSend.success({ User: {} }));
// }
async function createUser(req, res, next) {
  console.log(req.body);
  if (!req.body?.username || typeof req.body.username !== "string") {
    return next(new ApiError(400, "Username should be a non-empty string"));
  }

  try {
    const user = await usersService.createUser({
      ...req.body,
    });
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${user.user_id}`,
      })
      .json(
        JSend.success({
          user,
        })
      );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating the user"));
  }
}

async function getUserByFilter(req, res, next) {
  let result = {
    users: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await usersService.getManyUsers(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving users"));
  }
  return res.json(
    JSend.success({
      users: result.users,
      metadata: result.metadata,
    })
  );
}

async function updateUser(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    console.log(req.params, req.body);
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  const { user_id } = req.params;
  try {
    const updated = await usersService.updateUser(user_id, {
      ...req.body,
    });
    if (!updated) {
      return next(new ApiError(404, "User not found"));
    }
    return res.json(
      JSend.success({
        user: updated,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error updating user with id=${user_id}`));
  }
}

async function deleteUser(req, res, next) {
  const { user_id } = req.params;
  try {
    const deleted = await usersService.deleteUser(user_id);

    if (!deleted) {
      return next(new ApiError(404, "User not found"));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Could not delete user with user_id=${user_id}`)
    );
  }
}

async function loginUser(req, res, next) {
  try {
    const { username, password, vip } = req.body;
    const user = await usersService.loginUser({ username, password, vip });

    if (!user) {
      return res
        .status(401)
        .json(JSend.fail({ error: "Invalid username or password" }));
    }
    req.session.user = {
      id: user.user_id,
      username: user.username,
      vip: user.vip,
    };
    return res.status(200).json(
      JSend.success({
        message: "Login successful",
        user: req.session.user,
      })
    );
  } catch (error) {
    if (error.message === "Invalid username or password") {
      return res.status(401).json(JSend.fail({ error: error.message }));
    }
    console.log(error);
    return next(new ApiError(500, "An error occurred during login"));
  }
}

async function logoutUser(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next(new ApiError(500, "An error occurred during logout"));
    }
    res.clearCookie("connect.sid");
    return res
      .status(200)
      .json(JSend.success({ message: "Logout successful" }));
  });
}

async function updateVip(req, res, next) {
  const { user_id } = req.params;
  const { vip } = req.body;

  try {
    const updatedUser = await usersService.updateVip(user_id, { vip });
    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }

    return res.json(
      JSend.success({
        user: updatedUser,
      })
    );
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating vip status for user id=${user_id}`)
    );
  }
}

module.exports = {
  createUser,
  getUserByFilter,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  updateVip,
};
