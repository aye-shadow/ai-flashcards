'use client';

import * as React from 'react';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import Link from 'next/link';

export default function LearnMore() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Support Us Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Link href="/support-us" passHref>
            <Button variant="contained" color="secondary">
              Support Us
            </Button>
          </Link>
        </Box>
    
      
        <Typography variant="h3" component="h1" gutterBottom>
          Learn More About Flashcard Generation
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Flashcards are a powerful tool for studying and retaining information. By using our flashcard generation feature, you can quickly create custom flashcards tailored to your study needs. Whether you're preparing for exams, learning a new language, or just trying to memorize key concepts, flashcards can help you review and reinforce information effectively.
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              How to Generate Flashcards
            </Typography>
            <Typography variant="body1">
              Generating flashcards is simple! Just enter the content you want to study, and our system will create flashcards based on your input. You can use various prompts to guide the generation process.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Example Prompts
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Here are some example prompts you can use to generate flashcards:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Can you make flashcards for history studies?" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Generate flashcards for basic French vocabulary." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Create flashcards for key concepts in physics." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Can you generate flashcards for learning the human anatomy?" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Tips for Effective Flashcard Use
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              To get the most out of your flashcards, consider these tips:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Review regularly: Consistent review helps reinforce what you've learned." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Shuffle your flashcards: Randomizing the order can help you recall information in different contexts." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Use images: Adding visuals to your flashcards can aid memory retention." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Keep it concise: Flashcards are most effective when they contain brief, focused information." />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Typography variant="body1">
          Ready to start? Head back to the flashcard generator and create your personalized flashcards now!
        </Typography>
      </Box>
    </Container>
  )
}
