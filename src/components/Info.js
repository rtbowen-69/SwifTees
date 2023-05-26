import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const Info = ({ nftMaxSupply, nftTotalSupply, nftCost, nftBalance }) => {
	const formattedCost = ethers.utils.formatEther(nftCost) // Formats to actual ether

	return(
		<div className='text-center'>
			<p><strong>Available to Mint:</strong> {nftMaxSupply - nftTotalSupply} </p>
			<p><strong>Cost to Mint:</strong> {formattedCost} ETH</p>
			<p><strong>SwifTees you currently own:</strong> {nftBalance} </p>
		</div>
	)
}

export default Info;
