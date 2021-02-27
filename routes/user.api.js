const express = require("express");
const userController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route GET api/users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route PATCH api/users/iframe/:id
 * @description patch iframe info
 * @access
 */
router.patch("/iframe/:id", userController.patchIframe);

/**
 * @route PATCH api/users/todo/:id
 * @description Patch todo
 * @access
 */
router.patch("/todo/:id", userController.patchTodo);

/**
 * @route PATCH api/users/memo/:id
 * @description Patch memo
 * @access
 */
router.patch("/memo/:id", userController.patchMemo);

/**
 * @route GET api/users
 * @description Get list of all users
 * @access
 */
router.get("/", userController.getUsers);

/**
 * @route POST api/users
 * @description Register new account
 * @access Public
 */
router.post("/", userController.register);

module.exports = router;
