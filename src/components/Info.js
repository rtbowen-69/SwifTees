import { ethers } from 'ethers'

const Info = ({ nftMaxSupply, nftTotalSupply, nftCost, nftBalance }) => {

	return(
		<div className='text-center'>
			<p><strong>Available to Mint:</strong> {nftMaxSupply - nftTotalSupply} </p>
			<p><strong>Cost to Mint:</strong> {nftCost} ETH</p>
			<p><strong>SwifTees you currently own:</strong> {nftBalance} </p>

		</div>
	)
}

export default Info;
