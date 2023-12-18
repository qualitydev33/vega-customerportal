import { Stack, Skeleton } from '@mui/material';

export interface ITableSkeletonProps {
    rows?: number;
}

const TableSkeleton = ({ rows = 10 }: ITableSkeletonProps) => {
    return (
        <Stack spacing={1}>
            {[...Array(rows)].map((_, index) => (
                <Skeleton key={index} variant='rectangular' height={44} />
            ))}
        </Stack>
    );
};

export { TableSkeleton };
