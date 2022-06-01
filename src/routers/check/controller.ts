import { Router } from "express";
import { validateRequestParam } from "../../utils/validateRequestParam";
import { wrapAsync } from "../../utils/wrapAsync";
import { AddressParam } from "./dto";
import { checkAddressType } from "./service";

const router = Router();

// info
router.get('/:address', wrapAsync(async (req, res) => {
  const { address } = await validateRequestParam(AddressParam, req.params);

  const type = await checkAddressType(address);

  return res.status(200).json({ type });
}));

export const checkController = router;
