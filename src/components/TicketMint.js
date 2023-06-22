import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';

const TicketMint = ({provider, swifteetickets, ticketCost, ticketBalance, setIsLoading}) => {

  const ticketMintHandler = async (e) => {
    e.preventDefault()

    try {
      const signer = await provider.getSigner()
      const transaction = await swifteetickets.connect(signer).mint('1', { value: ticketCost })
      await transaction.wait()

    } catch (error) {
      window.alert('An error has occurred. Please try again later');
    }

    setIsLoading(true)
  }

  return(
    <div className="text-center">
      {false ? (
        <Spinner 
          animation="border"
          style={{ display: 'block', margin: '0 auto' }}
        />
      ) : (
        <>
          {ticketBalance <= 4 ? (
            <p>You already have the Maximum of 4 Tickets</p>
          ) : (
            <Button 
              variant="primary"
              type="submit"
              style={{ width: '10%' }}
              onClick={ticketMintHandler}
            >
              TicketMint
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default TicketMint;
