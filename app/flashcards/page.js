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
  Skeleton
} from "@mui/material";

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      if (!user) {
        setLoading(false); // Ensure loading is set to false if user is not available
        return;
      }
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
      } finally {
        setLoading(false); // End loading after fetch operation
      }
    };

    fetchFlashcardSets();
  }, [user]);

  return (
    <Box
      sx={{
        backgroundColor: "#FF9913",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            my: 4,
            width: "100%",
            height: "auto",
            position: "relative",
            border: "10px solid #71363A",
            borderRadius: "8px",
            backgroundColor: '#E89149',
            padding: "16px",
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontFamily: "impact" }} gutterBottom>
            Your Pawcard Sets
          </Typography>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={140} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Grid>
              ))}
            </Grid>
          ) : flashcardSets.length > 0 ? (
            <Grid container spacing={3}>
              {flashcardSets.map((set) => (
                <Grid item xs={12} sm={6} md={4} key={set.id}>
                  <Card sx={{ border: "8px solid #8A3324", borderRadius: "8px", height: "100%" }}>
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
                        sx={{
                          color: '#B06500', // Dark orange text
                          borderColor: '#B06500', // Dark orange border
                          '&:hover': {
                            color: '#FFFFFF', // White text on hover
                            borderColor: '#E67E22', // Slightly lighter dark orange border on hover
                            backgroundColor: '#FF8C00' // Dark orange background on hover
                          }
                        }}
                        onClick={() => router.push(`/flashcards/${set.id}`)}
                      >
                        View Pawcards
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              <Typography variant="body1">
                You don't have any pawcard sets yet.
              </Typography>
              <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <iframe
                  src="https://lottie.host/embed/d2cf3a3d-afec-4371-b5fc-646a9cb9a0e0/Wjcw5Ixi8Y.json"
                  style={{ border: 'none', width: '100%', maxWidth: '500px', height: '500px' }}
                ></iframe>
              </Container>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
