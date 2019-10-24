const { prisma } = require("../generated/prisma-client");
const { loginChecker } = require("./common");

const queries = {
  async me(parent, args, ctx) {
    const { id } = await loginChecker(ctx);
    return prisma.user({ id });
  }
};

module.exports = queries;
