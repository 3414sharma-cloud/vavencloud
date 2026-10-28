import './founder.css'

/*
 * Cartoon portrait of the founder: a bearded engineer in round glasses and a call-centre headset,
 * waving from behind a laptop, with a few clouds drifting behind him. Replace by setting `photo`
 * in founder.data.ts once there is a real photo.
 */

const INK = '#1e1b2e' // outline colour
const SKIN = '#f2c29b'
const SKIN_SHADE = '#d9a07a'
const HAIR = '#2f2018'
const SHIRT = '#27324f'
const BRAND = '#3d69cc'

export function founderCartoon(): string {
  return `
  <svg viewBox="0 0 240 280" class="block h-full w-full" role="img" aria-label="Cartoon portrait of Jerry Bopara, waving, wearing a headset" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="fc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0fb"/><stop offset="1" stop-color="#eef4fd"/></linearGradient>
    </defs>
    <rect width="240" height="280" fill="url(#fc-sky)"/>

    <!-- clouds -->
    <g fill="#fff" opacity="0.95">
      <g class="fc-cloud fc-cloud--a"><ellipse cx="46" cy="52" rx="24" ry="9"/><circle cx="38" cy="45" r="10"/><circle cx="54" cy="43" r="12"/></g>
      <g class="fc-cloud fc-cloud--b"><ellipse cx="196" cy="86" rx="20" ry="7"/><circle cx="190" cy="80" r="8"/><circle cx="203" cy="79" r="9"/></g>
    </g>

    <!-- body -->
    <path d="M44 280c0-46 32-80 76-80s76 34 76 80z" fill="${SHIRT}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M102 202l18 26 18-26z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M102 202l-10 14 14 4zM138 202l10 14-14 4z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- waving arm -->
    <g class="fc-wave" style="transform-origin:186px 232px">
      <path d="M186 234L206 178" stroke="${SHIRT}" stroke-width="26" stroke-linecap="round"/>
      <path d="M186 234L206 178" stroke="${INK}" stroke-width="29" stroke-linecap="round" opacity="0.0"/>
      <circle cx="209" cy="160" r="14" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
      <path d="M200 150q-2-9 2-12M208 146q0-10 4-12M216 148q2-9 6-9" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="202" cy="141" r="4" fill="${SKIN}"/><circle cx="212" cy="136" r="4.2" fill="${SKIN}"/><circle cx="222" cy="141" r="4" fill="${SKIN}"/>
    </g>

    <!-- neck and ears -->
    <rect x="106" y="160" width="28" height="42" rx="10" fill="${SKIN_SHADE}" stroke="${INK}" stroke-width="3"/>
    <circle cx="74" cy="124" r="9" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
    <circle cx="166" cy="124" r="9" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>

    <!-- head -->
    <ellipse cx="120" cy="116" rx="47" ry="53" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>

    <!-- hair -->
    <path d="M71 108C66 64 92 50 120 50c30 0 55 14 49 58-6-18-16-26-30-28-18 10-40 10-56 2-6 8-10 16-12 26z" fill="${HAIR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M112 52c4-10 16-12 22-6-8 0-12 2-14 8z" fill="${HAIR}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- beard and smile -->
    <path d="M74 126c2 40 22 58 46 58s44-18 46-58c-8 22-20 26-46 26s-38-4-46-26z" fill="${HAIR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 158q20 20 40 0q-20 6-40 0z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- face -->
    <circle cx="90" cy="136" r="8" fill="#f08a8a" opacity="0.35"/>
    <circle cx="150" cy="136" r="8" fill="#f08a8a" opacity="0.35"/>
    <path d="M86 104q10-8 22-2M132 102q12-6 22 2" stroke="${HAIR}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="101" cy="120" rx="9" ry="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
    <ellipse cx="139" cy="120" rx="9" ry="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
    <g class="pt-eye"><circle cx="103" cy="121" r="4.6" fill="${INK}"/><circle cx="104.6" cy="119.2" r="1.4" fill="#fff"/></g>
    <g class="pt-eye"><circle cx="137" cy="121" r="4.6" fill="${INK}"/><circle cx="138.6" cy="119.2" r="1.4" fill="#fff"/></g>
    <path d="M120 124q-7 14 2 18" stroke="${SKIN_SHADE}" stroke-width="3.5" stroke-linecap="round" fill="none"/>

    <!-- glasses -->
    <g fill="none" stroke="${INK}" stroke-width="3">
      <circle cx="101" cy="120" r="15"/><circle cx="139" cy="120" r="15"/><path d="M116 119q4-4 8 0"/>
    </g>
    <path d="M90 108a15 15 0 0 1 10-5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>

    <!-- headset -->
    <path d="M70 118C66 56 174 56 170 118" stroke="${BRAND}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M70 118C66 56 174 56 170 118" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5" transform="translate(0 -1)"/>
    <rect x="62" y="112" width="15" height="30" rx="7" fill="${BRAND}" stroke="${INK}" stroke-width="3"/>
    <path d="M68 142q-2 30 28 36" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="99" cy="178" r="6" fill="${BRAND}" stroke="${INK}" stroke-width="3"/>

    <!-- desk and laptop -->
    <rect x="0" y="252" width="240" height="28" fill="#b9c6de" stroke="${INK}" stroke-width="3"/>
    <rect x="82" y="214" width="76" height="46" rx="6" fill="#dbe4f2" stroke="${INK}" stroke-width="3"/>
    <path d="M110 244a8 8 0 0 1 2-15 10 10 0 0 1 19-2 9 9 0 0 1 2 17z" fill="${BRAND}"/>
    <rect x="72" y="258" width="96" height="7" rx="3.5" fill="#c1cce0" stroke="${INK}" stroke-width="3"/>
  </svg>`
}
