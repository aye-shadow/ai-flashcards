import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
export default function Home() {
    <Container maxWidth ="lg">
      <Head>
        <tittle>Paw Cards</tittle>
        <meta name ="description"content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6"> Paw Cards </Typography>
          <SignedOut>
            <Button> Login </Button>
            <Button> Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
    </Container>
}
