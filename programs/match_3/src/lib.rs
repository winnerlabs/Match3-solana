pub mod constants;
pub mod instructions;
pub mod errors;
pub mod state;
pub mod utils;


pub use instructions::*;

declare_id!("9uw5FvAMLJwjC9frPC4vZxjgE7gWAShzDWLFJx6ThfVB");

#[program]
pub mod match_3 {
    use super::*;
    pub fn init_match3(ctx: Context<InitMatch3>) -> Result<()>{
        InitMatch3::process(ctx)
    }
    pub fn init_player_config(ctx: Context<InitPlayerConfig>) -> Result<()>{
        InitPlayerConfig::process(ctx)
    }
    pub fn create_scratchcard(ctx: Context<MintScratchcard>, inviter_pubkey: Pubkey) -> Result<()>{
        MintScratchcard::process(ctx, inviter_pubkey)
    }
    pub fn scratching_card(ctx: Context<ScratchingCard>, scratching_position: u8) -> Result<()>{
        ScratchingCard::process(ctx, scratching_position)
    }
}
