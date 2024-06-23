pub use anchor_lang::prelude::*;

#[account]
pub struct ScratchCard {
    pub bump : u8,                // 1
    pub is_initialized: bool,      // 1
    pub is_win: bool,                 // 1
    pub number_of_scratched: u8,    // 1
    pub latest_scratched_pattern: u8,  // 1
    pub for_future_use : [u8; 100],    //100
    pub pattern_contents: Vec<u8>,       // 4 + 9
}

impl ScratchCard {
    pub const LEN: usize = 8 + 1 + 1 + 1 + 1 + 1 + 100 + 4 + 9;
}