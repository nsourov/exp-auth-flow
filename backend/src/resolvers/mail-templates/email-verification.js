const verifyEmail = token => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>Your email verification is here!
    \n\n
    <a href="${
      process.env.DASHBOARD_URL
    }/verify?token=${token}">Click Here to verify</a></p>
  `;

module.exports = verifyEmail;
