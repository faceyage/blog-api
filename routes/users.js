var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.get_users);

//POST request to create user
router.post("/", userController.create_user);

//DELETE request to delete user
router.delete("/:userid", userController.delete_user);

router.post("/login", userController.login);

module.exports = router;
