"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.LoadProgramIdl = void 0;
var anchor = require("@coral-xyz/anchor");
var chai_1 = require("chai");
var fs = require("fs");
var mpl_bubblegum_1 = require("@metaplex-foundation/mpl-bubblegum");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
var umi_signer_wallet_adapters_1 = require("@metaplex-foundation/umi-signer-wallet-adapters");
var digital_asset_standard_api_1 = require("@metaplex-foundation/digital-asset-standard-api");
var match3_1 = require("@winnerlabs/match3");
describe("match3", function () {
    // Configure the client to use the local cluster.
    var provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    var wallet = anchor.Wallet.local();
    var match3 = new match3_1.Match3(provider);
    var umi = umi_bundle_defaults_1.createUmi('https://api.devnet.solana.com')
        .use(mpl_token_metadata_1.mplTokenMetadata())
        .use(mpl_bubblegum_1.mplBubblegum())
        .use(digital_asset_standard_api_1.dasApi())
        .use(umi_signer_wallet_adapters_1.walletAdapterIdentity(wallet));
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
    it("init match3 game!", function () { return __awaiter(void 0, void 0, void 0, function () {
        var match3Info;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, match3.initMatch3Info(wallet.payer)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, match3.addNewTree(wallet.payer, umi)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, match3.program.account.match3Info.fetch(match3_1.MATCH3_INFO_PDA)];
                case 3:
                    match3Info = _a.sent();
                    chai_1.assert.equal(match3Info.totalScratchcard, 0);
                    console.log("match3Info merkleTree: ", match3Info.merkleTree.toString());
                    return [2 /*return*/];
            }
        });
    }); });
    it("mint scratchcard!", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, assetId, credits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, match3.mintScratchcard(wallet.payer, umi)];
                case 1:
                    _a = _b.sent(), assetId = _a[0], credits = _a[1];
                    console.log("assetId: ", assetId.toString());
                    console.log("credits: ", credits);
                    return [2 /*return*/];
            }
        });
    }); });
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
function LoadProgramIdl(filepath) {
    return JSON.parse(fs.readFileSync(filepath, "utf8"));
}
exports.LoadProgramIdl = LoadProgramIdl;
