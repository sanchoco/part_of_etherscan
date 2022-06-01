import { Router } from 'express';
import { checkController } from './check/controller';
import { eoaController } from './eoa/controller';
import { ftController } from './ft/controller';
import { nftController } from './nft/controller';

const router = Router();

router.get('/', (req, res) => res.status(200).send());
router.use('/check', checkController);
router.use('/eoa', eoaController);
router.use('/nft', nftController);
router.use('/ft', ftController);

export const mainRouter = router;
