import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { PawPrint } from 'lucide-react';

export default function Home() {
  return (
    <Container maxWidth="100vw" sx={{ backgroundColor: '#FF9913', minHeight: '100vh', padding: 0 }}>
      <Head>
        <title>Paw Cards</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: '#D16002' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <PawPrint style={{ marginRight: 8 }} />
            <Typography variant="h6" sx={{ fontFamily: 'impact' }}>
              Paw Cards
            </Typography>
          </Box>
          <SignedOut>
            <Button
              color="inherit"
              href="/sign-in"
              sx={{
                backgroundColor: '#FF8C00', // Dark orange
                '&:hover': {
                  backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
                },
                color: '#FFFFFF', // White text
                mr: 2 // Margin right for spacing between buttons
              }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              href="/sign-up"
              sx={{
                backgroundColor: '#FF8C00', // Dark orange
                '&:hover': {
                  backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
                },
                color: '#FFFFFF' // White text
              }}
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Paw Cards🐶
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          color="inherit"
          href="/generate"
          sx={{
            backgroundColor: '#B06500', // Dark orange
            '&:hover': {
              backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
            },
            color: '#FFFFFF', // White text
            mr: 2 // Margin right for spacing between buttons
          }}
        >
          Get Started
        </Button>
        <Button
          href="/more"
          variant="outlined"
          sx={{
            color: '#B06500', // Dark orange text
            borderColor: '#B06500', // Dark orange border
            '&:hover': {
              color: '#FFFFFF', // White text on hover
              borderColor: '#E67E22', // Slightly lighter dark orange border on hover
              backgroundColor: '#FF8C00' // Dark orange background on hover
            }
          }}
        >
          Learn More
        </Button>
      </Box>

      <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <iframe 
          src="https://lottie.host/embed/86b78ddd-bee7-43ea-98c4-668ebbdbda16/27LOwi3xDl.json"
          style={{ border: 'none', width: '100%', maxWidth: '500px', height: '500px' }}
        ></iframe>
      </Container>
    </Container>
  );
}
