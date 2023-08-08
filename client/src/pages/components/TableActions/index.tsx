import { Tooltip, IconButton, useTheme, Grid } from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { useEffect, useState } from 'react';

type TableActionsType = {
    nameModels: string;
    handleViewModel?: () => void;
    handleEditModel?: () => void;
    handleDeleteModel?: () => void;
    attributesProps?: string;
};
const TableActions = ({
    handleViewModel,
    handleEditModel,
    handleDeleteModel,
    nameModels,
    attributesProps
}: TableActionsType) => {
    const theme = useTheme();
    const str = attributesProps + '';
    const onView = () => {
        if (str.includes('offView') || !handleViewModel) {
            return false;
        }
        return true;
    };

    const onEdit = () => {
        if (str.includes('offEdit') || !handleEditModel) {
            return false;
        }
        return true;
    };

    const onDelete = () => {
        if (str.includes('offDelete') || !handleDeleteModel) {
            return false;
        }
        return true;
    };

    return (
        <>
            {onView() && (
                <Tooltip title={`View ${nameModels}`} arrow>
                    <IconButton
                        onClick={handleViewModel}
                        sx={{
                            '&:hover': { background: theme.colors.warning.lighter },
                            color: theme.palette.warning.main
                        }}
                        color='inherit'
                        size='small'
                    >
                        <VisibilityTwoToneIcon fontSize='small' />
                    </IconButton>
                </Tooltip>
            )}
            {onEdit() && (
                <Tooltip title={`Edit ${nameModels}`} arrow>
                    <IconButton
                        onClick={handleEditModel}
                        sx={{
                            '&:hover': { background: theme.colors.primary.lighter },
                            color: theme.palette.primary.main
                        }}
                        color='inherit'
                        size='small'
                    >
                        <EditTwoToneIcon fontSize='small' />
                    </IconButton>
                </Tooltip>
            )}
            {onDelete() && (
                <Tooltip title={`Delete ${nameModels}`} arrow>
                    <IconButton
                        onClick={handleDeleteModel}
                        sx={{
                            '&:hover': { background: theme.colors.error.lighter },
                            color: theme.palette.error.main
                        }}
                        color='inherit'
                        size='small'
                    >
                        <DeleteTwoToneIcon fontSize='small' />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
};

export default TableActions;
