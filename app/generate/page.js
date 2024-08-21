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
import { collection, writeBatch, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust the import based on your file structure
import ReactFlipCard from "reactjs-flip-card";
import FlipCard from "@/components/flipcard";

export default function Generate() {
  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

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
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your flashcards collection.");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
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
        padding: "20px"
      }}
    >
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" sx={{fontFamily:"impact"}} gutterBottom>
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
            sx={{ backgroundColor: '#CC5500', '&:hover': { backgroundColor: '#FF6E00' } }}
          >
            Generate Pawcards
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
            <Grid container spacing={2} style={{
        backgroundColor: '#E77D22', // Orange background color
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px', // Rounded corners
        height: '100%',
        width: '100%',
      }}>
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
                  frontComponent={
                    <FlipCard>
                      {flashcard.front}
                    </FlipCard>
                  }
                  backComponent={
                    <FlipCard>
                      {flashcard.back}
                    </FlipCard>
                  }
                />
              </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenDialog}
                sx={{ backgroundColor: '#CC5500', '&:hover': { backgroundColor: '#FF6E00' } }}
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
