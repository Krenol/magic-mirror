import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import errorImage from "../../assets/error.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { cardStyle } from "./style";

type Props = {
  message: string;
  details: string;
};

export const ErrorCard = ({ message, details }: Props) => {
  const navigate = useNavigate();

  const back = () => navigate(-1);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card sx={cardStyle}>
        <CardMedia
          component="img"
          src={errorImage}
          alt="Error"
          loading="lazy"
          height={200}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {message}
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{details}</Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" onClick={back}>
            Back
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
