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
    var umi = umi_bundle_defaults_1.createUmi('https://devnet.helius-rpc.com/?api-key=32e59a48-db47-494f-a6b6-61d9cbf64a25')
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
    it("scratching scratchcard!", function () { return __awaiter(void 0, void 0, void 0, function () {
        var rpcAssetList, assetId, _a, numberOfScratched, latestScratchedPattern, isWon, currentCredits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, umi.rpc.getAssetsByOwner({ owner: umi.payer.publicKey })];
                case 1:
                    rpcAssetList = _b.sent();
                    console.log("rpcAssetList: ", rpcAssetList);
                    console.log("merketree:", rpcAssetList.items[0].compression.tree);
                    console.log("json uri: ", rpcAssetList.items[0].content.json_uri);
                    console.log("asset id: ", rpcAssetList.items[0].id);
                    assetId = rpcAssetList.items[0].id;
                    return [4 /*yield*/, match3.scratchingCard(wallet.payer, umi, assetId, 3)];
                case 2:
                    _a = _b.sent(), numberOfScratched = _a[0], latestScratchedPattern = _a[1], isWon = _a[2], currentCredits = _a[3];
                    console.log("numberOfScratched: ", numberOfScratched);
                    console.log("currentCredits: ", currentCredits);
                    //   assert.equal(scratchcardInfo.cardId.toNumber(), 1);
                    //   assert.equal(scratchcardInfo.numberOfScratched, 1);
                    //   assert.equal(playerConfigInfo.credits, 2);
                    console.log(" ✨ The pattern just scratched out is: ", latestScratchedPattern);
                    console.log(" 🔮 you is win? let we check it: ", isWon);
                    return [2 /*return*/];
            }
        });
    }); });
});
function LoadProgramIdl(filepath) {
    return JSON.parse(fs.readFileSync(filepath, "utf8"));
}
exports.LoadProgramIdl = LoadProgramIdl;
