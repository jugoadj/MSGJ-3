
import { Typography, CircularProgress, Box } from "@mui/material";


const SuspenseLoader = () => {

    return (
       <Box>
    <CircularProgress size={40} style={{ color: 'black' }} />
    <p>loading ...</p>
</Box>
    )
}

export default SuspenseLoader;