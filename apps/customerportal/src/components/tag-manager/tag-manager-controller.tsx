import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useKeycloak } from '@react-keycloak-fork/web';
import {
    defaultVegaTableControl,
    SnackBarOptions,
    TagManagerCard,
    TagManagerDialog,
    TagManagerSummaryCard,
    vegaTableControls,
    VegaTag,
} from '@vegaplatformui/sharedcomponents';
import { makeStyles } from '@vegaplatformui/styling';
import { Stack } from '@mui/material';

export type ITagManagerControllerProps = React.PropsWithChildren;

const TagManagerController: React.FC<ITagManagerControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [tags, setTags] = useState<VegaTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<VegaTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const { keycloak } = useKeycloak();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [tagToEdit, setTagToEdit] = React.useState<VegaTag | undefined>(undefined);
    const [tableControls, setTableControls] = useRecoilState(vegaTableControls);

    useEffect(() => {
        setTableControls((controls) => {
            return [
                ...controls,
                {
                    key: 'tag-manager-table',
                    value: { ...defaultVegaTableControl },
                },
            ];
        });
        return () => {
            setTableControls((controls) => {
                return controls.filter((control) => control.key !== 'tag-manager-table');
            });
        };
    }, []);

    useEffect(() => {
        setTags([
            {
                id: '1',
                key: 'tag1',
                values: ['value1', 'value2'],
                resources: '[]',
                required: false,
                description: 'This is a tag',
                createdAt: '2021-01-01',
            },
            {
                id: '2',
                key: 'tag2',
                values: ['value1', 'value2'],
                resources: '[]',
                required: true,
                description: 'This is a tag',
                createdAt: '2021-01-01',
            },
        ]);
        setIsLoading(false);
    }, [keycloak.token, setSnackbarOptions]);

    const onOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const onCloseDialog = () => {
        setIsDialogOpen(false);
        setTagToEdit(undefined);
    };

    const onClickEditTag = (tag: VegaTag) => {
        setTagToEdit(tag);
        setIsDialogOpen(true);
    };

    const onClickDeleteTag = (tag: VegaTag) => {
        console.log('delete tag', tag);
    };

    const onClickDeleteTags = (tags: VegaTag[]) => {
        console.log('delete tags', tags);
    };

    const onSubmitTagForm = (data: VegaTag) => {
        console.log('submit', data);
    };

    return (
        <>
            <TagManagerDialog onSubmitTagForm={onSubmitTagForm} isDialogOpen={isDialogOpen} onCloseDialog={onCloseDialog} vegaTagToEdit={tagToEdit} />
            <Stack spacing={1}>
                <TagManagerSummaryCard tags={tags} />
                <TagManagerCard
                    onClickDeleteTags={onClickDeleteTags}
                    selectedTags={selectedTags}
                    tags={tags}
                    setSelectedTags={setSelectedTags}
                    isLoading={isLoading}
                    onOpenTagManagerDialog={onOpenDialog}
                    onClickDeleteTag={onClickDeleteTag}
                    onClickEditTag={onClickEditTag}
                />
            </Stack>
        </>
    );
};

const useStyles = makeStyles<ITagManagerControllerProps>()((theme, props) => ({}));

export { TagManagerController };
