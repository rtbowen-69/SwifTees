import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

// Components
import Navigation from './Navigation';
import Info from './Info';
import Mint from './Mint';


// abis
import TOKEN_ABI from '../abis/SwifTees.json'

// config
import config from '../config.json';

function App() {

	const [provider, setProvider] = useState(null)
	const [swiftees, setSwiftees] = useState(null)

	const [account, setAccount] = useState(null)
	const [nftBalance, setNftBalance] = useState(0)
	const [maxSupply, setMaxSupply] = useState(0)

	const [isLoading, setIsLoading] = useState(true)

	const loadBlockchainData = async () => {
		// Initiate Provider
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		setProvider(provider)

		// Initiate contract
		const swiftees = new ethers.Contract(config[31337].swiftees.address, TOKEN_ABI, provider)
		setSwiftees(swiftees)
		console.log(swiftees.address)

		// Fetch Account
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		const account = ethers.utils.getAddress(accounts[0])
		setAccount(account)		// Add to state

		// Check NFT Balance
		const accountBalance = await swiftees.balanceOf(swiftees.address)
		setNftBalance(nftBalance)
		// console.log(accountBalance)

		const maxSupply = await swiftees.maxSupply()
		setMaxSupply(Number(maxSupply))
		console.log(maxSupply)

		setIsLoading(false)

	}

	useEffect(() => {
		if (isLoading) {
			loadBlockchainData()
		}	
	}, [isLoading]);

	return(
		<Container>
			<Navigation />
			<p className='text-center'><strong>Current Available SwifTees NFTs:</strong>  "SoldOut"</p>
			<hr />
			{account && (
				<Info account={account} nftBalance={nftBalance} maxSupply={maxSupply} />
			)}

			<Mint 
				provider={provider}
				nftBalance={nftBalance}
				setIsLoading={setIsLoading}
			/>

		</Container>		
	)
}

export default App;
