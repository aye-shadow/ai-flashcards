"use client"
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
import Head from "next/head";
import { PawPrint } from 'lucide-react';



export default function Home() {
  const handleSubmit = async () => {
    console.log("handleSubmit triggered");

    try {
      console.log("Starting API call to /api/checkout_sessions");

      const checkoutSession = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { origin: 'http://localhost:3001' },
      });

      console.log("API call completed. Processing response...");

      const checkoutSessionJson = await checkoutSession.json();
      console.log("Checkout Session JSON:", checkoutSessionJson);

      console.log("Initializing Stripe...");
      const stripe = await getStripe();
      console.log("Stripe initialized:", stripe);

      console.log("Redirecting to Stripe Checkout...");
      const {error} = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.error("Stripe redirectToCheckout error:", error.message);
      } else {
        console.log("Successfully redirected to Stripe Checkout.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };


  return (
    <Container 
      maxWidth="100vw" 
      sx={{ 
        backgroundColor: '#FF9913', 
        minHeight: '100vh', 
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
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
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'impact' }}>
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

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: 'center', flexGrow: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Free Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', backgroundColor: '#D16002', padding: 3, borderRadius: 2, boxShadow: 1, height: '100%' }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#FFFFFF' }}>
                Free
              </Typography>
              <Typography variant="h4" component="h4" gutterBottom sx={{ color: '#FF9913' }}>
                $0
              </Typography>
              <Typography sx={{ color: '#FFFFFF' }}>
                Basic features
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
                  mt: 2 // Margin top for spacing between buttons
                }}
              >
                Get Started
              </Button>
            </Box>
          </Grid>
          {/* Pro Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', backgroundColor: '#D16002', padding: 3, borderRadius: 2, boxShadow: 1, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF' }}>
                Pro
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: '#FF9913' }}>
                $10/month
              </Typography>
              <Typography sx={{ color: '#FFFFFF' }}>
                Access to basic flashcard features and limited storage
              </Typography>
              <Button
                variant="contained"
                onClick={handleSubmit} // Added onClick event to trigger Stripe checkout
                sx={{
                  backgroundColor: '#B06500', // Dark orange
                  '&:hover': {
                    backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
                  },
                  color: '#FFFFFF', // White text
                  mt: 2 // Margin top for spacing between buttons
                }}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
