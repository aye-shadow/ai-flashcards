"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const flashcardSetsCollectionRef = collection(
          db,
          `flashcards/${user.id}/flashcardSets`
        );
        const flashcardSetsSnapshot = await getDocs(flashcardSetsCollectionRef);

        const flashcardSetsData = flashcardSetsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlashcardSets(flashcardSetsData);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      }
    };

    if (user) {
      fetchFlashcardSets();
    }
  }, [user]);

  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Flashcard Sets
        </Typography>
        {flashcardSets.length > 0 ? (
          <Grid container spacing={3}>
            {flashcardSets.map((set) => (
              <Grid item xs={12} sm={6} md={4} key={set.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {set.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {set.prompt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created on: {new Date(set.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => router.push(`/flashcards/${set.id}`)}
                    >
                      View Flashcards
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            You don't have any flashcard sets yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
