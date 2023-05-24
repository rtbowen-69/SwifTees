import Navbar from 'react-bootstrap/Navbar'
import { ethers } from 'ethers'

import logo from '../logo.png';

const  Navigation = ({ account }) => {

	let accountDisplay = '';
  if (account) {
    accountDisplay = `${account.slice(0, 5)}...${account.slice(38, 42)}`;
  }
	return(
		<Navbar>
			<img 
				alt="logo"
				src={logo}
				width="50"
				height="50"
				className="d-inline-block aligh-top mx-3"
			/>
			<Navbar.Brand href="#">SwifTees NFT Fan Site</Navbar.Brand>
			<Navbar.Collapse className='justify-content-end'>
				{account && (
					<Navbar.Text>
						<p>
							<strong>Account:</strong> {accountDisplay}
						</p>
					</Navbar.Text>
				)}
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Navigation;
