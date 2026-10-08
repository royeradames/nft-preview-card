# NFT preview card

An implementation of the [Frontend Mentor NFT preview card challenge](https://www.frontendmentor.io/challenges/nft-preview-card-component-SbdUL_w0U), using its supplied artwork, avatar, icons, copy and design references.

The card keeps the sample price and time remaining as presentation text. It has no wallet, sale, account, live countdown or personal-data storage. The image/title link to the original artwork. An inline native disclosure reveals the supplied creator credit. Both work with mouse, keyboard and JavaScript disabled.

## Development

Live: https://nft-preview-card.royeradames.com/

Node 24. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome on port 4389 (`PORT` overrides it). `tests/design.spec.ts` checks the Figma desktop, active and mobile frames, the site identity, and every width from 320 to 1600 px in 10 px steps.

Next 16.3.6, React 19.2.8, TypeScript and Tailwind 4 are pinned to the current family baseline. The page is a server component. There is no application client state or backend.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Desktop/mobile/active references guide the authored CSS. The card follows the Figma frames: 350 px wide, 24 px padding and a 24 px stack, with the design's 16 to 22 px type. The title link and creator name keep the design's type size and meet the 24 px WCAG 2.5.8 target floor; footer links keep 44 px targets. `og:site_name` and WebSite JSON-LD name the site "NFT Preview Card".

Outfit is served locally from the Google Fonts repository at commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`, under the bundled SIL Open Font License. The font bytes are unchanged.

## Implementation choice

A client dialog adds hydration and modal focus management for a static image. An initial popover proposal was rejected in review because its dark backdrop implied modality without focus containment. Direct artwork links plus inline native creator disclosure keep the required hover/focus behavior with ordinary browser navigation and no overlay.
