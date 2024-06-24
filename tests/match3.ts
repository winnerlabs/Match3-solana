import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert, expect } from "chai";
// import { Match3 } from "../target/types/match_3";
import { BN } from "bn.js";
import { LAMPORTS_PER_SOL, PublicKey, Keypair} from "@solana/web3.js";
import {
  SB_ON_DEMAND_PID,
  Randomness,
  InstructionUtils,
  sleep,
} from "@switchboard-xyz/on-demand";
import * as fs from "fs";
import { mplBubblegum, findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { DasApiAsset, dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { Match3, MATCH3_INFO_PDA} from "@winnerlabs/match3"
import { toWeb3JsPublicKey, fromWeb3JsPublicKey} from '@metaplex-foundation/umi-web3js-adapters';
import { publicKey as UmiPk } from "@metaplex-foundation/umi";

describe("match3", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = anchor.Wallet.local();
  const match3 = new Match3(provider);
  const umi = createUmi('https://devnet.helius-rpc.com/?api-key=32e59a48-db47-494f-a6b6-61d9cbf64a25')
  .use(mplTokenMetadata())
  .use(mplBubblegum())
  .use(dasApi())
  .use(walletAdapterIdentity(wallet));
  // const merkleTree = publicKey("DLy1ud2U42HkEmuD1w7sjzJto7aDBFMnCpxHq2Q9q8Uv");
  // const program = anchor.workspace.Match3 as Program<Match3>;

  // const [match3InfoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //   [Buffer.from("match3"), user.publicKey.toBuffer()],
  //   program.programId
  // )
  // const [playerConfigPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //   [Buffer.from("player_config"), user.publicKey.toBuffer()],
  //   program.programId
  // );
  // const [inviterPlaceholderPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //   [Buffer.from("player_config"), PublicKey.default.toBuffer()],
  //   program.programId
  // );
  // it("init match3 game!", async () => {
  //   await match3.initMatch3Info(wallet.payer);
  //   await match3.addNewTree(wallet.payer, umi);
  //   // verify
  //   const match3Info = await match3.program.account.match3Info.fetch(MATCH3_INFO_PDA);
  //   assert.equal(match3Info.totalScratchcard, 0);
  //   console.log("match3Info merkleTree: ", match3Info.merkleTree.toString());
  // });

  // it("mint scratchcard!", async () => {
  // //   assert.equal(match3Info.totalScratchcard.toNumber(), 1);
  // //   assert.equal(playerConfig.credits, 0);
  // //   assert.equal(playerConfig.ownedScratchcard, 1);
      // const [assetId, credits] =  await match3.mintScratchcard(wallet.payer, umi);
  //     console.log("assetId: ", assetId.toString());
  //     console.log("credits: ", credits);
  // })

  it("scratching scratchcard!", async () => {
      const rpcAssetList = await umi.rpc.getAssetsByOwner({owner: umi.payer.publicKey})
      console.log("rpcAssetList: ", rpcAssetList);
      console.log("merketree:", rpcAssetList.items[0].compression.tree)
      console.log("json uri: ", rpcAssetList.items[0].content.json_uri)
      console.log("asset id: ", rpcAssetList.items[0].id)
      const assetId = rpcAssetList.items[0].id;
      // const assetId = new PublicKey("3Ms1fyFFa5AjaS6rDmEUjZbu7BQz1PGV8bBkMGUTCnCA");
      // console.log("asset id: ", assetId.toString());
      // const asset = await umi.rpc.getAsset(assetId);
      const [numberOfScratched, latestScratchedPattern, isWon, currentCredits] = await match3.scratchingCard(wallet.payer, umi, assetId, 3);
      console.log("numberOfScratched: ", numberOfScratched);
      console.log("currentCredits: ", currentCredits);
  //   assert.equal(scratchcardInfo.cardId.toNumber(), 1);
  //   assert.equal(scratchcardInfo.numberOfScratched, 1);
  //   assert.equal(playerConfigInfo.credits, 2);
      console.log(" ✨ The pattern just scratched out is: ", latestScratchedPattern);
      console.log(" 🔮 you is win? let we check it: ", isWon);
  })
});

export function LoadProgramIdl(filepath: string) {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}