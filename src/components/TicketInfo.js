import { ethers } from 'ethers'

const TicketInfo = ({ ticketMaxSupply, ticketTotalSupply, ticketCost, ticketBalance }) => {
	const formattedCost = ethers.utils.formatEther(ticketCost) // Formats to actual ether

	return(
		<div className='text-center'>
			<p><strong>Available to Mint:</strong> {ticketMaxSupply - ticketTotalSupply} </p>
			<p><strong>Cost to Mint:</strong> {formattedCost} ETH</p>
			<p><strong>Tickets you currently own:</strong> {ticketBalance.toString()} </p>
		</div>
	)
}

export default TicketInfo;
