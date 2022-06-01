import { web3 } from "../../provider/web3"
import ERC721_ABI  from '../../abi/ERC721.json';
import { AbiItem } from "web3-utils";
import axios from "axios";
import { OPENSEA_API_KEY } from "../../config";
import { EventData } from 'web3-eth-contract';
import NodeCache from "node-cache";

const serviceCache = new NodeCache();

type Transfer = {
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  tokenId: number;
}

type TransferReturnType = { transfers: Transfer[] }

// info
export const getNftInfo = async (nftAddress: string) => {
  const nftContract = new web3.eth.Contract(ERC721_ABI as AbiItem[], nftAddress);
  const name = await nftContract.methods.name().call();
  const symbol = await nftContract.methods.symbol().call();
  const totalSupply = await nftContract.methods.totalSupply().call();

  return { contractAddress: nftAddress, name, symbol, totalSupply };
}

const getEventLogs = async (nftAddress: string, start: number, end: number) => {
  const nftContract = new web3.eth.Contract(ERC721_ABI as AbiItem[], nftAddress);
  const transfers: Transfer[] = [];
  const searchRange = [{ start, end }];

  while (searchRange.length) {
    const { start, end } = searchRange.pop();
    try {
      // common
      const events = await nftContract.getPastEvents('Transfer', { fromBlock: start, toBlock: end });
      if (!events) continue;
      const parsedEvents = events.map((event: EventData) => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        from: event.returnValues.from as string,
        to: event.returnValues.to as string,
        tokenId: parseInt(event.returnValues.tokenId)
      })).sort((a,b) => a.blockNumber - b.blockNumber);
      transfers.push(...parsedEvents);
    } catch (err) {
      if (err.message !== 'Returned error: query returned more than 10000 results')
      throw new Error(err.message);
      if (start === end) break;
      const mid =  parseInt(`${(start + end) / 2}`);
      searchRange.push({ start: mid + 1, end: end });
      searchRange.push({ start: start, end: mid });
    }
  }
  return transfers;
}

const getPunkEventLogs = async (nftAddress: string, start: number, end: number) => {
  const nftContract = new web3.eth.Contract(ERC721_ABI as AbiItem[], nftAddress);
  const transfers: Transfer[] = [];
  const searchRange = [{ start, end }];

  while (searchRange.length) {
    const { start, end } = searchRange.pop();
    try {
      // common
      const events = await nftContract.getPastEvents('PunkTransfer', { fromBlock: start, toBlock: end });
      if (!events) continue;
      const parsedEvents = events.map((event: EventData) => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        from: event.returnValues.from as string,
        to: event.returnValues.to as string,
        tokenId: parseInt(event.returnValues.punkIndex)
      })).sort((a,b) => a.blockNumber - b.blockNumber);
      transfers.push(...parsedEvents);
    } catch (err) {
      if (err.message !== 'Returned error: query returned more than 10000 results')
      throw new Error(err.message);
      if (start === end) break;
      const mid =  parseInt(`${(start + end) / 2}`);
      searchRange.push({ start: mid + 1, end: end });
      searchRange.push({ start: start, end: mid });
    }
  }
  return transfers;
}

// transfers
export const getNftTransfers = async (nftAddress: string): Promise<TransferReturnType> => {
  const cacheKey = `nft_transfer_${nftAddress.toLowerCase()}`;
  const cache = serviceCache.get(cacheKey) as any;

  const fromBlock = cache ? cache.lastBlock + 1 : 0;
  const toBlock = await web3.eth.getBlockNumber();
  
  const isPunk = nftAddress.toLowerCase() === '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
  const transfers = isPunk
    ? await getPunkEventLogs(nftAddress, fromBlock, toBlock) // crypto punk
    : await getEventLogs(nftAddress, fromBlock, toBlock); // ERC721

    const allTransfers = cache ? [...cache.transfers, ...transfers] : transfers;
    const result = { transfers: allTransfers, lastBlock: toBlock };
    serviceCache.set(cacheKey, result);
    return result;
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

// holders
export const getNftOwners = async (nftAddress: string) => {
  const { transfers } = await getNftTransfers(nftAddress);
  const items = new Object();
  for (const transfer of transfers) {
    items[transfer.tokenId] = transfer.to;
  }
  const owners = Object.keys(items)
    .map((tokenId) => ({ tokenId: parseInt(tokenId), owner: items[tokenId] }))
    .sort((a, b) => a.tokenId - b.tokenId)

  return { owners: owners, count: owners.length };
}

// owners
export const getNftHolders = async (nftAddress: string) => {
  const { transfers } = await getNftTransfers(nftAddress);
  const items = new Object();
  for (const transfer of transfers) {
    items[transfer.tokenId] = transfer.to;
  }
  const tokenCount = new Object();
  for (const tokenId of Object.keys(items)) {
    const owner = items[tokenId];
    tokenCount[owner] ? tokenCount[owner] += 1 : tokenCount[owner] = 1;
  }
  const holders = Object.keys(tokenCount).map((address) => {
    return { address, tokenCount: tokenCount[address] };
  }).sort((a, b) => b.tokenCount - a.tokenCount);

  return { holders, count: holders.length };
}

