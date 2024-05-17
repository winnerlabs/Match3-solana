use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodeCustom {
    #[msg("Unauthorized access attempt.")]
    Unauthorized,
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