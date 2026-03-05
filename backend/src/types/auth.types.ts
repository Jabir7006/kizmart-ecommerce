
export type LoginUserInput =  {
  email: string;
  password: string;
};

export type CreateUserInput = LoginUserInput & {
  fullName: string;
};

