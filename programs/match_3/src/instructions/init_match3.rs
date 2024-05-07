pub use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct InitMatch3<'info> {
    #[account(mut,
    address = ADMIN_PUBKEY)]
    admin: Signer<'info>,
    #[account(init,
    seeds = [b"match3".as_ref(), admin.key().as_ref()],
    bump,
    payer = admin,
    space = 8 + std::mem::size_of::<Match3Info>()
    )]
    match3_info: Account<'info, Match3Info>,
    system_program: Program<'info, System>,
}

impl<'info> InitMatch3<'info> {
    pub fn process(ctx: Context<InitMatch3>) -> Result<()> {
        let match3_info = &mut ctx.accounts.match3_info;
        match3_info.total_scratchcard = 0;
        Ok(())
    }
}
