export const SnackbarErrorOutput = (error: any): string => {
    return error.response.data && error.response.data.detail && error.response.data.detail.includes('User does not have permission')
        ? 'You do not have permission with your current role'
        : error.response.data && error.response.data.detail
        ? error.response.data.detail
        : error.message;
};
