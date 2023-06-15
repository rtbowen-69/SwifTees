import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';

const TicketMint = ({provider, swifteetickets, ticketCost, ticketBalance}) => {
  const [isLoading, setIsLoading] = useState(false)

  const ticketMintHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const signer = await provider.getSigner()
      const transaction = await swifteetickets.connect(signer).mint('1', { value: ticketCost })
      await transaction.wait()

    } catch (error) {
      window.alert('An error has occurred. Please try again later');
    }

    setIsLoading(false)
  }

  return(
    <div className="text-center">
      {isLoading ? (
        <Spinner 
          animation="border"
          style={{ display: 'block', margin: '0 auto' }}
        />
      ) : (
        <>
          {ticketBalance >= 4 ? (
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
