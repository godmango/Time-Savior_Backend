const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, avatarUrl } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(400, "User already exists", "Registration Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
    avatarUrl,
  });
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});
userController.patchIframe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user.settings.iframeString == req.body.rawIframeCode) {
    return sendResponse(res, 200, true, user, null, "Same iframe code");
  }
  const accessToken = await user.generateToken();
  await User.findByIdAndUpdate(
    req.params.id,
    {
      settings: {
        iframeString: req.body.rawIframeCode,
        todoList: user.settings.todoList,
        memoList: user.settings.memoList,
      },
    },
    function (err, result) {
      if (err) {
        console.log("error:", error);
      } else {
        console.log("updated result", result);
      }
    }
  );
  const theUser = await User.findById(req.params.id);
  return sendResponse(
    res,
    200,
    true,
    { theUser, accessToken },
    null,
    "Update iframe sucessful"
  );
});

userController.patchTodo = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const accessToken = await user.generateToken();
  await User.findByIdAndUpdate(
    req.params.id,
    {
      settings: {
        iframeString: user.settings.iframeString,
        todoList: req.body,
        memoList: user.settings.memoList,
      },
    },
    function (err, result) {
      if (err) {
        console.log("error:", error);
      } else {
        console.log("updated result", result);
      }
    }
  );
  const theUser = await User.findById(req.params.id);
  return sendResponse(
    res,
    200,
    true,
    { theUser, accessToken },
    null,
    "Update todo list sucessful"
  );
});

userController.patchMemo = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const accessToken = await user.generateToken();
  await User.findByIdAndUpdate(
    req.params.id,
    {
      settings: {
        iframeString: user.settings.iframeString,
        todoList: user.settings.todoList,
        memoList: req.body.memoWords,
      },
    },
    function (err, result) {
      if (err) {
        console.log("error:", error);
      } else {
        console.log("updated result", result);
      }
    }
  );
  const theUser = await User.findById(req.params.id);
  return sendResponse(
    res,
    200,
    true,
    { theUser, accessToken },
    null,
    "Update memo list sucessful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  const accessToken = await user.generateToken();
  if (!user)
    return next(new AppError(400, "User not found", "Get Current User Error"));
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Get current user sucessful"
  );
});

userController.getUsers = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = req.query;

  const currentUserId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalNumUsers = await User.find({ ...filter }).countDocuments();
  const totalPages = Math.ceil(totalNumUsers / limit);
  const offset = limit * (page - 1);

  const users = await User.find({ ...filter })
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { users, totalPages }, null, "");
});

userController.getConversationList = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;

  const currentUserId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalNumConversation = await Conversation.find({
    users: currentUserId,
  }).countDocuments();
  const totalPages = Math.ceil(totalNumConversation / limit);
  const offset = limit * (page - 1);

  let conversations = await Conversation.find({
    users: currentUserId,
  })
    .sort({ updatedAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("users");

  return sendResponse(
    res,
    200,
    true,
    { conversations, totalPages },
    null,
    null
  );
});

module.exports = userController;
