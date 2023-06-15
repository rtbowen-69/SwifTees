import { useEffect, useState } from 'react'
import { Container, Row, Col, Tab, Nav, Modal, Button } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

import showcase from '../showcase.png'
import tsconcertticket from '../images/tsconcertticket.png'

// Components
import Navigation from './Navigation'

import Info from './Info'
import TicketInfo from './TicketInfo'

import NFTMint from './NFTMint'
import TicketMint from './TicketMint'


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

  // const [showModal, setShowModal] = useState(false)
  
  const [ownerNFTImage, setOwnerNFTImage] = useState(null)
  const [swifteetickets, setSwifTeeTickets] = useState(null)

  const [nftPresaleMinting, setNftPresaleMinting] = useState("0")
  const [nftPublicMinting, setNftPublicMinting] = useState("0")
  const [ticketPresaleMinting, setTicketPresaleMinting] = useState("0")
  const [ticketPublicMinting, setTicketPublicMinting] = useState("0")

  const [ticketBalance, setTicketBalance] = useState(0)
  const [nftBalance, setNftBalance] = useState(0)

  const [nftMaxSupply, setNftMaxSupply] = useState(0)
  const [ticketMaxSupply, setTicketMaxSupply] = useState(0)

  const [nftTotalSupply, setNftTotalSupply] = useState(0)
  const [ticketTotalSupply, setTicketTotalSupply] = useState(0)

  const [nftCost, setNftCost] = useState(0)
  const [ticketCost, setTicketCost] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [transactionCompleted, setTransactionCompleted] = useState(false)

  const updateNetworkId = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    setNetworkId(network.chainId)
  }

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate contract
    const swiftees = new ethers.Contract(
      config[31337].swiftees.address,
      TOKEN_ABI,
      provider
    )
    setSwifTees(swiftees)

    const swifteetickets = new ethers.Contract(
      config[31337].swifteetickets.address,
      TICKET_ABI,
      provider
    )
    setSwifTeeTickets(swifteetickets)

    console.log(swiftees.address)
    console.log(swifteetickets.address)

    // Fetch Countdowns
    const nftPresaleMintingBigNumber = await swiftees.presaleMinting()
    const nftPublicMintingBigNumber = await swiftees.allowPublicMintingOn()
    setNftPresaleMinting(nftPresaleMintingBigNumber.toString() + '000')
    setNftPublicMinting(nftPublicMintingBigNumber.toString() + '000')

    const ticketPresaleMintingBigNumber = await swifteetickets.presaleMinting()
    const ticketPublicMintingBigNumber = await swifteetickets.allowPublicMintingOn()
    setTicketPresaleMinting(ticketPresaleMintingBigNumber.toString() + '000')
    setTicketPublicMinting(ticketPublicMintingBigNumber.toString() + '000')
    // Fetch Account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)   // Add to state
    
    // Fetch total supply
    setNftTotalSupply(await swiftees.totalSupply())
    setTicketTotalSupply(await swifteetickets.totalSupply())

    // Fetch cost
    const nftCostWei = await swiftees.cost()
    const ticketCostWei = await swifteetickets.cost()

    setNftCost(nftCostWei.toString())
    setTicketCost(ticketCostWei.toString())

    // Check NFT balance
    const nftBalanceBigNumber = await swiftees.balanceOf(account)
    console.log('nftBalanceBigNumber:', nftBalanceBigNumber.toString())
    const nftBalance = nftBalanceBigNumber.gt(0) ? nftBalanceBigNumber : ethers.BigNumber.from(0)

    setNftBalance(nftBalance)

    // Check Ticket balance
    const ticketBalanceBigNumber = await swifteetickets.balanceOf(account)
    const ticketBalance = ticketBalanceBigNumber.toString()

    setTicketBalance(ticketBalance)

    // Fetch maxSupply
    const nftMaxSupply = await swiftees.maxSupply()
    setNftMaxSupply(nftMaxSupply)
    console.log(nftMaxSupply.toString())

    const ticketMaxSupply = await swifteetickets.maxSupply()
    setTicketMaxSupply(ticketMaxSupply)
    console.log(ticketMaxSupply.toString())
    // console.log(nftPresaleMinting)
    if (nftBalance.gt(0)) {      // checks to see it a swiftee is owned by the wallet and if it is displays that image
      const ownerNFTId = await swiftees.tokenOfOwnerByIndex(account, 0)
      const ownerNFTURI = await swiftees.tokenURI(ownerNFTId)

      // const response = await fetch(ownerNFTURI)
      // const metadata = await response.json()
      // const ownerNFTImage = metadata.image

      
      setOwnerNFTImage(ownerNFTImage)
    } else {
      setOwnerNFTImage(null)
    }

    setIsLoading(false)
    setTransactionCompleted(true)

    // refresh account on change
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) // returns current account connected to metamask after changing it
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)      
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) {
        const cleanup = await loadBlockchainData()
        return cleanup
      }
    }

    fetchData()
  }, [isLoading]);

  return (
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
                <Nav.Link eventKey="concerts">Concerts </Nav.Link>
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
                          src={ownerNFTImage}
                          alt="SwifTees NFT"
                          width="475px"
                          height="475px"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <img src={showcase} alt="showcase" />
                      </div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="my-4 text-center">
                      <Countdown date={parseInt(nftPresaleMinting, 10)} className="h2" />
                    </div>
                    <div className="my-4 text-center">
                      <Countdown date={parseInt(nftPublicMinting, 10)} className="h2" />
                    </div>                    
                    <Info
                      nftMaxSupply={nftMaxSupply}
                      nftTotalSupply={nftTotalSupply}
                      nftCost={nftCost}
                      nftBalance={nftBalance.toString()}
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
                <Row>
                  <Col>                  
                    <div className="text-center">
                      <img 
                        src={tsconcertticket}
                        alt="tsconcertticket"
                        width='975px'
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="my-4 text-center">
                      <Countdown date={parseInt(ticketPresaleMinting, 10)} className="h2" />
                    </div>
                    <div className="my-4 text-center">
                      <Countdown date={parseInt(ticketPublicMinting, 10)} className="h2" />
                    </div>
                    <TicketInfo
                      ticketMaxSupply={ticketMaxSupply}
                      ticketTotalSupply={ticketTotalSupply}
                      ticketCost={ticketCost}
                      ticketBalance={ticketBalance.toString()}
                      ticketPublicMinting={ticketPublicMinting.toString()}
                    />
                    {ticketBalance <= 4 && (
                      <TicketMint
                        provider={provider}
                        swifteetickets={swifteetickets}
                        ticketCost={ticketCost}
                        setIsLoading={setIsLoading}
                      />
                    )}
                  </Col>
                </Row>
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
    </Container>
  );
}


export default App;
