pub mod constants;
pub mod instructions;
pub mod errors;
pub mod state;
pub mod utils;


pub use instructions::*;

declare_id!("9uYGHUUG5oxpJPD4vB2KQb6QoG6Q5SpBG8c64Hd5CmYH");

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
    pub fn scraping_card(ctx: Context<ScrapingCard>, card_id: u8, scraping_position: u64) -> Result<()>{
        ScrapingCard::process(ctx, card_id, scraping_position)
    }
}
