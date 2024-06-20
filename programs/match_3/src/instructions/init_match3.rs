pub use anchor_lang::prelude::*;
pub use crate::state::*;
pub use crate::constants::*;
pub use crate::errors::ErrorCodeCustom;

#[derive(Accounts)]
pub struct InitMatch3<'info> {
    #[account(
        mut,
        address = ADMIN_PUBKEY @ErrorCodeCustom::Unauthorized
    )]
    admin: Signer<'info>,
    #[account(
        init,
        seeds = [b"match3".as_ref(), admin.key().as_ref()],
        bump,
        payer = admin,
        space = 8 + std::mem::size_of::<Match3Info>()
    )]
    match3_info: Account<'info, Match3Info>,
    #[account(
        init,
        payer = admin,
        seeds = [b"player_config".as_ref(), Pubkey::default().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<PlayerConfig>()
    )]
    // Create a PDA account for Pubkey::default() to serve as a placeholder for inviter_config account in the later mint_scratchcard instruction.
    place_holder: Account<'info, PlayerConfig>,
    system_program: Program<'info, System>,
}

impl<'info> InitMatch3<'info> {
    pub fn process(ctx: Context<InitMatch3>) -> Result<()> {
        let match3_info = &mut ctx.accounts.match3_info;
        let place_holder = &mut ctx.accounts.place_holder;
        match3_info.bump = ctx.bumps.match3_info;
        match3_info.total_scratchcard = 0;
        match3_info.merkle_tree = Pubkey::default();

        place_holder.bump = ctx.bumps.place_holder;
        Ok(())
    }
}
