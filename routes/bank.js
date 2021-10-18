var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

mongoose.connect(
  "mongodb+srv://mike:1987@cluster1.6oysv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Schema = mongoose.Schema;
const banksScheme = new Schema({
  name: String,
  rate: Number,
  credit: Number,
  payment: Number,
  term: Number,
});

const Bank = mongoose.model("Bank", banksScheme);

router.get("/", function (req, res, next) {
  if (req.query.filter_property)
    Bank.find(
      {
        [req.query.filter_property]: req.query.filter_value,
      },
      function (err, docs) {
        if (err)
          return res
            .status(500)
            .json({ success: false, err: { msg: "Fetch failed!" } });
        res.status(200).json({ success: true, data: docs });
      }
    );
  else
    Bank.find({}, function (err, docs) {
      if (err)
        return res
          .status(500)
          .json({ success: false, err: { msg: "Fetch failed!" } });
      res.status(200).json({ success: true, data: docs });
    });
});

router.post(
  "/add",
  body("name")
    .isLength({ min: 3 })
    .trim()
    .withMessage("Bank name must be specified")
    .escape(),
  body("rate")
    .isInt({ min: 1 })
    .withMessage("Interest rate must be  under 0.0001")
    .toInt(),
  body("credit")
    .isInt({ min: 1 })
    .withMessage("Maximum loan must be  under 1")
    .toInt()
    .escape(),
  body("payment")
    .isInt({ min: 1 })
    .withMessage("Minimum Down Payment must be  under 1")
    .toInt()
    .escape(),
  body("term")
    .isInt({ min: 1 })
    .withMessage("Loan Term must be  under 1")
    .toInt()
    .escape(),

  function (req, res, next) {
    const bank = new Bank({
      name: req.body.bankName,
      rate: parseFloat(req.body.bankRate),
      credit: parseInt(req.body.bankCredit),
      payment: parseInt(req.body.bankPayment),
      term: parseInt(req.body.bankTerm),
    });
    bank.save(function (err, bankDoc) {
      if (err)
        return res
          .status(500)
          .json({ success: false, err: { msg: "Saving failed!" } });
      res.status(200).json({ success: true, bankId: bankDoc._id });
    });
  }
);

router.delete("/", function (req, res, next) {
  Bank.findByIdAndDelete(req.body.bankId, function (err, doc) {
    if (err)
      return res
        .status(500)
        .json({ success: false, err: { msg: "Delete failed!" } });
    res.status(200).json({ success: true });
  });
});

router.get("/:bankId", function (req, res, next) {
  Bank.findById(req.params["bankId"], function (err, doc) {
    if (err)
      return res
        .status(500)
        .json({ success: false, err: { msg: "Fetch failed!" } });
    res.status(200).json({ success: true, data: doc });
  });
});

router.put(
  "/update",
  body("name")
    .isLength({ min: 3 })
    .trim()
    .withMessage("Bank name must be specified")
    .escape(),
  body("rate")
    .isInt({ min: 0.0001 })
    .withMessage("Interest rate must be  under 0.0001")
    .toInt(),
  body("credit")
    .isInt({ min: 1 })
    .withMessage("Maximum loan must be  under 1")
    .toInt()
    .escape(),
  body("payment")
    .isInt({ min: 1 })
    .withMessage("Minimum Down Payment must be  under 1")
    .toInt()
    .escape(),
  body("term")
    .isInt({ min: 1 })
    .withMessage("Loan Term must be  under 1")
    .toInt()
    .escape(),
  function (req, res, next) {
    Bank.findByIdAndUpdate(
      req.body.bankId,
      {
        name: req.body.bankName,
        rate: parseFloat(req.body.bankRate),
        credit: parseInt(req.body.bankCredit),
        payment: parseInt(req.body.bankPayment),
        term: parseInt(req.body.bankTerm),
      },
      function (err, bankDoc) {
        if (err)
          return res
            .status(500)
            .json({ success: false, err: { msg: "Saving failed!" } });
        res.status(200).json({ success: true });
      }
    );
  }
);

module.exports = router;
