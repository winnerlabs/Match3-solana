pub use anchor_lang::prelude::*;

#[account]
pub struct ScratchCard {
    pub bump : u8,                // 1
    pub card_id: u64,            // 8
    pub number_of_scratched: u8,    // 1
    pub latest_pattern: i8,      // 1
    pub pattern_contents: Vec<u8>,       // 4 + 9
}

impl ScratchCard {
    pub const LEN: usize = 8 + 1 + 8 + 1 + 1 + 4 + 9;
}