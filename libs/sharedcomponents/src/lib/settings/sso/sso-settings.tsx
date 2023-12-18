import { Button, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { SSOOpenIDCreateForm, SSOSamlCreateForm } from '@vegaplatformui/sharedcomponents';
import { makeStyles } from '@vegaplatformui/styling';
import { OpenIDLogo, SamlLogo } from '@vegaplatformui/sharedassets';
import { IUserSettingSSO, ISSONameIDPolicyFormat, SSOTypeEnum } from '@vegaplatformui/models';

export interface ISSOSettingsProps {
    nameIDPolicyFormatOptions: ISSONameIDPolicyFormat[];
    onCreate: (data: IUserSettingSSO, type: SSOTypeEnum, byXml: boolean) => void;
}

const SSOSettings: React.FC<ISSOSettingsProps> = (props) => {
    const { cx, classes } = useStyles();
    const theme = useTheme();

    const [hasSSO, setHasSSO] = useState(false);
    const [selectedSSOType, setSelectedSSOType] = useState<SSOTypeEnum | null>(null);

    const onClickSSOButton = (type: SSOTypeEnum) => {
        setSelectedSSOType(type);
    };
    const handleBack = useCallback(() => {
        setHasSSO(false);
        setSelectedSSOType(null);
    }, []);

    return (
        <>
            {!hasSSO && (
                <Stack alignItems={'start'} marginBottom={2}>
                    <Stack spacing={0.5}>
                        <Typography variant='body1' fontWeight={600}>
                            Create a new SSO configuration
                        </Typography>
                        <Typography variant='body2' color={theme.palette.grey[600]}>
                            Select a method to set up SSO.
                        </Typography>
                    </Stack>
                    <Stack direction={'row'} columnGap={2} marginTop={4}>
                        <IconButton
                            className={`${cx(classes.SSOButton)} ${selectedSSOType === SSOTypeEnum.OPENID && cx(classes.IsSelectedSSOButton)}`}
                            onClick={() => onClickSSOButton(SSOTypeEnum.OPENID)}
                        >
                            <img src={OpenIDLogo} alt='saml-logo' />
                        </IconButton>
                        <IconButton
                            className={`${cx(classes.SSOButton)} ${selectedSSOType === SSOTypeEnum.SAML && cx(classes.IsSelectedSSOButton)}`}
                            onClick={() => onClickSSOButton(SSOTypeEnum.SAML)}
                        >
                            <img src={SamlLogo} alt='saml-logo' />
                        </IconButton>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'flex-end'} width={'100%'}>
                        <Button onClick={() => setHasSSO(true)} variant='contained' disabled={!selectedSSOType}>
                            Next Step
                        </Button>
                    </Stack>
                </Stack>
            )}

            {hasSSO && selectedSSOType === SSOTypeEnum.OPENID && <SSOOpenIDCreateForm onCreate={props.onCreate} onBack={handleBack} />}
            {hasSSO && selectedSSOType === SSOTypeEnum.SAML && (
                <SSOSamlCreateForm nameIDPolicyFormatOptions={props.nameIDPolicyFormatOptions} onCreate={props.onCreate} onBack={handleBack} />
            )}
        </>
    );
};

const useStyles = makeStyles()((theme) => ({
    SSOButton: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: theme.spacing(1),
        height: '72px',
        width: '207px',
        borderColor: theme.palette.grey['200'],
    },
    IsSelectedSSOButton: {
        borderColor: theme.palette.primary.main,
    },
}));

export { SSOSettings };
