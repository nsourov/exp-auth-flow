const formRules = {
  email: {
    validate: [
      {
        trigger: 'onBlur',
        rules: [
          { required: true, message: 'Please input your email!' },
          {
            type: 'email',
            message: 'Please enter a valid E-mail!',
          },
        ],
      },
    ],
  },
  password: {
    validate: [
      {
        trigger: 'onBlur',
        rules: [
          {
            required: true,
            message: 'Please input your Password!',
          },
          {
            min: 6,
            message: 'Password must be minimum 6 characters',
          },
        ],
      },
    ],
  },
  name: {
    validate: [
      {
        trigger: 'onBlur',
        rules: [
          {
            required: true,
            message: 'Please input your name!',
            whitespace: true,
          },
        ],
      },
    ],
  },
};

export default formRules;
