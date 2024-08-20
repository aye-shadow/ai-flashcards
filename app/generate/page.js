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
  Card,
  CardContent,
  CardActionArea,
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
    <Box sx={{ backgroundColor: "#FF9913", minHeight: "100vh", display:"flex", 
      flexDirection: "column",
        padding: "20px"
     }}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate  Pawcards
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
          color="inherit"
          href="/generate"
          sx={{
            backgroundColor: '#B06500', // Dark orange
            '&:hover': {
              backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
            },
            color: '#FFFFFF'
          }}
          >
            Generate Flashcards
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
            <Typography variant="h5" component="h2" gutterBottom
            sx={{fontFamily: '"impact", "Arial Black", sans-serif',
              color: '#fff', // White text
              textAlign: 'center'}}>
              Generated Pawcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ReactFlipCard
                    containerStyle={{
                      width: "100%",
                      height: "200px",
                      position: "relative",
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
              Please enter a name for your flashcards collection.
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
