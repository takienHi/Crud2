import { Box, FormControl, InputLabel, Card, Select, MenuItem, Grid, TextField, InputAdornment } from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

type StatusType = {
    id: string;
    name: string;
};
type TableFilterType = {
    handleSearchStrChange: (e: any) => void;
    handleStatusChange: (e: any) => void;
    filters: {
        status: string | null;
        searchStr: string;
    };
    statusOptions: StatusType[];
};

function TableFilter({ handleSearchStrChange, handleStatusChange, filters, statusOptions }: TableFilterType) {
    return (
        <>
            <Card sx={{ p: 1, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={8}>
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
                    <Grid item xs={12} sm={6} md={4}>
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
