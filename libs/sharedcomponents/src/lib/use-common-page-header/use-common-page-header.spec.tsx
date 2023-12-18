import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useCommonPageHeader from './use-common-page-header';

describe('useCommonPageHeader', () => {
    it('should render successfully', () => {
        const { result } = renderHook(() => useCommonPageHeader());

        expect(result.current.count).toBe(0);

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });
});
