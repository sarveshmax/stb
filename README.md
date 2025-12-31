# SolTokenBurner

Internal repository for the SolTokenBurner web app.

This project is a Next.js-based Solana utility that allows users to:

- Burn SPL tokens and LP tokens
- Burn NFTs
- Close empty or low-balance token accounts
- Claim SOL rent back from closed accounts
- Create new SPL tokens
- Mint additional supply for existing tokens
- Revoke Mint and Freeze Authorities
- Burn tokens held in the Incinerator wallet

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Solana Web3.js
- SPL Token / Token-2022
- Wallet Adapter (Phantom, Ledger, etc.)

## Notes

- Repo is private
- `package.json` name does not affect production or branding
- Main domain & user-facing branding: **SolTokenBurner**
- Phantom listing is independent of this repository name

## Development

```bash
npm install
npm run dev
```
