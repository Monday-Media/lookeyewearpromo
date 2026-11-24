# What is stood in (draft v6)

- Wix dashboard: rebuilt from Paul's nine screenshots, not from Wix's code. Colours are sampled from the screenshots. Sizes and spacing are measured by eye.
- Dashboard typeface: Wix Madefor Text. This looks right against the screenshots but has not been confirmed as the font Wix serves in the dashboard.
- Dashboard icons: simple line stand-ins, not Wix's own icon set.
- Removed on Paul's instruction: NEW and SALE badges, Upgrade button and banner, the "Let's set up your business" panel, the Free plan row, notification counts, the Base44 card.
- Contacts, member counts and analytics figures are invented. Emails are cut short so no working address is shown. Phone numbers are from the ACMA range reserved for fiction.
- CMS rows are the site's real Home Gallery items (read from Wix, read only). The two draft rows and the items whose images were not downloaded are left out, so the table shows 18 rows under a "27 items" label.
- Site gallery: ported from the app's Header, ParallaxGallery, ParallaxColumn and GalleryImage. Column start positions are offset so the tiles don't line up in a row at the top of the shot.
- Browser windows and the pointer are drawn in code.
- Builds: elements arrive as a plain wireframe of themselves and resolve into the real UI. No colour is added (Paul, 24 Nov).
- CMS item page: rebuilt from screenshots 6 and 7 with the real VAANYARD field values.
- Product page: ported from ProductHero, ProductDescription, DragGallery, ClosingImage and FeatureGrid, with the real VAANYARD wording and pictures read from the CMS (read only). It is laid out as one long sheet for the fly-down shot. Section heights are worked out by hand, not measured from the live page. The enquiry modal is not built.
- Padlock: drawn in code as part of the browser window. The closing animation is invented.
- Analytics figures and their sparklines are invented.
- Home hero: ported from HomeHero.jsx. The intro plays a quarter faster than on the site. The film grain and the slow 22 second picture drift are left out. The header's fade-in timing is a guess.
- The hero picture is the site's own file, which is 1024 by 576, so it is soft when it fills the frame.
- Menu (11.0 to 12.4): ported from MegaMenu.jsx. The pointer visits Collections, Profile and Journal. The items and hover responses move faster than the site's springs. The pointer is the site's frosted pill with no label; whether the pill shows on menu links on the live site is not confirmed.
- "Drawn from a blank canvas" (8.0 to 9.5): the Journal page, ported from Journal.jsx with the three real posts read from the Wix blog (read only). It is drawn as a wireframe eight parts a second and resolves at 9.0. Only the first post row is drawn as wireframe; the others are below the window until the scroll.
- Closing stack (26.9 to 29.0): the site window with the dashboard home, the CMS table and the contacts beneath it. The arrangement is invented for the line "with nothing missing underneath".
- End card (29.0 to 31.0): a pin and "perth wa" (Paul, 24 Nov; no Wix Studio logo). Set in Outfit, bold then light, lowercase and tight like the logo. Outfit is a near match by eye; the logo's own typeface has not been identified. Monday Media logo at 31.0.
- Sound design (scripts/sfx.py): Flare haptic palette C2 plus four sounds made in code (lock, counter tick, draw tick, soft swell). Levels are measured, not heard.
- 12.4 to 15.06 now shows the Profile page (top of the page only, ported from ProfileHeader and BrandStorySection) so the gallery is not repeated (Paul, 24 Nov).
- End card: white pin and "Perth. WA" in Outfit bold (Paul, 24 Nov). This replaces the lowercase two-weight version.
- Sound v5: all levels down 10 to 14 LU, first hover sound and the 13.5 whoosh removed, the stack lift is a soft tone not a swell, single haptic on the logo.
- Profile page (12.4 to 15.06) now includes the sliding picture strip (the ten real ProfileGallery pictures) and the founders' section, and scrolls down through them. The strip's speed (46 px a second) and its left-to-right direction are set by eye and from Paul's description; the site's own figures have not been read.
- End card is "Perth WA" with equal gaps between pin, Perth and WA. Sounds between 16 and 19 seconds are a further 6 dB down.

## Vertical film (FilmV, 1080 x 1920), draft v1
- Same clock, cuts and sound as the 16:9 film. The only sound change is the menu: one tap at 12.18 in place of three hovers (public/audio/mix_sfx_v.wav, made with scripts/sfx.py --vertical).
- Site scenes are on a phone (390 px page) or a tablet (834 px page). Layouts follow the site's own code: two gallery columns under 768 px, the mobile header, the mobile product page sizes, the Profile and menu tablet rules. They have not been checked against screenshots from real devices.
- Phone and tablet are plain shapes drawn in code. The phone's address bar and padlock (21.0) are drawn in code.
- Tablet menu: items do not react to the tap. The code only gives them a hover response; what the live site does on touch is not confirmed.
- Profile strip uses the site's real figures here (right to left, 32 px a second, 24 on phones). The 16:9 film still runs it left to right at 46.
- Mobile product page sheet: section heights are set by hand. Sections fade up as the camera reaches them (no wireframe stage in this version).
- Dashboard shots stay desktop at full size with the camera on the relevant part; the rest falls outside the frame.
- Backdrops are darker (dim 0.74 or more) and softer than the 16:9 ones (Paul, 24 Nov).
