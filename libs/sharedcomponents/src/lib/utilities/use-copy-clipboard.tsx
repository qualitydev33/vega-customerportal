
import { useRecoilState } from 'recoil';
import { SnackBarOptions } from '../recoil/atom';

export function useCopyClipboard() {
    const [, setSnackbarOptions] = useRecoilState(SnackBarOptions);
    
    function withCopyClipboard(data: string) {
        navigator.clipboard.writeText(data)
        .then(() => {
            if (!data.length) {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'warning' },
                    message: 'The copied content is empty'
                });
            } else {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'success' },
                    message: 'Copied to clipboard!'
                });
            }
        })
        .catch((error) => {
            setSnackbarOptions({
                snackBarProps: { open: true, autoHideDuration: 6000 },
                alertProps: { severity: 'error' },
                message: `Failed to copy: ${error}`,
            });
        });
    }

    return [withCopyClipboard]
};