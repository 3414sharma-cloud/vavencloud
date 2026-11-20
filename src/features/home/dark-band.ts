/*
 * The landing page's blue-grey chapters (Behind, Start): in light mode a soft blue-grey band, with its own
 * colours for the headings, cards and icon boxes inside it; in dark mode a near-black band. `darkBand` goes on
 * the section, the others on its parts, over their own classes (through cn()). Their selectors
 * (html:not(.dark) …) outrank the parts' own colours, as the old stylesheet's did.
 */
export const darkBand = [
  '[html:not(.dark)_&]:border-[#d5e2ed] [html:not(.dark)_&]:text-[#40566b]',
  '[html:not(.dark)_&]:bg-[radial-gradient(ellipse_at_5%_0%,rgb(133_190_231/20%),transparent_60%),linear-gradient(135deg,#e8f1f8,#f2f6fa_80%)]',
  '[html.dark_&]:border-neutral-800 [html.dark_&]:bg-neutral-950 [html.dark_&]:text-neutral-300',
].join(' ')

/** The heading (SectionHeading's titleClassName and leadClassName) */
export const bandTitle = '[html:not(.dark)_&]:text-[#1c344b] [html:not(.dark)_&_em]:text-[#2873a7]'
export const bandLead = '[html:not(.dark)_&]:text-[#4b6278]'

/** Cards and icon boxes */
export const bandCard =
  '[html:not(.dark)_&]:border-[#d5e2ed] [html:not(.dark)_&]:bg-[#f9fcff] [html:not(.dark)_&]:text-[#40566b] [html:not(.dark)_&]:[box-shadow:0_10px_28px_rgb(42_78_111/5%)]'
export const bandIconBox = '[html:not(.dark)_&]:bg-[#e0edf7] [html:not(.dark)_&]:text-[#2873a7]'
