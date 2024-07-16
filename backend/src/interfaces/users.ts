export interface User {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    profilePicture?: string;
  }
  
export interface UserLogin {
    email: string;
    password: string;
}

export interface tokenInfo {
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}