import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { ErrorScreen } from './error-screen';
import { GeminiMenuItem } from '@vegaplatformui/sharedassets';
import { useSetRecoilState } from 'recoil';
import { ApplicationError } from '@vegaplatformui/sharedcomponents';

export interface ICustomErrorBoundaryProps extends React.PropsWithChildren {
    menuItems: GeminiMenuItem[];
    setSidebarMenuItems: React.Dispatch<React.SetStateAction<GeminiMenuItem[]>>;
}

const CustomErrorBoundary: React.FC<ICustomErrorBoundaryProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [resetError, setResetError] = React.useState(false);
    const location = useLocation();
    const setApplicationError = useSetRecoilState(ApplicationError);

    const onError = (error: Error, info: { componentStack: string }) => {
        //ToDo log to external service
        setApplicationError(error);
    };

    return (
        <ErrorBoundary
            FallbackComponent={(fallbackProps) => (
                <ErrorScreen menuItems={props.menuItems} setSidebarMenuItems={props.setSidebarMenuItems} {...fallbackProps} />
            )}
            onReset={(props) => {
                setResetError(false);
            }}
            onError={onError}
            resetKeys={[resetError, location.pathname]}
        >
            {props.children}
        </ErrorBoundary>
    );
};

const useStyles = makeStyles<ICustomErrorBoundaryProps>()((theme, props) => ({}));

export { CustomErrorBoundary };
