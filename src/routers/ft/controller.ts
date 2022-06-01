import { Router } from "express";
import { validateRequestParam } from "../../utils/validateRequestParam";
import { wrapAsync } from "../../utils/wrapAsync";
import { FtAddressParam } from "./dto";
import { getFtHolders, getFtInfo, getFtOwners, getFtTransfers } from "./service";

const router = Router();

// info
router.get('/:ftAddress', wrapAsync(async (req, res) => {
  const { ftAddress } = await validateRequestParam(FtAddressParam, req.params);

  const result = await getFtInfo(ftAddress);

  return res.status(200).json(result);
}));

// transfers
router.get('/:ftAddress/transfers', wrapAsync(async (req, res) => {
  const { ftAddress } = await validateRequestParam(FtAddressParam, req.params);

  const result = await getFtTransfers(ftAddress);

  return res.status(200).json(result);
}));

// owners
router.get('/:ftAddress/owners', wrapAsync(async (req, res) => {
  const { ftAddress } = await validateRequestParam(FtAddressParam, req.params);

  const result = await getFtOwners(ftAddress);

  return res.status(200).json(result);
}));

// holders
router.get('/:ftAddress/holders', wrapAsync(async (req, res) => {
  const { ftAddress } = await validateRequestParam(FtAddressParam, req.params);

  const result = await getFtHolders(ftAddress);
  
  return res.status(200).json(result);
}));

export const ftController = router;
