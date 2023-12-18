import React from 'react';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@vegaplatformui/styling';
import { TagManagerTable, VegaTag } from '@vegaplatformui/sharedcomponents';
import { Add, DeleteSweep } from '@mui/icons-material';

export interface ITagManagerCardProps {
    setSelectedTags: React.Dispatch<React.SetStateAction<VegaTag[]>>;
    selectedTags: VegaTag[];
    tags: VegaTag[];
    isLoading: boolean;
    onOpenTagManagerDialog: () => void;
    onClickEditTag: (tag: VegaTag) => void;
    onClickDeleteTag: (tag: VegaTag) => void;
    onClickDeleteTags: (tags: VegaTag[]) => void;
}

const TagManagerCard: React.FC<ITagManagerCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container direction={'column'}>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography fontWeight={600} variant={'h5'}>
                                Tags
                            </Typography>
                        </Grid>
                        <Grid xs={6} item container justifyContent={'flex-end'}>
                            <Stack spacing={1} direction={'row'}>
                                {props.selectedTags.length > 1 && (
                                    <Button
                                        startIcon={<DeleteSweep />}
                                        className={cx(classes.TagButtons)}
                                        variant={'contained'}
                                        onClick={() => {
                                            props.onClickDeleteTags(props.selectedTags);
                                        }}
                                    >
                                        Delete Selected Tags
                                    </Button>
                                )}
                                <Button
                                    startIcon={<Add />}
                                    className={cx(classes.TagButtons)}
                                    variant={'contained'}
                                    onClick={props.onOpenTagManagerDialog}
                                >
                                    Tag
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction={'row'} justifyContent={'space-between'}>
                        <Grid xs={6} item>
                            <Typography variant={'subtitle1'} className={cx(classes.Subtitle)}>
                                Manage your Vega Tags
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <TagManagerTable
                    tags={props.tags}
                    setSelectedTags={props.setSelectedTags}
                    selectedTags={props.selectedTags}
                    isLoading={props.isLoading}
                    onClickDeleteTag={props.onClickDeleteTag}
                    onClickEditTag={props.onClickEditTag}
                />
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ITagManagerCardProps>()((theme, props) => ({
    ButtonPlaceHolder: {
        height: '2.25rem',
    },
    Subtitle: {
        paddingBottom: '1rem',
    },
    TagButtons: {
        textTransform: 'none',
    },
}));

export { TagManagerCard };
