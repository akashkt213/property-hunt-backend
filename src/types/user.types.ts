enum role {'SELLER', 'BUYER'}

export type createUserType = {
  email:string
  password:string
  full_name:string
  role:role
};

export type generateTokenType ={
  email:string,
  id:string,
  role:role
}

export type verificationMailType = {
  email:string,
  token:string
}