import { Typography, type TypographyProps } from '@mui/material';
import { ReactNode } from 'react';
// import NanoClamp from 'nanoclamp';

type TableTypographyProps = {
    children?: string | ReactNode;
} & TypographyProps;

const TableTypography = ({ children, ...otherProps }: TableTypographyProps) => {
    return (
        <>
            <Typography
                variant='body1'
                fontWeight='bold'
                color='text.primary'
                gutterBottom
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical'
                }}
                style={{ wordWrap: 'break-word' }}
                {...otherProps}
            >
                {children}
            </Typography>
        </>
    );
};

export default TableTypography;
