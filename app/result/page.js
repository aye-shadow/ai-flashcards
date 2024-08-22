//Handles post payment process and displaying the outcomes to the user. 

'use client'
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
          if (!session_id) {
            // Redirect to homepage if no session_id
            router.push('/')
            return
          }
          try {
            const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
            const sessionData = await res.json()
            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
    }, [session_id, router])

    if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
    }

    if (error) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        )
    }

    return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          {session && session.payment_status === 'paid' ? (
            <>
              <Typography variant="h4">Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="h6">Session ID: {session_id}</Typography>
                <Typography variant="body1">
                  We have received your payment. You will receive an email with the
                  order details shortly.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => router.push('/generate')} // Navigate to generate flaschards
                sx={{
                    backgroundColor: '#B06500', // Dark orange
                    '&:hover': {
                      backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
                    },
                    color: '#FFFFFF', // White text
                    mt: 4 // Margin top for spacing between buttons
                  }}
              >
                Generate Flashcards 
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
              </Box>
              <Button 
                variant="contained" 

                onClick={() => router.push('/')} // Navigate to homepage
                sx={{
                    backgroundColor: '#B06500', // Dark orange
                    '&:hover': {
                      backgroundColor: '#E67E22' // Slightly lighter dark orange on hover
                    },
                    color: '#FFFFFF', // White text
                    mt: 4 // Margin top for spacing between buttons
                  }}
              >
                Return to Homepage
              </Button>
            </>
          )}
        </Container>
    )
}

export default ResultPage;
