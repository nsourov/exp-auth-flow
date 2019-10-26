const bcrypt = require("bcryptjs");

const { prisma } = require("../generated/prisma-client");
const { signToken, createHash, transport, loginChecker } = require("./common");

const {
  verifyEmailTemplate,
  resetPasswordTemplate
} = require("./mail-templates");

const { ADMIN_MAIL } = process.env;

async function sendEmailVerification({ email, emailToken }) {
  // Send email with verification url
  await transport.sendMail({
    from: ADMIN_MAIL,
    to: email,
    subject: "Email verification",
    html: verifyEmailTemplate({ email, emailToken })
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

    const emailToken = await createHash();
    const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const newUser = await prisma.createUser({
      ...data,
      password,
      emailToken,
      emailTokenExpiry
    });
    return sendEmailVerification(newUser);
  },

  async verifyEmail(parent, { emailToken, email }, ctx) {
    const [user] = await prisma.users({
      where: {
        emailToken,
        emailTokenExpiry_gte: Date.now() - 3600000 // Make sure that the token is using within 1 hour
      }
    });
    if (!user) {
      throw new Error("This link is either invalid or expired!");
    }
    const verifiedUser = await prisma.updateUser({
      where: { id: user.id },
      data: { emailVerified: true, email: email || user.email }
    });
    return {
      token: signToken(verifiedUser),
      user: verifiedUser
    };
  },

  async sendVerification(parent, args, ctx) {
    const emailToken = await createHash();
    const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

    await prisma.updateUser({
      where: { email: args.email },
      data: { emailToken, emailTokenExpiry }
    });
    return sendEmailVerification({ email: args.email, emailToken });
  },

  async requestChangeEmail(parent, args, ctx) {
    const user = await loginChecker(ctx);

    const emailToken = await createHash();
    const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

    await prisma.updateUser({
      where: { email: user.email },
      data: { emailToken, emailTokenExpiry }
    });
    return sendEmailVerification({ email: args.email, emailToken });
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
  },

  async resetPassword(parent, { resetToken, password, confirmPassword }, ctx) {
    const [user] = await prisma.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000 // Make sue that the token is using within 1 hour
      }
    });
    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match!");
    }

    const newPassword = await bcrypt.hash(password, 10);

    await prisma.updateUser({
      where: { id: user.id },
      data: { password: newPassword }
    });

    return { message: "Password changed!" };
  }
};

module.exports = mutations;
