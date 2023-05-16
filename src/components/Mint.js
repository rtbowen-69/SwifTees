import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';

const Mint = ({provider, swiftees, cost, setIsLoading }) => {
	const [isWaiting, setIsWaiting] = useState(false)

	const mintHandler = async (e) => {
		e.preventDefault()
		setIsWaiting(true)

		try {
			const signer = await provider.getSigner()
			const transaction = await swiftees.connect(signer).mint(1, { value: cost })
			await transaction.wait()		

		} catch {
			window.alert('User rejected or transaction reverted')
		}
	}

	return(
		<Form onSubmit={mintHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
			{isWaiting ? (
				<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
			): (
				<Form.Group>
					<Button variant="primary" type="submit" style ={{ width: '50%' }}>
						Mint
					</Button>
				</Form.Group>
			)}
		</Form>
	)
}

export default Mint;
