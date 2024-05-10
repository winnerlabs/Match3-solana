pub use anchor_lang::prelude::*;
pub use crate::state::*;
pub use crate::constants::*;
pub use crate::utils::*;

#[derive(Accounts)]
pub struct MintScratchcard<'info> {
    #[account(mut)]
    player: Signer<'info>,
    #[account(
        init,
        payer = player,
        seeds = [(match3_info.total_scratchcard + 1).to_le_bytes().as_ref(), player.key().as_ref()],
        bump,
        space = 8 + ScratchCard::LEN
    )]
    scratchcard: Account<'info, ScratchCard>,
    #[account(
        mut,
        seeds = [b"player_config".as_ref(), player.key().as_ref()],
        bump = player_config.bump,
    )]
    player_config: Account<'info, PlayerConfig>,
    #[account(mut,
        seeds = [b"match3".as_ref(), ADMIN_PUBKEY.as_ref()],
        bump = match3_info.bump,
    )]
    match3_info: Account<'info, Match3Info>,
    #[account(
        mut,
        seeds = [b"player_config".as_ref(), player_config.inviter_pubkey.as_ref()],
        bump = inviter_config.bump,
    )]
    inviter_config: Account<'info, PlayerConfig>,
    system_program: Program<'info, System>,
}


impl<'info> MintScratchcard<'info> {
    pub fn process(ctx: Context<MintScratchcard>, inviter_pubkey: Pubkey) -> Result<()> {
        msg!("total scratchcard: {}", ctx.accounts.match3_info.total_scratchcard);
        let player_config = &mut ctx.accounts.player_config;
        let inviter_config = &mut ctx.accounts.inviter_config;
        let scratchcard = &mut ctx.accounts.scratchcard;
        let match3_info = &mut ctx.accounts.match3_info;

        if player_config.inviter_pubkey.eq(&Pubkey::default()) && inviter_pubkey.ne(&Pubkey::default()) {
            // Bind invitation relationship
            player_config.inviter_pubkey = inviter_pubkey;
            player_config.credits.checked_add(5).unwrap();
            inviter_config.credits.checked_add(5).unwrap();
            msg!("inviter credits: {}, player credits: {}", inviter_config.credits, player_config.credits);
        } else if player_config.inviter_pubkey.ne(&Pubkey::default()){
            // The invitation relationship has been bound
            inviter_config.credits.checked_add(3).unwrap();
            msg!("inviter credits: {}", inviter_config.credits)
        }
        // Create scratchcard
        scratchcard.bump = ctx.bumps.scratchcard;
        scratchcard.card_id = match3_info.total_scratchcard + 1;
        scratchcard.number_of_scratched = 0;
        scratchcard.latest_pattern = 0;
        scratchcard.pattern_contents = vec![1, 1, 1, 2, 2, 2, 3, 3, 3];  // 1:WIF, 2:BONK, 3:BOME
        // Charge a fee of 0.1 SOL.
        transfer_sol(&ctx.accounts.player.to_account_info(), &match3_info.to_account_info(), PRICE_PER_SCRATCHCARD, &ctx.accounts.system_program, false)?;
        match3_info.total_scratchcard += 1;
        player_config.owned_scratchcard += 1;
        msg!("total scratchcard: {}", match3_info.total_scratchcard);
        Ok(())
    }
}