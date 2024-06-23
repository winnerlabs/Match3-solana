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
import { publicKey as UmiPk } from "@metaplex-foundation/umi";

describe("match3", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = anchor.Wallet.local();
  const match3 = new Match3(provider);
  const umi = createUmi('https://api.devnet.solana.com')
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
  it("init match3 game!", async () => {
    await match3.initMatch3Info(wallet.payer);
    await match3.addNewTree(wallet.payer, umi);
    // verify
    const match3Info = await match3.program.account.match3Info.fetch(MATCH3_INFO_PDA);
    assert.equal(match3Info.totalScratchcard, 0);
    console.log("match3Info merkleTree: ", match3Info.merkleTree.toString());
  });

  it("mint scratchcard!", async () => {
  //   assert.equal(match3Info.totalScratchcard.toNumber(), 1);
  //   assert.equal(playerConfig.credits, 0);
  //   assert.equal(playerConfig.ownedScratchcard, 1);
      const [assetId, credits] =  await match3.mintScratchcard(wallet.payer, umi);
      console.log("assetId: ", assetId.toString());
      console.log("credits: ", credits);
  })

  // it("scratching scratchcard!", async () => {
  //     // const rpcAssetList = await umi.rpc.getAssetsByOwner({owner: umi.payer.publicKey})
  //     // console.log("rpcAssetList: ", rpcAssetList);
  //     // console.log("merketree:", rpcAssetList.items[0].compression.tree)
  //     // console.log("json uri: ", rpcAssetList.items[0].content.metadata.attributes)
  //     // console.log("asset id: ", rpcAssetList.items[0].id)
  //     const [assetId, _bump] = await findLeafAssetIdPda(umi, {
  //       merkleTree,
  //       leafIndex,
  //     })
  //     console.log("asset id: ", assetId.toString());
  //     // const asset = await umi.rpc.getAsset(assetId);
  //     const [numberOfScratched, latestScratchedPattern, isWon, currentCredits] = await match3.scratchingCard(wallet.payer, umi, assetId);
  //     console.log("numberOfScratched: ", numberOfScratched);
  //     console.log("latestScratchedPattern: ", latestScratchedPattern);
  //     console.log("isWon: ", isWon);
  //     console.log("currentCredits: ", currentCredits);
  // //   const passed_in_card_id = 1;                    //The user-selected scratch card ID, passed in as a parameter
  // //   // Switchboard sbQueue fixed
  //   // const sbQueue = new PublicKey("FfD96yeXs4cxZshoPPSKhSPgVQxLAJUT3gefgh84m1Di");
  //   // console.log("sb programid: ", SB_ON_DEMAND_PID.toString());
  //   // const sbProgram = new Program(LoadProgramIdl("tests/sb_on_demand_dev.json"), SB_ON_DEMAND_PID);
  //   // const rngKp = Keypair.generate();
  //   // const [randomness, ix] = await Randomness.create(sbProgram, rngKp, sbQueue);
  //   // const commitIx = await randomness.commitIx(sbQueue);
  // //   console.log("randomness address: ", randomness.pubkey.toString());
  // //   const tx = await InstructionUtils.asV0Tx(sbProgram, [ix, commitIx]);
  // //   const sig = await provider.sendAndConfirm(tx, [user, rngKp]);
  // //   console.log("Your create randomness transaction signature: ", sig);

  // //   const [scratchcardPDA]=  anchor.web3.PublicKey.findProgramAddressSync(
  // //     [new BN(passed_in_card_id).toArrayLike(Buffer, "le", 8), user.publicKey.toBuffer()],
  // //     program.programId
  // //   )
  // //   console.log("scraping scratchcard scratchcardPDA: ", scratchcardPDA.toString());
  // //   const scratchIx = await program.methods
  // //   .scratchingCard(2)
  // //   .accounts({
  // //     scratchcard: scratchcardPDA,
  // //     randomnessAccountData: randomness.pubkey,
  // //     playerConfig: playerConfigPDA,
  // //     match3Info: match3InfoPDA,
  // //   })
  // //   .instruction();
  // //   await randomness.commitAndReveal([scratchIx], [user], sbQueue)
  // //   const scratchcardInfo = await program.account.scratchCard.fetch(scratchcardPDA);
  // //   const playerConfigInfo = await program.account.playerConfig.fetch(playerConfigPDA);
  // //   assert.equal(scratchcardInfo.cardId.toNumber(), 1);
  // //   assert.equal(scratchcardInfo.numberOfScratched, 1);
  // //   assert.equal(playerConfigInfo.credits, 2);
  // //   console.log(" ✨ The pattern just scratched out is: ", scratchcardInfo.latestScratchedPattern);
  // //   console.log(" 🔮 you is win? let we check it: ", scratchcardInfo.isWin);
  // })
});

export function LoadProgramIdl(filepath: string) {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}