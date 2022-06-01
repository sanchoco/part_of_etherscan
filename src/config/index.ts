import 'dotenv/config';
import env from 'env-var';

export const PORT = process.env.PORT || 3000;
export const ETHEREUM_PROVIDER = env.get('ETHEREUM_PROVIDER').required().asString();
export const OPENSEA_API_KEY = env.get('OPENSEA_API_KEY').asString();