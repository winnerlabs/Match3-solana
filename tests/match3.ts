import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert, expect } from "chai";
import { Match3 } from "../target/types/match_3";
import { BN } from "bn.js";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, CreateAccountParams} from "@solana/web3.js";
import {
  SB_ON_DEMAND_PID,
  Randomness,
  InstructionUtils,
} from "@switchboard-xyz/on-demand";
import * as fs from "fs";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

describe("match3", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const user = anchor.Wallet.local().payer;

  const program = anchor.workspace.Match3 as Program<Match3>;

  const [match3InfoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("match3"), user.publicKey.toBuffer()],
    program.programId
  )
  const [inviterPlaceholderPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("player_config"), PublicKey.default.toBuffer()],
    program.programId
  );
  it("init match3 game!", async () => {
    const tx = await program.methods
    .initMatch3()
    .accounts({
      match3Info: match3InfoPDA,
      placeHolder: inviterPlaceholderPDA,
    })
    .rpc();
    console.log("Your init match3 transaction signature", tx);

    const match3Info = await program.account.match3Info.fetch(match3InfoPDA);
    assert.equal(match3Info.totalScratchcard.toNumber(), 0)
  });

  const [playerConfigPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("player_config"), user.publicKey.toBuffer()],
    program.programId
  );

  it("init player config!", async () => {
    const tx = await program.methods
    .initPlayerConfig()
    .accounts({
      playerConfig: playerConfigPDA,
    })
    .rpc();
    console.log("Your init player config transaction signature", tx);
  })

  it("mint scratchcard!", async () => {
    const match3InfoBefore = await program.account.match3Info.fetch(match3InfoPDA);
    const [scratchcardPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [match3InfoBefore.totalScratchcard.add(new BN(1)).toArrayLike(Buffer, "le", 8), user.publicKey.toBuffer()],
      program.programId
    )
    console.log("create scratchcard scratchcardPDA: ", scratchcardPDA.toString());
    const tx = await program.methods
    .createScratchcard(PublicKey.default)
    .accounts({
      playerConfig: playerConfigPDA,
      scratchcard: scratchcardPDA,
      match3Info: match3InfoPDA,
      inviterConfig: inviterPlaceholderPDA,
    })
    .rpc();
    console.log("Your create scratchcard transaction signature", tx);
    const match3Info = await program.account.match3Info.fetch(match3InfoPDA);
    const playerConfig = await program.account.playerConfig.fetch(playerConfigPDA);
    const scratchcard = await program.account.scratchCard.fetch(scratchcardPDA);
    assert.equal(match3Info.totalScratchcard.toNumber(), 1);
    assert.equal(playerConfig.credits, 0);
    assert.equal(playerConfig.ownedScratchcard, 1);
    assert.equal(scratchcard.cardId.toNumber(), 1);
    let balanceInSol = await program.provider.connection.getBalance(scratchcardPDA)/LAMPORTS_PER_SOL;
    console.log("scratchcard balance: ", balanceInSol);
  })

  // it("scraping scratchcard!", async () => {
  //   // Switchboard sbQueue fixed
  //   const sbQueue = new PublicKey("5Qv744yu7DmEbU669GmYRqL9kpQsyYsaVKdR8YiBMTaP");
  //   console.log("sb programid: ", SB_ON_DEMAND_PID.toString());
  //   // const sbIdl = await Program.fetchIdl(SB_ON_DEMAND_PID, provider);
  //   // const sbProgram = new Program(sbIdl!, SB_ON_DEMAND_PID, provider);
  //   const sbProgram = new Program(LoadProgramIdl("tests/sb_on_demand_dev.json"), SB_ON_DEMAND_PID);
  //   const rngKp = Keypair.generate();
  //   const [randomness, ix] = await Randomness.create(sbProgram, rngKp, sbQueue);
  //   console.log("randomness: ", randomness.pubkey.toString());
  //   const tx = await InstructionUtils.asV0Tx(sbProgram, [ix]);
  //   const sig = await provider.sendAndConfirm(tx, [user, rngKp]);
  //   console.log("Your create randomness transaction signature", sig);

  //   const [scratchcardPDA]=  anchor.web3.PublicKey.findProgramAddressSync(
  //     [new BN(1).toArrayLike(Buffer, "le", 8), user.publicKey.toBuffer()],
  //     program.programId
  //   )
  //   console.log("scraping scratchcard scratchcardPDA: ", scratchcardPDA.toString());
  //   const tx1 = await program.methods
  //   .scrapingCard(1, new BN(2))
  //   .accounts({
  //     scratchcard: scratchcardPDA,
  //     randomnessAccountData: randomness.pubkey,
  //   })
  //   .instruction()
  //   const rx = await randomness.commitAndReveal([tx1], [user], sbQueue)
  // })
});

export function LoadProgramIdl(filepath: string) {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}