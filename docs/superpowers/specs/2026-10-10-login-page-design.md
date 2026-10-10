# Login Page Redesign

## Goal
Rebuild the login page as a split layout (decorative left panel, form right), modelled on the reference screenshot, using only existing shadcn tokens and components.

## Decisions
- Methods: username/email + password form, plus Google button. No LinkedIn.
- UI only: no auth, validation, or new libraries. Only state is the password visibility toggle.
- Left panel: gradient placeholder (token-based), placeholder illustration block, title, description, two static dots. Hidden below `lg`.
- Colors: existing theme tokens only; `src/styles.css` unchanged.
- Language: Indonesian; brand text from `APP_NAME`.
- `_auth` layout becomes the split layout; old header removed.
- "Lupa password?" and "Buat akun" are `href="#"` placeholders.

## Files
- `src/routes/_auth/route.tsx`: two-column grid; left panel + `<Outlet />` on the right.
- `src/routes/_auth/login.tsx`: logo, greeting, title, Field/Label/Input for username/email, InputGroup + Eye/EyeOff toggle for password, Login button, forgot link, Separator "Atau", Google outline button, create-account link.
- `src/components/logo.tsx`: replace "ReUI" with `APP_NAME`.

## Out of scope
Auth logic, validation, working carousel, real illustration asset, theme changes.

## Verification
`npm run typecheck`, `npm run lint`, then view in dev server.
