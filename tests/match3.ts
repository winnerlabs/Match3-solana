import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert, expect } from "chai";
import { Match3 } from "../target/types/match_3";
import { BN, isBN } from "bn.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("match3", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const user = anchor.Wallet.local().payer;

  const program = anchor.workspace.Match3 as Program<Match3>;

  const [match3InfoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("match3"), user.publicKey.toBuffer()],
    program.programId
  )
  it("init match3 game!", async () => {
    const tx = await program.methods
    .initMatch3()
    .accounts({
      match3Info: match3InfoPDA,
    })
    .rpc();
    console.log("Your transaction signature", tx);

    const match3Info = await program.account.match3Info.fetch(match3InfoPDA);
    assert.equal(match3Info.totalScratchcard.toNumber(), 0)
  });

  const [playerConfigPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("player_config"), user.publicKey.toBuffer()],
    program.programId
  );
  const match3Info = program.account.match3Info.fetch(match3InfoPDA);

  it("create scratchcard!", async () => {
    const match3Info_before = await program.account.match3Info.fetch(match3InfoPDA);
    const [scratchcardPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [match3Info_before.totalScratchcard.add(new BN(1)).toArrayLike(Buffer, "le", 8), user.publicKey.toBuffer()],
      program.programId
    )
    console.log("scratchcardPDA: ", scratchcardPDA.toString());
    const tx = await program.methods
    .createScratchcard()
    .accounts({
      playerConfig: playerConfigPDA,
      scratchcard: scratchcardPDA,
      match3Info: match3InfoPDA,
    })
    .rpc();
    console.log("Your create scratchcard transaction signature", tx);
    const match3Info = await program.account.match3Info.fetch(match3InfoPDA);
    const player_config = await program.account.playerConfig.fetch(playerConfigPDA);
    const scratchcard = await program.account.scratchCard.fetch(scratchcardPDA);
    assert.equal(match3Info.totalScratchcard.toNumber(), 1);
    assert.equal(player_config.credits, 0);
    assert.equal(player_config.ownedScratchcard, 1);
    assert.equal(scratchcard.cardId.toNumber(), 1);
    let balanceInSol = await program.provider.connection.getBalance(scratchcardPDA)/LAMPORTS_PER_SOL;
    console.log("scratchcard balance: ", balanceInSol);
  })
});
