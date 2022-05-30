import { Router } from 'express';
import { nftController } from './nft/controller';

const router = Router();

router.get('/', (req, res) => res.status(200).send());
router.use('/nft', nftController);

export const mainRouter = router;
