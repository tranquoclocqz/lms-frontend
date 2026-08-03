export type ApiResponse<T> = {
    data: T;
    message: string;
    status: 1 | 0 | 401;
};

export type ApiSepayResponse<T> = {
    success: boolean;
    data: T;
    message: string;
}