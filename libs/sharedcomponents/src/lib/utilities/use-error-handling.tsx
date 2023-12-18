import { useRecoilState } from 'recoil';
import { SnackBarOptions } from '../recoil/atom';
import { AxiosError } from 'axios';
import { SnackbarErrorOutput } from './snackbar-error-output';

export function useErrorHandling(): (<T extends unknown[], R>(fn: (...args: T) => Promise<void>, ...params: T) => Promise<void>)[] {
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);

    async function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<void>, ...params: T): Promise<void> {
        try {
            await fn(...params);
        } catch (error) {
            setSnackbarOptions({
                message: String(error),
                snackBarProps: { open: true, autoHideDuration: 6000 },
                alertProps: { severity: 'error' },
            });
        }
    }

    return [withErrorHandling];
}

export function useErrorHandlingV2(): (<T extends unknown[], R>(
    fn: (...args: T) => Promise<void>,
    errorMessage: string,
    successMessage?: string,
    ...params: T
) => Promise<void>)[] {
    const [snackbarOptions, setSnackbarOptions] = useRecoilState(SnackBarOptions);

    async function withErrorHandlingV2<T extends unknown[], R>(
        fn: (...args: T) => Promise<void>,
        errorMessage: string,
        successMessage?: string,
        ...params: T
    ): Promise<void> {
        try {
            await fn(...params);
            if (successMessage) {
                setSnackbarOptions({
                    message: successMessage,
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'success' },
                });
            }
        } catch (error: AxiosError | any) {
            setSnackbarOptions({
                message: SnackbarErrorOutput(error) ? SnackbarErrorOutput(error) : errorMessage,
                snackBarProps: { open: true, autoHideDuration: 6000 },
                alertProps: { severity: 'error' },
            });
        }
    }

    return [withErrorHandlingV2];
}
