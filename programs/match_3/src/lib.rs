pub mod constants;
pub mod instructions;
pub mod error;
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
    pub fn create_scratchcard(ctx: Context<CreateScratchcard>) -> Result<()>{
        CreateScratchcard::process(ctx)
    }
}
