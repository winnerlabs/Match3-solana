pub use anchor_lang::prelude::*;
use switchboard_on_demand::accounts::RandomnessAccountData;
use switchboard_on_demand::prelude::rust_decimal::prelude::ToPrimitive;
use crate::state::*;
use crate::constants::*;
use crate::errors::*;
use crate::transfer_sol;

#[derive(Accounts)]
pub struct ScratchingCard<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [scratchcard.card_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = scratchcard.bump,
    )]
    scratchcard: Account<'info, ScratchCard>,
    /// CHECK: The account's data is validated manually within the handler.
    pub randomness_account_data: AccountInfo<'info>,
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
    system_program: Program<'info, System>,
}

impl<'info> ScratchingCard<'info> {
    pub fn process(ctx: Context<ScratchingCard>, scratching_position: u8) -> Result<()> {
        msg!("Scratching card");
        let scratchcard = &mut ctx.accounts.scratchcard;
        let player = &ctx.accounts.player.to_account_info();
        let player_config = &mut ctx.accounts.player_config;
        let match3_info = &ctx.accounts.match3_info.to_account_info();
        let system_program = &ctx.accounts.system_program.to_account_info();
        let mut pattern_result = 0;
        scratchcard.number_of_scratched += 1;
        match scratchcard.number_of_scratched {
            1 | 2  => {
                // The 1st, 2nd time free scratching card
                msg!("Scratching card 2");
                pattern_result = determine_pattern_by_randomness(&ctx.accounts.randomness_account_data, scratchcard, scratching_position)?;
            },
            3 => {
                // The 3rd time free scratching card
                pattern_result = determine_pattern_by_randomness(&ctx.accounts.randomness_account_data, scratchcard, scratching_position)?;
                check_win_and_redeem(pattern_result, scratchcard, player, match3_info, system_program)?;

            }
            4 => {
                // The 4th time scratching card consts 0.1 SOL
                transfer_sol(player, match3_info, PRICE_PER_SCRATCHCARD, system_program, false)?;
                pattern_result = determine_pattern_by_randomness(&ctx.accounts.randomness_account_data, scratchcard, scratching_position)?;
                check_win_and_redeem(pattern_result, scratchcard, player, match3_info, system_program)?;
            },
            5 => {
                // The 5th time scratching card consts 15 credits
                require!(player_config.credits >= 15, ErrorCodeCustom::CreditsNotEnough);
                player_config.credits -= 15;
                pattern_result = determine_pattern_by_randomness(&ctx.accounts.randomness_account_data, scratchcard, scratching_position)?;
                check_win_and_redeem(pattern_result, scratchcard, player, match3_info, system_program)?;
            },
            _ => {
                // invalid
            }
        }
        scratchcard.latest_scratched_pattern = pattern_result;
        player_config.credits += 2;
        Ok(())
    }
}

fn determine_pattern_by_randomness<'info>(randomness_account_data: &AccountInfo<'info>,
    scratchcard: &mut Account<'info, ScratchCard>, scratching_position: u8) -> Result<u8> {
    msg!("determine_pattern_by_randomness in");
    let clock = Clock::get()?;
    let position = scratching_position.to_usize().unwrap();
    let randomness_data = RandomnessAccountData::parse(randomness_account_data.data.borrow()).unwrap();

    let revealed_random_value = randomness_data.get_value(&clock)
    .map_err(|_| ErrorCodeCustom::RandomnessNotResolved)?;
    let size = scratchcard.pattern_contents.len().to_u8().unwrap();
    msg!("current size: {}", size);
    let result_index = (revealed_random_value[position]%size).to_usize().unwrap();
    let pattern_result = scratchcard.pattern_contents.remove(result_index);
    Ok(pattern_result)
}

// check whether the scratchcard is win or not, if win then redeem the prize
fn check_win_and_redeem<'info> (pattern_result: u8, scratchcard: &mut Account<'info, ScratchCard>,
    player: &AccountInfo<'info>, match3_info: &AccountInfo<'info>, system_program: &AccountInfo<'info>,) -> Result<()>{
    scratchcard.is_win = !scratchcard.pattern_contents.iter().any(|&pattern| pattern == pattern_result);
    let reward_amount;
    if scratchcard.is_win {
        match pattern_result {
            1 => {
                reward_amount = calculate_reward(scratchcard.number_of_scratched, REWARD_WIF);
                transfer_sol(match3_info, player, reward_amount, system_program, false)?;
            },
            2 => {
                reward_amount = calculate_reward(scratchcard.number_of_scratched, REWARD_BONK);
                transfer_sol(match3_info, player, reward_amount, system_program, false)?;
            },
            3 => {
                reward_amount = calculate_reward(scratchcard.number_of_scratched, REWARD_BOME);
                transfer_sol(match3_info, player, reward_amount, system_program, false)?;
            },
            _ => {
                // invalid
                msg!("Impssible! Invalid patter_result");
            }
        }
    }
    msg!("ScratchCard is_win: {}", scratchcard.is_win);
    Ok(())
}

fn calculate_reward (scratch_times: u8, raw_reward: u64) -> u64 {
    match scratch_times {
        3 => {
            // The 3rd time scratching card
            raw_reward
        },
        4 => {
            // The 4th time, reward * 80%
            raw_reward.checked_mul(4).unwrap()/5
        },
        5 => {
            // The 5th time, reward * 60%
            raw_reward.checked_mul(3).unwrap()/5
        },
        _ => {
            // invalid
            msg!("Impssible! Invalid scratch_times");
            0
        }
    }
}