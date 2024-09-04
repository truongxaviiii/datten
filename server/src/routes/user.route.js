import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists().withMessage("username không được bỏ trống")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists().withMessage("password không được bỏ trống")
    .isLength({ min: 8 }).withMessage("password ít nhất 8 ký tự"),
  body("confirmPassword")
    .exists().withMessage("confirmPassword không được bỏ trống")
    .isLength({ min: 8 }).withMessage("confirmPassword ít nhất 8 ký tự")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("confirmPassword not match");
      return true;
    }),
  body("displayName")
    .exists().withMessage("displayName không được bỏ trống"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("username không được bỏ trống"),
  body("password")
    .exists().withMessage("password không được bỏ trống")
    .isLength({ min: 8 }).withMessage("password ít nhất 8 ký tự"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists().withMessage("password không được bỏ trống")
    .isLength({ min: 8 }).withMessage("password ít nhất 8 ký tự"),
  body("newPassword")
    .exists().withMessage("newPassword không được bỏ trống")
    .isLength({ min: 8 }).withMessage("newPassword ít nhất 8 ký tự"),
  body("confirmNewPassword")
    .exists().withMessage("confirmNewPassword không được bỏ trống")
    .isLength({ min: 8 }).withMessage("confirmNewPassword ít nhất 8 ký tự")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get(
  "/info",
  tokenMiddleware.auth,
  userController.getInfo
);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists().withMessage("danh mục không được bỏ trống")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("danh mục rỗng!"),
  body("mediaId")
    .exists().withMessage("mediaId không được bỏ trống")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle không được bỏ trống"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster không được bỏ trống"),
  body("mediaRate")
    .exists().withMessage("mediaRate không được bỏ trống"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;