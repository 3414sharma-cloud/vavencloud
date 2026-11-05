/*
 * v5's look for the other pages (about, the legal pages): its styles and its header links. A page that uses it
 * also sets data-palette="sky" data-logo="brand" data-landing="v5" on <html>, so it has v5's colours and logo
 * and its links lead back to /v5/ (see app/routes.ts).
 */
import '../v2/v2.css'
import './v5.css'

export { chapters as v5Nav } from './v5.data.ts'
