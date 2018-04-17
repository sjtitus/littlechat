
export interface  ErrorResponse {
    response: any;
    url: string;
    status: string | number;
    statusText: string;
    message: string;
    error: any;
    offline: boolean;
}
