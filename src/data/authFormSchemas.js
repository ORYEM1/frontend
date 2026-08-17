import registerFormSchema from './formSchema.json'

const loginFormSchema = {
  title: 'Login',
  country: registerFormSchema.country,
  submitLabel: 'Login',
  'form-data': [
    {
      type: 'text',
      label: 'Phone or Email',
      name: 'identifier',
      required: true,
      placeholder: 'Enter your phone or email',
    },
    {
      type: 'password',
      label: 'Password',
      name: 'password',
      required: true,
      'min-length': 6,
      placeholder: 'Enter your password',
    },
  ],
}

const authFormSchemas = {
  register: {
    ...registerFormSchema,
    title: registerFormSchema.title || 'Register',
    submitLabel: registerFormSchema.submitLabel || 'Create Account',
  },
  login: loginFormSchema,
}

export default authFormSchemas
