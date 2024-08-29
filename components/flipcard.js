import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import React from "react";
import styles from "./Flipcard.module.css"; // Import the CSS module

const FlipCard = ({ children }) => {
  return (
    <Card sx={{ width: "100%", height: "100%", position: "relaitve" }}>
      <CardActionArea sx={{ width: "100%", height: "100%", padding: "1rem" }}>
        <CardContent className={styles.cardContent}>
          <Typography variant="h5" component="div">
            {children}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FlipCard;
