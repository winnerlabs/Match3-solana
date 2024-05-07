pub use anchor_lang::prelude::*;
pub use crate::state::*;
pub use crate::constants::*;
pub use crate::utils::*;

#[derive(Accounts)]
pub struct CreateScratchcard<'info> {
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
    #[account(
        init,
        payer = player,
        seeds = [(match3_info.total_scratchcard + 1).to_le_bytes().as_ref(), player.key().as_ref()],
        bump,
        space = 8 + ScratchCard::LEN
    )]
    scratchcard: Account<'info, ScratchCard>,
    #[account(mut,
        seeds = [b"match3".as_ref(), ADMIN_PUBKEY.as_ref()],
        bump
    )]
    match3_info: Account<'info, Match3Info>,
    system_program: Program<'info, System>,
}


impl<'info> CreateScratchcard<'info> {
    pub fn process(ctx: Context<CreateScratchcard>) -> Result<()> {
        msg!("total scratchcard: {}", ctx.accounts.match3_info.total_scratchcard);
        let player_config = &mut ctx.accounts.player_config;
        if !player_config.is_initialized {
            // init player config
            player_config.is_initialized = true;
            player_config.credits = 0;
            player_config.owned_scratchcard = 0;
        }
        let scratchcard = &mut ctx.accounts.scratchcard;
        let match3_info = &mut ctx.accounts.match3_info;
        // Create scratchcard
        scratchcard.card_id = match3_info.total_scratchcard + 1;
        scratchcard.number_of_scratch = 0;
        scratchcard.contents = vec![0, 0, 0, 1, 1, 1, 2, 2, 2];  // 0:WIF, 1:BONK, 2:BOME

        // Charge a fee of 0.1 SOL.
        transfer_sol(&ctx.accounts.player.to_account_info(), &scratchcard.to_account_info(), PRICE_PER_SCRATCHCARD, &ctx.accounts.system_program, false)?;

        match3_info.total_scratchcard += 1;
        player_config.owned_scratchcard += 1;
        msg!("total scratchcard: {}", match3_info.total_scratchcard);
        Ok(())
    }
}