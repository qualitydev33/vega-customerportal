import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { CommonPageHeader, QuicksightReportLoading, ViewPortHeightAndWidth } from '../recoil/atom';
import { useRecoilState, useRecoilValue } from 'recoil';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DashboardContentOptions, DashboardFrame, FrameOptions, Parameter, createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

export interface IQuickSightReportProps {
    dashboardUrl: string;
    dashboardId: string;
    isTabbed: boolean;
}

export const QuicksightReport: React.FC<IQuickSightReportProps> = (props) => {
    const [dashboardLoading, setDashboardLoading] = useRecoilState(QuicksightReportLoading);
    const viewPortHeightAndWidth = useRecoilValue(ViewPortHeightAndWidth);
    const commonPageHeader = useRecoilValue(CommonPageHeader);
    const { cx, classes } = useStyles({ viewPortHeightAndWidth, commonPageHeader, isTabbed: props.isTabbed });
    const ref = useRef(null);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const [dashboardFrame, setDashboardFrame] = useState<DashboardFrame | undefined>(undefined);

    useEffect(() => {
        if (ref.current) {
            setContainer(ref.current);
        }
    }, []);

    const frameOptions: DashboardContentOptions = {
        url: decodeURIComponent(props.dashboardUrl),
        height: '100%',
        width: '100%',
        withIframePlaceholder: false,
        resizeHeightOnSizeChangedEvent: false,
        scrolling: 'no',
        locale: 'en-US',
        footerPaddingEnabled: true,
        container: document.getElementById('qsContainer'),
        printEnabled: true,
    };

    const contentOptions: DashboardContentOptions = {
        toolbarOptions: {
            export: true,
            reset: true,
            undoRedo: true,
            bookmarks: true,
        },
        locale: navigator.language,
    };

    useEffect(() => {
        if (!dashboardFrame) {
            const embedDashboard = async (container: HTMLElement) => {
                const { embedDashboard } = await createEmbeddingContext();

                const df = await embedDashboard({ ...frameOptions, container: container }, contentOptions);

                setDashboardFrame(df);
            };

            if (container) {
                embedDashboard(container);
            }
        } else {
            dashboardFrame?.navigateToDashboard({ dashboardId: props.dashboardId });
            setDashboardLoading(false);
        }
    }, [container, props.dashboardId]);

    return <div className={cx(classes.ReportContainer)} ref={ref}></div>;
};

interface IQuicksightStyles {
    commonPageHeader: React.ReactNode;
    isTabbed: boolean;
    viewPortHeightAndWidth: {
        height: number;
        width: number;
    };
}

const useStyles = makeStyles<IQuicksightStyles>()((theme, input) => ({
    ReportContainer: {
        overflowY: 'hidden',
        /**
         * Height set here because Quicksight doesn't fill to the container its in when set to 100%, numbers are the total height of the viewport minus
         * the static sizes of the Appbar and Page header if it is there.
         */
        height: input.commonPageHeader ? `calc(100vh - ${input.isTabbed ? '13rem' : '9rem'})` : `calc(100vh - ${input.isTabbed ? '10rem' : '6rem'})`,
        quicksightEmbeddingIframe: {
            quicksightEmbeddingIframe_clickableQuicksightAttribution: {
                display: 'none',
            },
        },
    },
}));
