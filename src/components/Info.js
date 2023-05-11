const Info = ({ account, nftBalance, maxSupply }) => {
	return(
		<div className="my-3">
			<p><strong>Account:</strong> {account}</p>
			<p><strong>NFTs Owned:</strong> {nftBalance}</p>
			<div><strong>Max Supply: </strong> {maxSupply}</div>
		</div>
	)
}

export default Info;

