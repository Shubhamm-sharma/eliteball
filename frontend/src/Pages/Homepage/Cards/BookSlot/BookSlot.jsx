import React from "react";
import "./bookSlot.css";
import { Col, Row } from "react-bootstrap";
import { Grid, Typography } from "@mui/material";
import SlotCard from "./SlotCard/SlotCard";

const BookSlot = () => {
  return (
    <Grid px={3} className="bookSlotMain">
      <Grid mt={5}>
        <Grid py={3}>
          <Typography color={"white"} variant="h3">
            Slots List
          </Typography>
        </Grid>
        <Grid>
          <SlotCard />
        </Grid>
      </Grid>
      <Grid>
        <Typography color={"white"} variant="h3">
          Recently Booked
        </Typography>
      </Grid>
    </Grid>
  );
};

export default BookSlot;
