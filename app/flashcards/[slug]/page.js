"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust the import based on your file structure
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

export default function FlashcardsPage({ params }) {
  return (
    <div>
      hi
      {params.slug}
    </div>
  );
}
