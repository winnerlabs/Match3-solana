pub use anchor_lang::prelude::*;

#[account]
pub struct ScratchCard {
    pub card_id: u64,            // 8
    pub number_of_scratch: u8,    // 1
    pub contents: Vec<u8>,       // 4 + 9
}

impl ScratchCard {
    pub const LEN: usize = 8 + 8 + 1 + 4 + 9;
}