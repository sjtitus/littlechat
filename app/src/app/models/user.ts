
export interface  User {
  id: number;
  email: string;
}

export interface GetUsersRequest {
  userId: number;
}

export interface  GetUsersResponse {
  error: boolean;
  errorMessage: string;
  userId: number;
  users: User[];
}
