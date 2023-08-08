import { Box, FormControl, InputLabel, Card, Select, MenuItem, Grid, TextField, InputAdornment } from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

type StatusType = {
    id: string;
    name: string;
};

type RolesType = {
    id: string;
    name: string;
};

type TableFilterType = {
    handleSearchStrChange: (e: any) => void;
    handleStatusChange: (e: any) => void;
    handleRoleChange: (e: any) => void;

    filters: {
        status: string | null;
        role: string | null;
        searchStr: string;
    };
    statusOptions: StatusType[];
    roleOptions: RolesType[];
};

function TableFilter({
    handleSearchStrChange,
    handleStatusChange,
    handleRoleChange,
    filters,
    statusOptions,
    roleOptions
}: TableFilterType) {
    return (
        <>
            <Card sx={{ p: 1, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                        <Box p={1}>
                            <TextField
                                sx={{ m: 0 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SearchTwoToneIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={handleSearchStrChange}
                                placeholder={'Search ...'}
                                value={filters.searchStr}
                                fullWidth
                                variant='outlined'
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <Box p={1}>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel>{'Role'}</InputLabel>
                                <Select value={filters.role || 'all'} onChange={handleRoleChange} label={'Status'}>
                                    {roleOptions.map((roleOption) => (
                                        <MenuItem key={roleOption.id} value={roleOption.id}>
                                            {roleOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <Box p={1}>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel>{'Status'}</InputLabel>
                                <Select value={filters.status || 'all'} onChange={handleStatusChange} label={'Status'}>
                                    {statusOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
}

export default TableFilter;
