pub use anchor_lang::prelude::*;
pub use crate::state::*;
pub use crate::constants::*;
pub use crate::utils::*;
use crate::ErrorCodeCustom;
use mpl_bubblegum::instructions::MintV1CpiBuilder;
use mpl_bubblegum::types::{Creator, MetadataArgs, TokenStandard, TokenProgramVersion};
#[derive(Accounts)]
#[instruction(inviter_pubkey: Pubkey)]
pub struct MintScratchcard<'info> {
    #[account(mut)]
    player: Signer<'info>,

    #[account(
        init_if_needed,
        payer = player,
        seeds = [b"player_config".as_ref(), player.key().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<PlayerConfig>()
    )]
    player_config: Account<'info, PlayerConfig>,
    #[account(mut,
        seeds = [b"match3".as_ref(), ADMIN_PUBKEY.as_ref()],
        bump = match3_info.bump,
    )]
    match3_info: Account<'info, Match3Info>,
    #[account(
        init_if_needed,
        payer = player,
        seeds = [b"player_config".as_ref(), inviter_pubkey.as_ref()],
        bump,
        space = 8 + std::mem::size_of::<PlayerConfig>()
    )]
    inviter_config: Account<'info, PlayerConfig>,
    /// CHECK: This account is checked in the instruction
    #[account(mut)]
    tree_config: UncheckedAccount<'info>,
    /// CHECK: This account is neither written to nor read from.
    leaf_owner: AccountInfo<'info>,
    /// CHECK: Account address check
    #[account(
        mut,
        address = match3_info.merkle_tree @ErrorCodeCustom::InvalidAccount
    )]
    merkle_tree: AccountInfo<'info>,
    log_wrapper: Program<'info, Noop>,
    compression_program: Program<'info, SplAccountCompression>,
    bubblegum_program: Program<'info, MplBubblegum>,
    system_program: Program<'info, System>,
}


impl<'info> MintScratchcard<'info> {
    pub fn process(ctx: Context<MintScratchcard>, inviter_pubkey: Pubkey, mint_quantity: u8) -> Result<()> {
        let player_config = &mut ctx.accounts.player_config;
        let inviter_config = &mut ctx.accounts.inviter_config;
        let match3_info = &mut ctx.accounts.match3_info;
        // Charge a fee of 0.1 SOL.
        let amounts = PRICE_PER_SCRATCHCARD.checked_mul(mint_quantity as u64).unwrap();
        transfer_sol(&mut ctx.accounts.player.to_account_info(), &match3_info.to_account_info(), amounts, &ctx.accounts.system_program, false)?;
        if !inviter_config.is_initialized {
            msg!("inviter_config is not initialized");
            // init inviter config
            inviter_config.is_initialized = true;
            inviter_config.bump = ctx.bumps.inviter_config;
            inviter_config.credits = 0;
            inviter_config.owned_scratchcard = 0;
            player_config.inviter_pubkey = Pubkey::default();
            msg!("inviter_config is initialized successfully");
        }
        if !player_config.is_initialized {
            msg!("player_config is not initialized");
            // init player config
            player_config.is_initialized = true;
            player_config.bump = ctx.bumps.player_config;
            player_config.credits = 0;
            player_config.owned_scratchcard = 0;
            player_config.inviter_pubkey = Pubkey::default();        // placeholder, will be updated later
            msg!("player_config is initialized successfully");
        }

        if player_config.inviter_pubkey.eq(&Pubkey::default()) && inviter_pubkey.ne(&Pubkey::default()) {
            // Bind invitation relationship
            player_config.inviter_pubkey = inviter_pubkey;
            player_config.credits.checked_add(5).unwrap();
            inviter_config.credits.checked_add(5).unwrap();
            msg!("Bind invitation relationship, inviter credits: {}, player credits: {}", inviter_config.credits, player_config.credits);
        }

        for index in 0..mint_quantity {
            // mint scratchcard cNFTs
            MintV1CpiBuilder::new(&ctx.accounts.bubblegum_program.to_account_info())
                .tree_config(&ctx.accounts.tree_config.to_account_info())
                .leaf_owner(&ctx.accounts.leaf_owner.to_account_info())
                .leaf_delegate(&ctx.accounts.leaf_owner.to_account_info())
                .merkle_tree(&ctx.accounts.merkle_tree.to_account_info())
                .payer(&ctx.accounts.player.to_account_info())
                .tree_creator_or_delegate(&match3_info.to_account_info())
                .log_wrapper(&ctx.accounts.log_wrapper.to_account_info())
                .compression_program(&ctx.accounts.compression_program.to_account_info())
                .system_program(&ctx.accounts.system_program.to_account_info())
                .metadata( MetadataArgs {
                    name: format!("Scratchcard #{}", match3_info.total_scratchcard),
                    symbol: "SCNS".to_string(),
                    uri: "https://shdw-drive.genesysgo.net/FnZUwmLXWYwdH9KmAsEkc9kNM6qGo6Qb5sDdvJGdqbjy/scratchcard_default.json".to_string(),
                    seller_fee_basis_points: 100,
                    primary_sale_happened: false,
                    is_mutable: true,
                    edition_nonce: None,
                    token_standard: Some(TokenStandard::NonFungible),
                    collection: None,
                    uses: None,
                    token_program_version: TokenProgramVersion::Original,
                    creators: vec![
                        Creator {address: ctx.accounts.leaf_owner.key().clone(), verified: true, share: 70},
                        Creator {address: match3_info.key().clone(), verified: true, share: 30},
                    ]
                }).invoke_signed(&[&[
                    b"match3".as_ref(),
                    ADMIN_PUBKEY.as_ref(),
                    &[match3_info.bump],
                ]]).unwrap();
            msg!("mint index {} scratchcard cNFT success", index);
            if player_config.inviter_pubkey.ne(&Pubkey::default()) {
                // The invitation relationship has been bound
                inviter_config.credits.checked_add(3).unwrap();
                msg!("[mint scratchcard] inviter credits: {}", inviter_config.credits)
            }
            match3_info.total_scratchcard += 1;
            player_config.owned_scratchcard += 1;
            msg!("total scratchcard: {}", match3_info.total_scratchcard);
        }
        Ok(())
    }
}