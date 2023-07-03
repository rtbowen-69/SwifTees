import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../logo.png'

const Navigation = () => {
  const [account, setAccount] = useState(null)
  const [accountDisplay, setAccountDisplay] = useState('')

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        const formattedAccount = `${accounts[0].slice(0, 5)}...${accounts[0].slice(38, 42)}`;
        setAccountDisplay(formattedAccount)
      } else {
        setAccountDisplay('')
      }
    }

    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          const formattedAccount = `${accounts[0].slice(0, 5)}...${accounts[0].slice(38, 42)}`;
          setAccountDisplay(formattedAccount)
        }
        window.ethereum.on('accountsChanged', handleAccountsChanged)
      }
    }

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

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
              <strong>Account:</strong> {accountDisplay}
            </p>
          </Navbar.Text>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
