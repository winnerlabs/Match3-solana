use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodeCustom {
    #[msg("Unauthorized access attempt.")]
    Unauthorized,
    #[msg("Invalid Account")]
    InvalidAccount,
    #[msg("Invalid quantity, exceeded maximum allow mint quantity.")]
    InvalidQuantity,
    #[msg("Already won.")]
    AlreadyWon,
    #[msg("Randomness already revealed.")]
    RandomnessAlreadyRevealed,
    #[msg("Randomness not resolved.")]
    RandomnessNotResolved,
    #[msg("Credits not enough to play.")]
    CreditsNotEnough,
    #[msg("Exceeded maximum scratching times.")]
    ExceededMaxScratchingTimes,
}