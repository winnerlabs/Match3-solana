use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCodeCustom {
    #[msg("Unauthorized access attempt.")]
    Unauthorized,
    #[msg("Randomness already revealed.")]
    RandomnessAlreadyRevealed,
    #[msg("Randomness not resolved.")]
    RandomnessNotResolved,
}