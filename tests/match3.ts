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
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { DasApiAsset, dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import {Match3} from "@winnerlabs/match3"
import { keypairIdentity } from "@metaplex-foundation/umi";

describe("match3", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = anchor.Wallet.local();
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
    const match3 = new Match3(provider);
    const umi = createUmi('http://localhost:8899')
    .use(mplTokenMetadata())
    .use(mplBubblegum())
    .use(walletAdapterIdentity(wallet));

    await match3.initMatch3Info(wallet.payer);
    await match3.addNewTree(wallet.payer, umi);
    // verify
    const match3Info = await match3.program.account.match3Info.fetch(match3.match3InfoPDA);
    assert.equal(match3Info.totalScratchcard, 0);
    console.log("match3Info merkleTree: ", match3Info.merkleTree.toString());
  });

  // it("mint scratchcard!", async () => {
  //   const match3InfoBefore = await program.account.match3Info.fetch(match3InfoPDA);
  //   const [scratchcardPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [match3InfoBefore.totalScratchcard.add(new BN(1)).toArrayLike(Buffer, "le", 8), user.publicKey.toBuffer()],
  //     program.programId
  //   )
  //   console.log("create scratchcard scratchcardPDA: ", scratchcardPDA.toString());
    // const tx = await program.methods
    // .mintScratchcard(PublicKey.default)
  //   .accounts({
  //     playerConfig: playerConfigPDA,
  //     scratchcard: scratchcardPDA,
  //     match3Info: match3InfoPDA,
  //     inviterConfig: inviterPlaceholderPDA,
  //   })
  //   .rpc();
  //   console.log("Your create scratchcard transaction signature", tx);
  //   const match3Info = await program.account.match3Info.fetch(match3InfoPDA);
  //   const playerConfig = await program.account.playerConfig.fetch(playerConfigPDA);
  //   const scratchcard = await program.account.scratchCard.fetch(scratchcardPDA);
  //   console.log("scratchcard id: ", scratchcard.cardId.toNumber());
  //   assert.equal(match3Info.totalScratchcard.toNumber(), 1);
  //   assert.equal(playerConfig.credits, 0);
  //   assert.equal(playerConfig.ownedScratchcard, 1);
  //   assert.equal(scratchcard.cardId.toNumber(), 1);
  // })

  // it("scratching scratchcard!", async () => {
  //   const passed_in_card_id = 1;                    //The user-selected scratch card ID, passed in as a parameter
  //   // Switchboard sbQueue fixed
  //   const sbQueue = new PublicKey("FfD96yeXs4cxZshoPPSKhSPgVQxLAJUT3gefgh84m1Di");
  //   console.log("sb programid: ", SB_ON_DEMAND_PID.toString());
    // const sbProgram = new Program(LoadProgramIdl("tests/sb_on_demand_dev.json"), SB_ON_DEMAND_PID);
  //   const rngKp = Keypair.generate();
  //   const [randomness, ix] = await Randomness.create(sbProgram, rngKp, sbQueue);
  //   const commitIx = await randomness.commitIx(sbQueue);
  //   console.log("randomness address: ", randomness.pubkey.toString());
  //   const tx = await InstructionUtils.asV0Tx(sbProgram, [ix, commitIx]);
  //   const sig = await provider.sendAndConfirm(tx, [user, rngKp]);
  //   console.log("Your create randomness transaction signature: ", sig);

  //   const [scratchcardPDA]=  anchor.web3.PublicKey.findProgramAddressSync(
  //     [new BN(passed_in_card_id).toArrayLike(Buffer, "le", 8), user.publicKey.toBuffer()],
  //     program.programId
  //   )
  //   console.log("scraping scratchcard scratchcardPDA: ", scratchcardPDA.toString());
  //   const scratchIx = await program.methods
  //   .scratchingCard(2)
  //   .accounts({
  //     scratchcard: scratchcardPDA,
  //     randomnessAccountData: randomness.pubkey,
  //     playerConfig: playerConfigPDA,
  //     match3Info: match3InfoPDA,
  //   })
  //   .instruction();
  //   await randomness.commitAndReveal([scratchIx], [user], sbQueue)
  //   const scratchcardInfo = await program.account.scratchCard.fetch(scratchcardPDA);
  //   const playerConfigInfo = await program.account.playerConfig.fetch(playerConfigPDA);
  //   assert.equal(scratchcardInfo.cardId.toNumber(), 1);
  //   assert.equal(scratchcardInfo.numberOfScratched, 1);
  //   assert.equal(playerConfigInfo.credits, 2);
  //   console.log(" ✨ The pattern just scratched out is: ", scratchcardInfo.latestScratchedPattern);
  //   console.log(" 🔮 you is win? let we check it: ", scratchcardInfo.isWin);
  // })
});

export function LoadProgramIdl(filepath: string) {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}