import { AwsLogo, AzureLogo, GcpLogo } from '@vegaplatformui/sharedassets';
import { Stack, Tooltip } from '@mui/material';
import { useCommonStyles } from '@vegaplatformui/styling';
import { capitalizeFirstLetter } from '@vegaplatformui/utils';

export interface ICloudProviderIcon {
    cloudProvider: string;
}
const CloudProviderIcon: React.FC<ICloudProviderIcon> = (props) => {
    const { cx, classes } = useCommonStyles();

    return (
        <>
            {props.cloudProvider?.toLowerCase() === 'aws' ? (
                <Tooltip title={'AWS'}>
                    <Stack>
                        <AwsLogo className={cx(classes.CloudProviderTableIcon)} />
                    </Stack>
                </Tooltip>
            ) : props.cloudProvider?.toLowerCase() === 'gcp' ? (
                <Tooltip title={capitalizeFirstLetter('GCP')}>
                    <Stack>
                        <GcpLogo className={cx(classes.CloudProviderTableIcon)} />
                    </Stack>
                </Tooltip>
            ) : props.cloudProvider?.toLowerCase() === 'azure' ? (
                <Tooltip title={capitalizeFirstLetter('AZURE')}>
                    <Stack>
                        <AzureLogo className={cx(classes.CloudProviderTableIcon)} />
                    </Stack>
                </Tooltip>
            ) : (
                ''
            )}
        </>
    );
};

export interface ICloudProviderIcons {
    cloudProviders: string[] | null;
}

const CloudProviderIcons: React.FC<ICloudProviderIcons> = (props) => {
    const { cx, classes } = useCommonStyles();
    return (
        <Stack direction={'row'} spacing={1}>
            {props.cloudProviders?.find((cloudProvider) => cloudProvider !== null && cloudProvider?.toLowerCase() === 'aws') ? (
                <Tooltip title={capitalizeFirstLetter('aws')}>
                    <Stack>
                        <AwsLogo className={cx(classes.CloudProviderTableIcon)} />
                    </Stack>
                </Tooltip>
            ) : (
                ''
            )}
            {props.cloudProviders?.find((cloudProvider) => cloudProvider?.toLowerCase() === 'gcp') ? (
                <Tooltip title={capitalizeFirstLetter('gcp')}>
                    <Stack>
                        <GcpLogo className={cx(classes.CloudProviderTableIcon)} />
                    </Stack>
                </Tooltip>
            ) : (
                ''
            )}
            {props.cloudProviders?.find((cloudProvider) => cloudProvider?.toLowerCase() === 'azure') ? (
                <Tooltip title={capitalizeFirstLetter('azure')}>
                    <Stack>
                        <AzureLogo className={cx(classes.CloudProviderTableIcon)} />
                    </Stack>
                </Tooltip>
            ) : (
                ''
            )}
        </Stack>
    );
};

export { CloudProviderIcon, CloudProviderIcons };
