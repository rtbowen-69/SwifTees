const Info = ({ account, nftBalance }) => {
	return(
		<div className="my-3">
			<p><strong>Account:</strong> {account}</p>
			<p><strong>NFTs Owned:</strong> {nftBalance}</p>

		</div>
	)
}

export default Info;

