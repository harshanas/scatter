import react, { useContext } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ethers } from 'ethers'

import MainLayout from '../../layouts/mainLayout'
import StoryExcerpt from '../../components/StoryExcerpt';
import { AccountContext }  from "../../lib/context";
import { contractAddress } from '../../config';
import Scatter from "../../artifacts/contracts/TheScatter.sol/TheScatter.json"

const ipfsURI = 'https://ipfs.io/ipfs/'

export default function StoryList (props) {
  const { walletAddr, setWalletAddr } = useContext(AccountContext);

  const router = useRouter()
  const { authorId } = router.query
  const { stories } = props;

  console.log(stories)
  
  return (
    <react.Fragment>
      <div className='row mt-3'>
        <div className="col-md-6 offset-md-3 col-12 text-justify">

          { stories ?
            stories.map((story, index) => {
              return <StoryExcerpt story={story} authorId={authorId} key={index} />
            }) :
            (
              <div className="card text-center mt-5">
                <div className="card-body">
                  <h3 className="card-title mb-2">There are no stories <br/> :( </h3>
                  {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                  {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                  <Link href={`/${walletAddr}/stories/new`}>
                    
                    <button type="button" className="btn btn-secondary mt-2">Write your first story</button>

                  </Link>
                </div>
              </div>
            )
          }
        </div>
      </div>
      
    </react.Fragment>
    
  );
}

StoryList.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}

export async function getServerSideProps(context) {
  let provider;
  let ipfsUrl;
  let response;
  let story;
  const stories = [];

  const { authorId } = context.query;
  
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }

  const contract = new ethers.Contract(contractAddress, Scatter.abi, provider)
  const storiesMeta = await contract.fetchStories(authorId);

  for (let storyMeta of storiesMeta){
    ipfsUrl = `${ipfsURI}/${storyMeta[2]}`
    response = await fetch(ipfsUrl)
    story = await response.json();
    story.id = storyMeta[2];
    stories.push(story);
  }
  
  return {
    props: {
      stories
    }
  }
}