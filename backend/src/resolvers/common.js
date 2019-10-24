const jwt = require("jsonwebtoken");

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
module.exports = { signToken, loginChecker };
