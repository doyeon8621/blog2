const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();
//회원가입
router.post("/users", async (req, res) => {
  const { nickname, password, email, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }
  //동일 이메일 혹은 닉네임이 있는지
  const existsUser = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existsUser) {
    res.status(400).send({
      errorMessage: "이메일 혹은 닉네임이 이미 사용중입니다.",
    });
    return;
  }
  const user = new User({ email, nickname, password });
  await user.save();
  //201은 create를 뜻한다.
  res.status(201).send({ result: "success" });
});

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
