import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import turfPic from "../../../../../assets/Images/SlotCard/turf.jpeg";
import "../bookSlot.css";

export default function SlotCard() {
  return (
    <Card sx={{ maxWidth: 300, borderRadius: 3 }}>
      <CardMedia sx={{ height: 140 }} image={turfPic} title="green iguana" />
      <CardContent>
        <Typography
          textAlign={"center"}
          gutterBottom
          variant="h5"
          component="div"
        >
          Hi-Score
        </Typography>
        <Typography
          textAlign={"justify"}
          variant="body2"
          color="text.secondary"
        >
          Hi Score Turf: Where the game's highest moments meet the ground's
          finest quality. Step onto Hi Score, where every play is a victory and
          every step is a win.
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <button class="cssbuttons-io-button">
          Book
          <div class="icon">
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </button>
      </CardActions>
    </Card>
  );
}
