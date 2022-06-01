import { Router } from "express";
import { validateRequestParam } from "../../utils/validateRequestParam";
import { wrapAsync } from "../../utils/wrapAsync";
import { FtAddressParam } from "./dto";
import { getFtBalances, getFtInfo, getFtTransfers } from "./service";

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
router.get('/:ftAddress/balances', wrapAsync(async (req, res) => {
  const { ftAddress } = await validateRequestParam(FtAddressParam, req.params);

  const result = await getFtBalances(ftAddress);

  return res.status(200).json(result);
}));


export const ftController = router;
