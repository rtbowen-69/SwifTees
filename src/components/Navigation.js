import { ethers } from 'ethers'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../logo.png'


const Navigation = ({ account, setAccount }) => {
	const connectionHandler = async () => {
		const accounts = await window.ethereum.request({ method: 'eth-requestAccounts' })
		const account = ethers.utils.getAddress(accounts[0])
		setAccount(account)

	}

 return (
    <Navbar>
      <img
        alt="logo"
        src={logo}
        width="50"
        height="50"
        className="d-inline-block aligh-top mx-2"
      />
      <Navbar.Brand href="#">SwifTees NFT Fan Site</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        {account && (
          <Navbar.Text>
            <p>
              <strong>Account:</strong> {account.slice(0, 5) + '...' + account.slice(38, 42)}
            </p>
          </Navbar.Text>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
