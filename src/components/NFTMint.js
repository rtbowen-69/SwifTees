import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';

const NFTMint = ({provider, swiftees, nftCost, nftBalance, selectedImage, showcase}) => {
	const [isWaiting, setIsWaiting] = useState(false)

	const nftMintHandler = async (e) => {
		e.preventDefault()
		setIsWaiting(true)

		try {
			const signer = await provider.getSigner()
			const transaction = await swiftees.connect(signer).mint('1', { value: nftCost })
			await transaction.wait()

		} catch (error) {
      window.alert('An error has occurred. Please try again later');
    }

		setIsWaiting(false)
	}

	return(
   <div className="row"> 
      <div className="col-md-4">
        <div className="text-center">
          {isWaiting ? (
            <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
          ) : (
            <>
              {nftBalance > 0 ? (
                <img src={selectedImage} alt="SwifTees" width="450px" height="450px" />
              ) : (
                <img src={showcase} alt="" />
              )}
            </>
          )}
        </div>
      </div>
      <div className="col-md-center">
        <Form onSubmit={nftMintHandler} style={{ maxWidth: '400px', margin: '0 auto' }}>
          {isWaiting ? (
            <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
          ) : (
            <Form.Group>
              <Button variant="primary" type="submit" style={{ width: '100%' }}>
                NFTMint
              </Button>
            </Form.Group>
          )}
        </Form>
      </div>
    </div>
	)
}

export default NFTMint;
