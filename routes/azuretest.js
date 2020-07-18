const express = require("express");
const router = express.Router({ mergeParams: true });

const { getazure } = require("../controllers/azure");

router.route("/").get(getazure);

module.exports = router;
