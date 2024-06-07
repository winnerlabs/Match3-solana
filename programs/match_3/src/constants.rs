use solana_program::{pubkey, pubkey::Pubkey};

pub const ADMIN_PUBKEY : Pubkey = pubkey!("6T9ajVYoL13jeNp9FCMoU9s4AEBaNFJpHvXptUz1MGag");

// There are 10^9 lamports in one SOL
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

/// scratchcard price 0.1 sol
pub const PRICE_PER_SCRATCHCARD: u64 = LAMPORTS_PER_SOL/10;

/// 3 WIFs reward
pub const REWARD_WIF : u64 = 10 * LAMPORTS_PER_SOL;
/// 3 BONKS reward
pub const REWARD_BONK : u64 = 2 * LAMPORTS_PER_SOL;
/// 3 BOMES reward
pub const REWARD_BOME : u64 = LAMPORTS_PER_SOL/2;

/// Merkletree config, max supply 1,048,576
pub const MAX_TREE_DEPTH: u32 = 20;
pub const MAX_TREE_BUFFER_SIZE: u32 = 64;