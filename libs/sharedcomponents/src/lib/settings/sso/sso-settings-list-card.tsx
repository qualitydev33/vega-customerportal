import React, { useState } from 'react';
import { Card, CardContent, Stack, Typography, useTheme } from '@mui/material';
import { IUserSettingSSO, ISSONameIDPolicyFormat } from '@vegaplatformui/models';
import { SSOSettingsListItem } from '@vegaplatformui/sharedcomponents';
import { makeStyles } from '@vegaplatformui/styling';

interface SSOSettingsDetailCardProps {
    idpList: IUserSettingSSO[];
    nameIDPolicyFormatOptions: ISSONameIDPolicyFormat[];
    onUpdate: (data: IUserSettingSSO) => void;
    onDelete: (data: string) => void;
    onGenerateXMLMetaData: (url: string, filename: string) => void;
}

const SSOSettingsListCard: React.FC<SSOSettingsDetailCardProps> = (props) => {
    const theme = useTheme();
    const { cx, classes } = useStyles();
    const [expandedIdxList, setExpandedIdxList] = useState<number[]>([]);

    const onExpand = (idx: number) => {
        if (expandedIdxList.includes(idx)) {
            const filtered = expandedIdxList.filter((x) => x !== idx);
            setExpandedIdxList(filtered);
        } else {
            setExpandedIdxList([...expandedIdxList, idx]);
        }
    };
    return (
        <Stack marginTop={2}>
            <Card elevation={0}>
                <CardContent>
                    <Stack spacing={0.5}>
                        <Typography variant='body1' fontWeight={600}>
                            Configured SSO
                        </Typography>
                        <Typography variant='body2' color={theme.palette.grey[600]}>
                            Manage previously configured SSO.
                        </Typography>
                    </Stack>
                    <Stack marginTop={2}>
                        {!props.idpList.length && (
                            <Typography variant='body2' className={cx(classes.EmptySSODescription)}>
                                You don't have any SSO configured.
                            </Typography>
                        )}
                        {props.idpList.map((x, idx) => (
                            <React.Fragment key={`${x.alias}_${idx}`}>
                                <SSOSettingsListItem
                                    idx={idx}
                                    expandedIdxList={expandedIdxList}
                                    ssoItem={x}
                                    nameIDPolicyFormatOptions={props.nameIDPolicyFormatOptions}
                                    onExpand={onExpand}
                                    onSubmit={props.onUpdate}
                                    onDelete={props.onDelete}
                                    onGenerateXMLMetaData={props.onGenerateXMLMetaData}
                                />
                            </React.Fragment>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};

const useStyles = makeStyles()((theme) => ({
    EmptySSODescription: {
        color: theme.palette.grey[600],
        textAlign: 'center',
        marginTop: theme.spacing(2),
        paddingBlock: theme.spacing(5),
    },
}));

export { SSOSettingsListCard };
