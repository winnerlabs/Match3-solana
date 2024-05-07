use solana_program::{pubkey, pubkey::Pubkey};

pub const ADMIN_PUBKEY : Pubkey = pubkey!("6T9ajVYoL13jeNp9FCMoU9s4AEBaNFJpHvXptUz1MGag");

// There are 10^9 lamports in one SOL
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

/// scratchcard price 0.1 sol
pub const PRICE_PER_SCRATCHCARD: u64 = LAMPORTS_PER_SOL/10;