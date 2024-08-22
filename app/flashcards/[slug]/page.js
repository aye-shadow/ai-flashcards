"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust the import based on your file structure
import { Container, Typography, Box, Grid, Skeleton } from "@mui/material";
import ReactFlipCard from "reactjs-flip-card";
import FlipCard from "@/components/flipcard";
import { useUser } from "@clerk/nextjs";

function cleanSlug(slug) {
  // Decode the slug to replace '%20' with ' '
  const cleanedSlug = decodeURIComponent(slug);
  // Tag the cleaned slug
  const taggedSlug = `${cleanedSlug}`;
  return taggedSlug;
}

export default function FlashcardSetPage({ params }) {
  const [flashcards, setFlashcards] = useState([]);
  const [noFlashcardsFound, setNoFlashcardsFound] = useState(false);
  const [loading, setLoading] = useState(true); // Start in loading state
  const slug = cleanSlug(params.slug); // Get the flashcardSetId from the URL
  const { user } = useUser();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!slug || !user) {
        setLoading(false); // Ensure loading is set to false if conditions aren't met
        return;
      }
      try {
        const flashcardsCollectionRef = collection(
          db,
          `flashcards/${user.id}/flashcardSets/${slug}/flashcards`
        );
        const flashcardsSnapshot = await getDocs(flashcardsCollectionRef);
        const flashcardsData = flashcardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (flashcardsData.length === 0) {
          console.log("No flashcards found");
          setNoFlashcardsFound(true); // Set noFlashcardsFound state to true
        } else {
          setFlashcards(flashcardsData); // Proceed to set the flashcards state with the fetched data
          setNoFlashcardsFound(false); // Ensure noFlashcardsFound state is set to false
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false); // End loading after fetch operation
      }
    };

    fetchFlashcards();
  }, [slug, user]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {slug}
        </Typography>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Grid>
            ))}
          </Grid>
        ) : noFlashcardsFound ? (
          <Typography variant="body1">
            No flashcards available in this set.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ReactFlipCard
                  containerStyle={{
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    border: "4px solid #8A3324",
                    borderRadius: "8px",
                  }}
                  flipTrigger={"onClick"}
                  frontComponent={<FlipCard>{flashcard.question}</FlipCard>}
                  backComponent={<FlipCard>{flashcard.answer}</FlipCard>}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
