const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const { prisma } = require("../generated/prisma-client");
const { APP_SECRET } = process.env;

const jwtValidator = token => jwt.verify(token, APP_SECRET);

function signToken({ id, name, email }) {
  return jwt.sign(
    {
      id,
      name,
      email
    },
    APP_SECRET
  );
}

async function loginChecker({ request }) {
  const Authorization = request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const userInJwt = jwtValidator(token);
    const user = await prisma.user({ id: userInJwt.id });
    if (!user) {
      throw new Error("Not Authorized");
    }
    return user;
  }
}

async function createHash() {
  const randomBytesPromise = promisify(randomBytes);
  // 20 is the byte we want to hash, This can be any number
  const hash = (await randomBytesPromise(20)).toString("hex");
  return hash;
}

module.exports = { signToken, loginChecker, createHash };
