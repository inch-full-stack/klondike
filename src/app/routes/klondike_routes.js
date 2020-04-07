// const express = require("express");
// const klondikeController = require("../controllers/klondike_controller.js");
// const klondikeRouter = express.Router();

// klondikeRouter.get("/about", klondikeController.about);
// klondikeRouter.get("/", klondikeController.index);

// module.exports = klondikeRouter;

// var express = require("express");
// console.log("express", express)
// var express = require("express");
// console.log("express", express)
// var app = express();
// console.log("app", app)
// // var userController = require("./controllers/klondike_controller.js");
// var homeController = require("./controllers/klondike_controller.js");

// // определяем Router
// var userRouter = express.Router();
// var homeRouter = express.Router();

// // определяем маршруты и их обработчики внутри роутера userRouter
// userRouter.use("/create", userController.addUser);
// userRouter.use("/", userController.getUsers);
// app.use("/users", userRouter);

// // определяем маршруты и их обработчики внутри роутера homeRouter
// homeRouter.get("/about", homeController.about);
// homeRouter.get("/", homeController.index);
// app.use("/", homeRouter);

// app.use(function (req, res, next) {
//     res.status(404).send("Not Found")
// });

// app.listen(3000);