const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const authMiddleware = require("./middlewares/auth-middleware");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();
/*
회원가입
*/
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }
  //동일 닉네임이 있는지
  const existsUser = await User.findOne({ nickname });
  if (existsUser) {
    res.status(400).send({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }
  const user = new User({ nickname, password });
  await user.save();
  //201은 created를 뜻한다.
  res.status(201).send({ result: "success" });
});
/*
로그인
*/
//Authenticate를 줄인 단어인데, 로그인 한다는 행위 자체를 "사용자가 자신의 정보를 인증한다" 라고 보기 때문에
// 일반적으로 로그인에 자주 사용되는 경로!
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ nickname }).exec();

  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요",
    });
    return;
  }
  res.send({
    token: jwt.sign({ userId: user.userId }, "secret-secret-key"),
  });
});
/*
로그인 되어 있는지
*/
router.get("/users/me", authMiddleware, async (req, res) => {
  res.send({ use: res.locals.user });
});
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
