import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { CloudHeroesSummary } from '@vegaplatformui/sharedcomponents';
import { useKeycloak } from '@react-keycloak-fork/web';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudHeroesProps {}

const CloudHeroesController: React.FC<ICloudHeroesProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const { keycloak } = useKeycloak();

    return <CloudHeroesSummary keycloak={keycloak} />;
};

const useStyles = makeStyles<ICloudHeroesProps>()((theme, props) => ({}));

export { CloudHeroesController };
