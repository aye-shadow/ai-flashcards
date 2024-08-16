'use client'
import * as React from 'react'
import { DialogActions } from '@mui/material'
import { useState } from 'react'
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
} from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { collection, writeBatch } from 'firebase/firestore'

export default function Generate() {
  const [flipped, setFlipped] = useState([])
  // Corrected state management for text input
  const [text, setText] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter('')


  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generates/', {
        method: 'POST',
        body: text,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  const handleOpen = () => {
    setOpenI(true)
  }
  const handleclose = () => {
    setOpenI(false)
  }
  const saveFlashcards = async () => {
    if(!name){
        alert('please enter a name')  
        return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if(docSnap.exists()){
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists.')
        return

      }else{
        collections.push({name})
        batch.set(userDocRef, {flashcards: collections}), {merge: true}
      }

    }else{
      batch.set(userDocRef, {flashcards: [{name}]})
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocREf = doc(colRef)
      batch.set(cardDocREf, flashcard)
    })

    await batch.commit()
    handleclose()
    router.push('/flascards')
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        {/* Corrected text field handling */}
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
        >
          Generate Flashcards
        </Button>
      </Box>    
        {flashcards.length > 0 && (
        <Box sx={{ mt: 4,  display: 'flex', justifyContent: 'center'}}>
        <Typography variant="h5" component="h2" gutterBottom>
          Generated Flashcards
        </Typography>
        <Grid container spacing={2}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
              <CardActionArea onClick={() => handleCardClick(index)}>
        <CardContent>
          <Box
            sx={{
              perspective: '1000px',
              '& > div': {
                position: 'relative',
                width: '100%',
                height: '200px',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                },
                '& > div > div': {
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
              boxSizing: 'border-box',
            },
            '& > div > div:nth-of-type(2)': {
              transform: 'rotateY(180deg)',
            },
          }}
      >
        {/* Front of the card */}
        <div>
          <Typography variant="h6">Front:</Typography>
          <Typography variant="h5" component="div">
            {flashcard.front}
          </Typography>
        </div>

        {/* Back of the card */}
        <div>
          <Typography variant="h6">Back:</Typography>
          <Typography variant="h5" component="div">
            {flashcard.back}
          </Typography>
        </div>
      </Box>
    </CardContent>
  </CardActionArea>

    
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
        <Button variant='contained' color='secondary' onClick={handleOpenDialog}>
            save

        </Button>

        </Box>
      </Box>
    )}

    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Save Flashcards</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your flashcards collection
        </DialogContentText>
        <TextField
          autoFocus
          margin= "dense" 
          label="Collection Name" 
          type = "text"
          fullWidth 
          value={setName}
          onChange={(e) => setName(e.target.value)}
          variant='outlined'
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
  )
}