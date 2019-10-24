const bcrypt = require("bcryptjs");

const { prisma } = require("../generated/prisma-client");
const { signToken, createHash } = require("./common");

const mutations = {
  async signup(parent, args, ctx) {
    const user = await prisma.user({ email: args.email });
    if (user) {
      throw new Error("Email already exists!");
    }

    const password = await bcrypt.hash(args.password, 10);

    const data = { ...args };

    const emailToken = await createHash();
    const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

    await prisma.createUser({
      ...data,
      password,
      emailToken,
      emailTokenExpiry,
    });

    return { message: emailToken };
  },

  async login(parent, args, ctx) {
    const { email, password } = args;
    const user = await prisma.user({ email });

    if (!user) {
      throw new Error(`No user found with this email`);
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new Error("Invalid password");
    }

    return {
      token: signToken(user),
      user
    };
  }
};

module.exports = mutations;
