use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};



pub fn transfer_sol<'info>(from: &AccountInfo<'info>, to: &AccountInfo<'info>, amount: u64, system_program: &AccountInfo<'info>, from_is_pda: bool) -> Result<()> {
    msg!("from lamports: {}, to lamports: {}", from.lamports(), to.lamports());
    if from_is_pda {
        from.sub_lamports(amount)?;
        to.add_lamports(amount)?;
    } else {
        // transfer sol from another account to pda function
        transfer(
            CpiContext::new(
                system_program.clone(),
                Transfer {
                    from:from.clone(),
                    to: to.clone(),
                }),
                amount,
        )?;
    }
    msg!("from lamports: {}, to lamports: {}", from.lamports(), to.lamports());
    Ok(())
}
