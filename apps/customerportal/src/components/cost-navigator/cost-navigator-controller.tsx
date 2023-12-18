import React, { useEffect, useState } from 'react';
import { QuicksightReportsController } from '../quicksight-reports-controller/quicksight-reports-controller';

export type ICostNavigatorControllerProps = React.PropsWithChildren;

const CostNavigatorController: React.FC<ICostNavigatorControllerProps> = (props) => {
    return <QuicksightReportsController folderNames={['navigator']} />;
};
export { CostNavigatorController };
