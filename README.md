# NFT preview card

An implementation of the [Frontend Mentor NFT preview card challenge](https://www.frontendmentor.io/challenges/nft-preview-card-component-SbdUL_w0U), using its supplied artwork, avatar, icons, copy and design references.

The card keeps the sample price and time remaining as presentation text. It has no wallet, sale, account, live countdown or personal-data storage. The image/title link to the original artwork. An inline native disclosure reveals the supplied creator credit. Both work with mouse, keyboard and JavaScript disabled.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome and own port 4389. Dependency resolution and rendered verification are pending in this source preparation.

Next 16.3.6, React 19.2.8, TypeScript and Tailwind 4 are pinned to the current family baseline. The page is a server component. There is no application client state or backend.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Desktop/mobile/active references guide the authored CSS. The 16px family text floor and 44px interactive targets can increase vertical spacing compared with the reference.

Outfit is served locally from the Google Fonts repository at commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`, under the bundled SIL Open Font License. The font bytes are unchanged.

## Implementation choice

A client dialog adds hydration and modal focus management for a static image. An initial popover proposal was rejected in review because its dark backdrop implied modality without focus containment. Direct artwork links plus inline native creator disclosure keep the required hover/focus behavior with ordinary browser navigation and no overlay.
