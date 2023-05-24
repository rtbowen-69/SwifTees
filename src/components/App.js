import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

import showcase from '../showcase.png'

// Components
import Navigation from './Navigation'
import Info from './Info'
import NFTMint from './NFTMint'


// abis
import TOKEN_ABI from '../abis/SwifTees.json'
import TICKET_ABI from '../abis/SwifTeeTickets.json'

// config
import config from '../config.json'

function App() {

	const [provider, setProvider] = useState(null)
	const [account, setAccount] = useState(null)
	const [networkId, setNetworkId] = useState(null)

	const [swiftees, setSwifTees] = useState(null)
	const [swifteetickets, setSwifTeeTickets] = useState(null)

	const [nftPresaleMinting, setNftPresaleMinting] = useState(0)
	const [ticketPresaleMinting, setTicketPresaleMinting] = useState(0)

	const [ticketBalance, setTicketBalance] = useState(0)
	const [nftBalance, setNftBalance] = useState(0)

	const [nftMaxSupply, setNftMaxSupply] = useState(0)
	const [ticketMaxSupply, setTicketMaxSupply] = useState(0)

	const [nftTotalSupply, setNftTotalSupply] = useState(0)
	const [ticketTotalSupply, setTicketTotalSupply] = useState(0)

	const [nftCost, setNftCost] = useState(0)
	const [ticketCost, setTicketCost] = useState(0)

	const [isLoading, setIsLoading] = useState(true)

	const updateNetworkId = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const network = await provider.getNetwork()
		setNetworkId(network.chainId)
	}

	const loadBlockchainData = async () => {
		// Initiate Provider
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		setProvider(provider)

		// Initiate contract
		const swiftees = new ethers.Contract(config[31337].swiftees.address, TOKEN_ABI, provider)
		setSwifTees(swiftees)

		const swifteetickets = new ethers.Contract(config[31337].swifteetickets.address, TICKET_ABI, provider)
		setSwifTeeTickets(swifteetickets)

		console.log(swiftees.address)
		console.log(swifteetickets.address)

		// Fetch Countdown
		const nftPresaleMinting = await swiftees.presaleMinting
		setNftPresaleMinting(nftPresaleMinting.toString() + '000')

		const ticketPresaleMinting = await swifteetickets.presaleMinting
		setTicketPresaleMinting(ticketPresaleMinting.toString() + '000')

		// Fetch Account
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		const account = ethers.utils.getAddress(accounts[0])
		setAccount(account)		// Add to state

		// Fetch total supply
		setNftTotalSupply(await swiftees.totalSupply())
		setTicketTotalSupply(await swifteetickets.totalSupply())
		console.log(Number(ticketTotalSupply))
		console.log(Number(nftTotalSupply))

		// Fetch cost
		const nftCostWei = await swiftees.cost()
		const ticketCostWei = await swifteetickets.cost()

		const nftCost = ethers.utils.formatEther(nftCostWei)
		const ticketCost = ethers.utils.formatEther(ticketCostWei)

		setNftCost(nftCost)
		setTicketCost(ticketCost)
		console.log(nftCost)
		console.log(ticketCost)

		// Check NFT Balance
		setNftBalance(await swiftees.balanceOf(account))
		setNftBalance(nftBalance)

		// Fetch max supply
		const nftMaxSupply = await swiftees.maxSupply()
		setNftMaxSupply(Number(nftMaxSupply))
		console.log(Number(nftMaxSupply))

		const ticketMaxSupply = await swifteetickets.maxSupply()
		setTicketMaxSupply(Number(nftMaxSupply))
		console.log(Number(ticketMaxSupply))
		// console.log(nftPresaleMinting)

		setIsLoading(false)

	}

	useEffect(() => {
		if (isLoading) {
			loadBlockchainData()
		}
		updateNetworkId()		
	}, [isLoading]);

	return(
		<Container>
			<Navigation account={account} />
			<hr />
				<Row>
					<Col>
						{nftBalance > 0 ? (
							<div className='text-center'>
								<img
									src={`https://ipfs.io/ipfs/QmcKo8rtvQAHWLMEahKnmfPQUnRnjUyaPziYGZZggozNyG/${nftBalance.toString()}.png`}
									alt='SwifTees'
									width='400px'
									height='400px'
								/>
							</div>
						) : (
							<img src={showcase} alt=''/>
						) }

					</Col>

					<Col>
						<div className='my-4 text-center'>
							<Countdown date={Date.now() + 2200000} className='h2' />
						</div>

						<Info 
							nftMaxSupply={nftMaxSupply}
							nftTotalSupply={nftTotalSupply}
							nftCost={nftCost}
							nftBalance={nftBalance}
						/>

						<NFTMint 
							provider={provider}
							swiftees={swiftees}
							nftCost={nftCost}
							setIsLoading={setIsLoading}
						/>
					</Col>

				</Row>
			
			<hr />
			
		</Container>		
	)
}

export default App;
