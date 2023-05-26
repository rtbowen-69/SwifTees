import { useEffect, useState } from 'react'
import { Container, Row, Col, Tab } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

import showcase from '../showcase.png'
import image1 from '../images/1.png' // Showing different images as possible wallet images 
import image2 from '../images/2.png' // this will be changed later to show the actual images held in the wallet
import image3 from '../images/3.png'
import image4 from '../images/4.png'
import image5 from '../images/5.png'


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

	// Array of images
	const images = [image1, image2, image3, image4, image5]		// to be removed later
	// Generate a random Index
	const randomIndex = Math.floor(Math.random() * images.length)		// to be removed later
	// Select the random image for display
	const selectedImage = images[randomIndex]			// to be removed later

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

		const ticketCost = ethers.utils.formatEther(ticketCostWei)

		setNftCost(nftCostWei.toString())
		setTicketCost(ticketCost)
		console.log(nftCost)
		console.log(ticketCost)

		// Check NFT Balance
		const nftBalanceBigNumber = await swiftees.balanceOf(account)
	  const nftBalance = nftBalanceBigNumber.toString() // Convert BigNumber to string

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

      <Tab.Container id="tabs" defaultActiveKey="nftMint">
        <Row>
          <Col>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="nftMint">NFT Mint</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ticketMint">Ticket Mint</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="concerts">Concerts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="merchandise">Merchandise</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="nftMint">
                <Row>
                  <Col>
                    {nftBalance > 0 ? (
                      <div className="text-center">
                        <img
                          src={selectedImage}
                          alt="SwifTees"
                          width="500px"
                          height="500px"
                        />
                      </div>
                    ) : (
                      <img src={showcase} alt="" />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="my-4 text-center">
                      <Countdown date={Date.now() + 2200000} className="h2" />
                    </div>
                    <Info
                      nftMaxSupply={nftMaxSupply}
                      nftTotalSupply={nftTotalSupply}
                      nftCost={nftCost}
                      nftBalance={nftBalance}
                    />
                    {nftBalance <= 0 && (
                      <NFTMint
                        provider={provider}
                        swiftees={swiftees}
                        nftCost={nftCost}
                        setIsLoading={setIsLoading}
                      />
                    )}
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="ticketMint">
                {/* Add your ticket minting component here */}
              </Tab.Pane>

              <Tab.Pane eventKey="concerts">
                {/* Add your concerts component here */}
              </Tab.Pane>

              <Tab.Pane eventKey="merchandise">
                {/* Add your merchandise component here */}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      <hr />
    </Container>
  );
}

export default App;
