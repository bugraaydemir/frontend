import { Box } from "@mui/material";

const UserImage = ({ image, size = "80px", className}) => {
    return(
        <Box width={size} height ={size} sx={{cursor:"pointer"}}>
            <img style = {{objectFit: "cover", borderRadius:"50%"}}
            className={className}
            width = {size} 
            height = {size} 
            alt="User"
            src ={`http://localhost:3001/assets/${image}`}
            />
        </Box>
    )
} 
export default UserImage;