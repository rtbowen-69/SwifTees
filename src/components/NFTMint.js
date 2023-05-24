import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';

const NFTMint = ({provider, swiftees, nftCost}) => {
	const [isWaiting, setIsWaiting] = useState(false)

	const nftMintHandler = async (e) => {
		e.preventDefault()
		console.log('minting...')
		setIsWaiting(true)
		console.log(nftCost, '1')

		try {
			const signer = await provider.getSigner()
			const transaction = await swiftees.connect(signer).mint('1', { value: nftCost })
			await transaction.wait()

		} catch {
			window.alert('User rejected or transaction reverted')
		}

		setIsWaiting(false)
	}

	return(
		<Form onSubmit={nftMintHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
			{isWaiting ? (
				<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
			)	: (
				<Form.Group>
					<Button variant="primary" type="submit" style ={{ width: '100%' }}>
						NFTMint
					</Button>
				</Form.Group>
			)}
		</Form>
	)
}

export default NFTMint;
