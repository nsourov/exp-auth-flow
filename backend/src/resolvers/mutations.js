const bcrypt = require("bcryptjs");

const { prisma } = require("../generated/prisma-client");
const { signToken, createHash, transport } = require("./common");

const {
  verifyEmailTemplate,
  resetPasswordTemplate
} = require("./mail-templates");

const { ADMIN_MAIL } = process.env;

async function createTokenForEmail(args) {
  const emailToken = await createHash();
  const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

  const user = await prisma.updateUser({
    where: { email: args.email },
    data: { emailToken, emailTokenExpiry }
  });

  // Send email with verification url
  await transport.sendMail({
    from: ADMIN_MAIL,
    to: user.email,
    subject: "Email verification",
    html: verifyEmailTemplate(emailToken)
  });

  return { message: "Verification url sent to your mail" };
}

const mutations = {
  async signup(parent, args, ctx) {
    const user = await prisma.user({ email: args.email });
    if (user) {
      throw new Error("Email already exists!");
    }

    const password = await bcrypt.hash(args.password, 10);

    const data = { ...args };

    const newUser = await prisma.createUser({
      ...data,
      password
    });
    return createTokenForEmail(newUser);
  },

  async verifyEmail(parent, { emailToken }, ctx) {
    const [user] = await prisma.users({
      where: {
        emailToken,
        emailTokenExpiry_gte: Date.now() - 3600000 // Make sure that the token is using within 1 hour
      }
    });
    if (!user) {
      throw new Error("This link is either invalid or expired!");
    }
    await prisma.updateUser({
      where: { id: user.id },
      data: { emailVerified: true }
    });
    return {
      message: "Email verified"
    };
  },

  async sendVerification(parent, args, ctx) {
    return createTokenForEmail(args);
  },

  async login(parent, args, ctx) {
    const { email, password } = args;
    const user = await prisma.user({ email });

    if (!user) {
      throw new Error(`No user found with this email`);
    }

    if (!user.emailVerified) {
      throw new Error(`You have to verify your email first`);
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new Error("Invalid password");
    }

    return {
      token: signToken(user),
      user
    };
  },

  async requestReset(parent, { email }, ctx) {
    const user = await prisma.user({ email });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    const resetToken = await createHash();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await prisma.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });
    await transport.sendMail({
      from: ADMIN_MAIL,
      to: user.email,
      subject: "Your Password Reset Token",
      html: resetPasswordTemplate(resetToken)
    });
    return { message: `An email sent to you with reset token.` };
  }
};

module.exports = mutations;