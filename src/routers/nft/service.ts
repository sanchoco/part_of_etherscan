import { web3 } from "../../provider/web3"
import ERC721_ABI  from '../../abi/ERC721.json';
import { AbiItem } from "web3-utils";
import axios from "axios";
import { OPENSEA_API_KEY } from "../../config";

type Transfer = {
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  tokenId: number;
}


// info
export const getNftInfo = async (nftAddress: string) => {
  const nftContract = new web3.eth.Contract(ERC721_ABI as AbiItem[], nftAddress);
  const name = await nftContract.methods.name().call();
  const symbol = await nftContract.methods.symbol().call();
  const totalSupply = await nftContract.methods.totalSupply().call();

  return { contractAddress: nftAddress, name, symbol, totalSupply };
}

// transfers
export const getNftTransfers = async (nftAddress: string) => {
  const nftContract = new web3.eth.Contract(ERC721_ABI as AbiItem[], nftAddress);

  const fromBlock = 0;
  const toBlock = await web3.eth.getBlockNumber();
  const transfers: Transfer[] = [];

  let start = fromBlock;
  let end = toBlock;
  while (start <= end) {
    
    try {
      const events = await nftContract.getPastEvents('Transfer', { fromBlock: start, toBlock: end });
      transfers.push(...events.map((event) => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        from: event.returnValues.from,
        to: event.returnValues.to,
        tokenId: parseInt(event.returnValues.tokenId)
      })));
      start = end + 1;
      end = toBlock;
      if (start >= end) break;
    } catch (error){
      let mid =  parseInt(`${(start + end) / 2}`);
      end = mid;
    }
  }

  return { transfers: transfers.sort((a,b) => a.blockNumber - b.blockNumber) };
}

// opensea
export const getOpenseaInfo = async (nftAddress: string) => {
  const collectionInfo = await axios({
    method: 'get',
    url: `https://api.opensea.io/api/v1/asset_contract/${nftAddress}`,
    headers: {
      "X-API-KEY": OPENSEA_API_KEY
    }
  })

  const slug = collectionInfo.data.collection.slug;
  if (!slug) throw new Error('nft not found');

  const collectionStat = await axios({
    method: 'get',
    url: `https://api.opensea.io/api/v1/collection/${slug}/stats`,
    headers: { "X-API-KEY": OPENSEA_API_KEY }
  });

  const opensea = {
    banner: collectionInfo.data.collection.banner_image_url,
    image: collectionInfo.data.image_url,
    homepage: collectionInfo.data.external_link,
    name: collectionInfo.data.name,
    symbol: collectionInfo.data.symbol,
    totalSupply: collectionInfo.data.total_supply,
    description: collectionInfo.data.description,
    oneDayVolume: collectionStat.data.stats.one_day_volume,
    sevenDayVolume: collectionStat.data.stats.seven_day_volume,
    owners: collectionStat.data.stats.num_owners,
    avgPrice: collectionStat.data.stats.average_price,
    marketCap: collectionStat.data.stats.market_cap,
    floorPrice: collectionStat.data.stats.floor_price
  }

  return { opensea };
}

// owners
export const getNftOwners = async (nftAddress: string) => {
  const { transfers } = await getNftTransfers(nftAddress);
  const items = new Object();
  for (const transfer of transfers) {
    items[transfer.tokenId] = transfer.to;
  }
  const itemCount = new Object();
  for (const tokenId of Object.keys(items)) {
    const owner = items[tokenId];
    itemCount[owner] ? itemCount[owner] += 1 : itemCount[owner] = 1;
  }
  const owners = Object.keys(itemCount).map((address) => {
    return { address, itemCount: itemCount[address] };
  }).sort((a, b) => b.itemCount - a.itemCount);

  return { owners, count: owners.length };
}

// holders
export const getNftHolders = async (nftAddress: string) => {
  const { transfers } = await getNftTransfers(nftAddress);
  const items = new Object();
  for (const transfer of transfers) {
    items[transfer.tokenId] = transfer.to;
  }
  const holders = Object.keys(items)
    .map((tokenId) => ({ tokenId: parseInt(tokenId), owner: items[tokenId] }))
    .sort((a, b) => a.tokenId - b.tokenId)

  return { holders: holders, count: holders.length };
}