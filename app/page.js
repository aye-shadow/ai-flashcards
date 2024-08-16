import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";



export default function Home() {
  return(
      <Container maxWidth ="100vw">
        <Head>
          <tittle>Paw Cards</tittle>
          <meta name ="description"content="Create flashcard from your text" />
        </Head>

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Paw Cards
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{textAlign: 'center', my: 4}}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Paw Cards🐶
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
            Get Started
          </Button>
          <Button variant="outlined" color="primary" sx={{mt: 2}}>
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
