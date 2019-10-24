const bcrypt = require("bcryptjs");

const { prisma } = require("../generated/prisma-client");
const { signToken } = require("./common");

const mutations = {
  async signup(parent, args, ctx) {
    const user = await prisma.user({ email: args.email });
    if (user) {
      throw new Error("Email already exists!");
    }

    const password = await bcrypt.hash(args.password, 10);

    const data = { ...args };

    const newUser = await prisma.createUser({ ...data, password });

    return {
      token: signToken(newUser),
      user: newUser
    };
  }
};

module.exports = mutations;
