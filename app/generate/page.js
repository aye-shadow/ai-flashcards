"use client";
import * as React from "react";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import ReactFlipCard from "reactjs-flip-card";
import FlipCard from "@/components/flipcard";
import { db } from "@/firebase"; // Adjust the import based on your file structure
import { CircularProgress } from '@mui/material';

export default function Generate() {
  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();
  const { user } = useUser();

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/generates", {
        method: "POST",
        body: text,
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setFlashcards(data);
      // console.log(flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
    setIsLoading(false); // End loading
  };

  const userCheck = async () => {
    // Check if the user-id document exists
    const docRef = doc(db, "flashcards", `${user.id}`);
    let userDocRef;

    try {
      userDocRef = await getDoc(docRef);
      if (!userDocRef.exists()) {
        // Create user-id document in Firestore
        await setDoc(docRef, {
          email: user.emailAddresses[0].emailAddress || "noemail@example.com", // Example field
        });

        // Fetch the newly created document to return it
        userDocRef = await getDoc(docRef);
      }
    } catch (error) {
      console.error(
        "Error with checking user existence. Maybe you don't exist. Check and try again later.",
        error
      );
      return null;
    }

    return userDocRef;
  };

  const flashcardCollectionCheck = async () => {
    const flashcardSetsCollectionRef = collection(
      db,
      `flashcards/${user.id}/flashcardSets`
    );
    const flashcardSetId = name; // Replace with the actual flashcardSetId you want to check or create
    const flashcardSetDocRef = doc(flashcardSetsCollectionRef, flashcardSetId);
    const flashcardSetDoc = await getDoc(flashcardSetDocRef);

    // Check if the flashcardSet exists
    if (!flashcardSetDoc.exists()) {
      // If flashcardSet does not exist, create it
      await setDoc(flashcardSetDocRef, {
        prompt: text, // Example field, replace with your actual prompt
        createdAt: new Date().toISOString(),
      });

      console.log(
        `flashcardSets subcollection was empty or flashcardSet with ID ${name} did not exist. Created it.`
      );
    } else {
      console.log(`flashcardSet with ID ${name} already exists.`);
    }

    // Add flashcards to the flashcards collection with custom IDs
    const flashcardsCollectionRef = collection(
      flashcardSetDocRef,
      "flashcards"
    );

    for (let i = 0; i < flashcards.length; i++) {
      const flashcard = flashcards[i];
      const flashcardId = `flashcard${i + 1}`; // Custom flashcard ID like flashcard1, flashcard2, etc.

      const flashcardDocRef = doc(flashcardsCollectionRef, flashcardId);
      await setDoc(flashcardDocRef, {
        question: flashcard.front,
        answer: flashcard.back,
        createdAt: new Date().toISOString(),
      });
    }

    console.log(
      `Added ${flashcards.length} flashcards to flashcardSet with ID ${name}.`
    );
  };

  const saveFlashcards = async () => {
    // console.log(user.id);
    // console.log(user.emailAddresses[0].emailAddress);

    const docRef = doc(db, "flashcards", user.id);

    const userDocRef = await userCheck();
    if (userDocRef != null) {
      // await flashcardCollectionCheck(userDocRef);
      console.log("User either exists or was added succesfully.");
      flashcardCollectionCheck();
    } else {
      console.log("There was an error retreiving or creating user.");
    }

    handleCloseDialog();
    router.push("/flashcards");
  };

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
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontFamily: "impact" }}
            gutterBottom
          >
            Generate Pawcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading} // Disable button when loading
            sx={{
              backgroundColor: isLoading ? "#AAA" : "#CC5500", // Change color when loading
              "&:hover": { backgroundColor: isLoading ? "#AAA" : "#FF6E00" },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Generate Pawcards"}
          </Button>
        </Box>
        {flashcards.length > 0 && (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid
              container
              spacing={2}
              style={{
                backgroundColor: "#E77D22", // Orange background color
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px", // Rounded corners
                height: "100%",
                width: "100%",
              }}
            >
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
                    frontComponent={<FlipCard>{flashcard.front}</FlipCard>}
                    backComponent={<FlipCard>{flashcard.back}</FlipCard>}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenDialog}
                sx={{
                  backgroundColor: "#CC5500",
                  "&:hover": { backgroundColor: "#FF6E00" },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Pawcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your Pawcards collection.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
