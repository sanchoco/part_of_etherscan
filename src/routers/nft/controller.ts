import { Router } from "express";
import { validateRequestParam } from "../../utils/validateRequestParam";
import { wrapAsync } from "../../utils/wrapAsync";
import { NftAddressParam } from "./dto";
import { getNftHolders, getNftInfo, getNftOwners, getNftTransfers, getOpenseaInfo } from "./service";

const router = Router();

// info
router.get('/:nftAddress', wrapAsync(async (req, res) => {
  const { nftAddress } = await validateRequestParam(NftAddressParam, req.params);

  const result = await getNftInfo(nftAddress);

  return res.status(200).json(result);
}));

// transfers
router.get('/:nftAddress/transfers', wrapAsync(async (req, res) => {
  const { nftAddress } = await validateRequestParam(NftAddressParam, req.params);

  const result = await getNftTransfers(nftAddress);

  return res.status(200).json(result);
}));

// opensea
router.get('/:nftAddress/opensea', wrapAsync(async (req, res) => {
  const { nftAddress } = await validateRequestParam(NftAddressParam, req.params);

  const result = await getOpenseaInfo(nftAddress);

  return res.status(200).json(result);
}));

// owners
router.get('/:nftAddress/owners', wrapAsync(async (req, res) => {
  const { nftAddress } = await validateRequestParam(NftAddressParam, req.params);

  const result = await getNftOwners(nftAddress);

  return res.status(200).json(result);
}));

// holders
router.get('/:nftAddress/holders', wrapAsync(async (req, res) => {
  const { nftAddress } = await validateRequestParam(NftAddressParam, req.params);

  const result = await getNftHolders(nftAddress);
  
  return res.status(200).json(result);
}));

export const nftController = router;
