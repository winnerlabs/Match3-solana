pub use anchor_lang::prelude::*;
pub use std::str::FromStr;

#[account]
pub struct Match3Info {
    pub bump : u8,                    // 1
    pub total_scratchcard : u64,     // 8
    pub merkle_tree: Pubkey,          // 32
    pub for_future_use : [u8; 100]   //100
}

#[account]
pub struct PlayerConfig {
    pub is_initialized : bool,        // 1
    pub bump : u8,                     // 1
    pub credits : u32,                // 4
    pub owned_scratchcard : u32,      // 4
    pub inviter_pubkey : Pubkey,      // 32
    pub for_future_use : [u8; 100]   //100
}

#[derive(Clone)]
pub struct MplBubblegum;
impl Id for MplBubblegum {
    fn id() -> Pubkey {
        mpl_bubblegum::ID
    }
}

#[derive(Clone)]
pub struct Noop;
impl Id for Noop {
    fn id() -> Pubkey {
        Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap()
    }
}

#[derive(Clone)]
pub struct SplAccountCompression;
impl Id for SplAccountCompression {
    fn id() -> Pubkey {
        Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap()
    }
}