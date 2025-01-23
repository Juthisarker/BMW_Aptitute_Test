import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ApiService } from '../../services/api.service';

const apiService = new ApiService();

const DetailsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await apiService.fetchRecordById('allCars', id!);
                setDetails(data);
            } catch (err) {
                setError('Failed to load details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
                    Back to List
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 3 }}
            >
                Back to List
            </Button>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Car Details
                </Typography>

                <Grid container spacing={2}>
                    {details && Object.entries(details).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </Typography>
                            <Typography>
                                {value?.toString() || 'N/A'}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default DetailsPage;