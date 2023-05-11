import Navbar from 'react-bootstrap/Navbar';

import logo from '../logo.png';

const  Navigation = () => {
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
		</Navbar>
	)
}

export default Navigation;
