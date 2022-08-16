import { clusterApiUrl } from '@solana/web3.js';

module.exports = {
    network: clusterApiUrl("devnet"),
    opts: {
        preflightCommitment: "processed"
    }
}