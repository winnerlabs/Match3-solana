pub use anchor_lang::prelude::*;

#[account]
pub struct Match3Info {
    pub total_scratchcard : u64,     // 8
    pub for_future_use : [u8; 100]   //100
}

#[account]
pub struct PlayerConfig {
    pub is_initialized : bool,        // 1
    pub credits : u32,                // 4
    pub owned_scratchcard : u32,      // 4
    pub for_future_use : [u8; 100]   //100
}