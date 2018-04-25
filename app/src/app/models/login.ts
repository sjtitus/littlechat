export interface  LoginRequest {
    email: string;
    password: string;
}

export interface  LoginResponse {
    error: boolean;
    errorMessage: string;
    userId: string;
    token: string;
}

export interface  SignupRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password2: string;
}

export interface  SignupResponse {
    error: boolean;
    errorMessage: string;
    userId: string;
    token: string;
}
