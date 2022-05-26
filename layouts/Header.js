import Head from 'next/head'
import react from 'react'
import Link from 'next/link'
import { useContext } from 'react'

import { AccountContext } from '../context';

export default function Header({ connect }) {
  const { account } = useContext(AccountContext);
  
  return (
    <react.Fragment>
      <Head>
        <title>Newsblocks by Scatter</title>
        <meta name="description" content="Newsblocks created by Scatter - the Decentralized CMS" />
      </Head>
    {/* begin::Navbar */}
    <nav className="navbar">
        <div className="container">
          <Link href="/">
            <a className="navbar-brand">Newsblocks</a>
          </Link>

          <Link href={`admin/stories/create`}>
              <a>
                  Create Story
              </a>
          </Link>
          
          <form className="d-flex">
            {
              !account && (
                <button type="button" className="btn btn-primary" onClick={connect}>
                  <i className="fa-solid fa-wallet"></i>
                  Connect Wallet
                </button>
              )
            }
            {
              account && <p>{account}</p>
            }
          </form>
        </div>
    </nav>
    {/* end::Navbar */}
      
    </react.Fragment>
  )
}
