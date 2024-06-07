pub use anchor_lang::prelude::*;
pub use mpl_bubblegum::instructions::CreateTreeConfigCpiBuilder;
pub use crate::state::*;
pub use crate::constants::*;
pub use crate::errors::ErrorCodeCustom;

#[derive(Accounts)]
pub struct AddNewTree<'info> {
    #[account(
        mut,
        address = ADMIN_PUBKEY @ErrorCodeCustom::Unauthorized
    )]
    admin: Signer<'info>,
    #[account(mut)]
    match3_info: Account<'info, Match3Info>,
    /// CHECK: This account must be all zeros
    #[account(
        zero,
        signer
    )]
    merkle_tree: AccountInfo<'info>,
    /// CHECK: This account is checked in the instruction
    #[account(mut)]
    tree_config: UncheckedAccount<'info>,

    log_wrapper: Program<'info, Noop>,
    bubblegum_program: Program<'info, MplBubblegum>,
    compression_program: Program<'info, SplAccountCompression>,
    system_program: Program<'info, System>,
}

impl<'info> AddNewTree<'info> {
    pub fn process(ctx: Context<AddNewTree>) -> Result<()> {
        let match3_info = &mut ctx.accounts.match3_info;
        let pubkey = ctx.accounts.admin.key();
        // create a Bubblegum Tree
        msg!("Creating a Bubblegum Tree");
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"match3".as_ref(),
            pubkey.as_ref(),
            &[match3_info.bump],
        ]];
        CreateTreeConfigCpiBuilder::new(
            &ctx.accounts.bubblegum_program.to_account_info(),
        )
            .tree_config(&ctx.accounts.tree_config.to_account_info())
            .merkle_tree(&ctx.accounts.merkle_tree.to_account_info())
            .payer(&&ctx.accounts.admin.to_account_info())
            .tree_creator(&&match3_info.to_account_info())
            .log_wrapper(&ctx.accounts.log_wrapper.to_account_info())
            .compression_program(&ctx.accounts.compression_program.to_account_info())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .max_depth(MAX_TREE_DEPTH)
            .max_buffer_size(MAX_TREE_BUFFER_SIZE)
            .invoke_signed(signer_seeds)?;
        match3_info.merkle_tree = ctx.accounts.merkle_tree.key();
        msg!("Bubblegum Tree created");
        Ok(())
    }
}