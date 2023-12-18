import React, { useState, useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CommonPageHeader, ViewPortHeightAndWidth } from '../recoil/atom';
import { Grid, Paper } from '@mui/material';
import { CustomCommonPageHeader, ICustomCommonPageHeaderProps } from '../custom-common-page-header/custom-common-page-header';

export function useCommonPageHeader(props: ICustomCommonPageHeaderProps) {
    const setCommonPageHeader = useSetRecoilState(CommonPageHeader);
    const [viewPortHeightAndWidth, setViewPortHeightAndWidth] = useRecoilState(ViewPortHeightAndWidth);

    useEffect(() => {
        setCommonPageHeader(<CustomCommonPageHeader {...props} />);

        //clean up common page header
        return () => {
            setCommonPageHeader(undefined);
            /*setViewPortHeightAndWidth({ height: 0, width: 0 });*/
        };
    }, [props]);
}

export default useCommonPageHeader;
