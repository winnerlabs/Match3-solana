pub use anchor_lang::prelude::*;
pub use crate::state::*;
pub use crate::constants::*;
pub use crate::utils::*;

#[derive(Accounts)]
pub struct InitPlayerConfig<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        init,
        payer = player,
        seeds = [b"player_config".as_ref(), player.key().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<PlayerConfig>()
    )]
    player_config: Account<'info, PlayerConfig>,
    system_program: Program<'info, System>,
}

impl <'info> InitPlayerConfig<'info> {
    pub fn process(ctx: Context<InitPlayerConfig>) -> Result<()> {
        // init player config
        let player_config = &mut ctx.accounts.player_config;
        player_config.bump = ctx.bumps.player_config;
        player_config.credits = 0;
        player_config.owned_scratchcard = 0;
        player_config.inviter_pubkey = Pubkey::default();        // placeholder, will be updated in mint_scratchcard
        Ok(())
    }
}