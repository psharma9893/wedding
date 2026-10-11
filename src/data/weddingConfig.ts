/**
 * ─────────────────────────────────────────────────────────────
 *  ALL EDITABLE WEDDING TEXT LIVES HERE.
 *  Change names, dates, times, phone numbers and messages in this
 *  file only — the visual components read from it.
 *
 *  Every value below was transcribed from the invitation PDF and the
 *  RSVP card. Nothing has been invented. A field left as an empty
 *  string ('') is simply hidden on the site.
 * ─────────────────────────────────────────────────────────────
 */

export interface WeddingEvent {
  id: string;
  /** Short name shown in the schedule */
  name: string;
  /** Tagline exactly as printed on the card */
  tagline: string;
  /** Human-readable date, e.g. "Wednesday, 9th December 2026" */
  dateLabel: string;
  /** Human-readable time, e.g. "11:00 AM onwards" */
  timeLabel: string;
  /** ISO start in India time — used for the calendar file */
  startISO: string;
  venue: string;
  /** Google Maps link for this event's venue ('' = no Directions button) */
  mapsUrl: string;
  note?: string;
  /** Optional dress code shown on the event card and in the schedule ('' = hidden) */
  dressCode?: string;
}

const JUSTA_RASA_MAPS = 'https://maps.app.goo.gl/4jZfXge8vnKBEFtS8';

export const weddingConfig = {
  couple: {
    bride: 'Nishtha',
    groom: 'Pranshu',
    /** Name order everywhere on the invite. This is the groom's-side invite, so Pranshu comes first. */
    first: 'Pranshu',
    second: 'Nishtha',
    /** Initials used on the wax seal and favicon */
    monogram: 'P & N',
  },

  /** Main wedding moment — drives the countdown on the "We've picked the date" section */
  weddingDate: {
    label: 'Saturday, 12th December 2026',
    short: '12 · 12 · 2026',
    countdownTargetISO: '2026-12-12T10:00:00+05:30',
    city: 'Rishikesh',
  },

  venue: {
    name: 'Justa Rasa',
    city: 'Rishikesh',
    mapsUrl: JUSTA_RASA_MAPS,
  },

  envelope: {
    eyebrow: 'You are invited to the wedding of',
    line: '11th & 12th December 2026 · Justa Rasa, Rishikesh',
    cta: 'Open Your Invitation',
  },

  /** Formal invitation (groom's side), word for word */
  formalInvitation: {
    invocation: 'Shri Ganeshaya Namah',
    opening: 'Dear Family and Friends with the blessings of our elders',
    hostFamily: [
      'Late Smt. Shanti Devi & Late Shri Baboo Ram Sharma',
      'Late Smt. Shanti Devi & Late Shri Chandrabhan Sharma',
      'Mr Harish Kumar Sharma & Mrs Renu Sharma',
    ],
    inviteLine: 'joyfully invite you to celebrate the union of their son',
    otherParentsLine: 'beloved daughter of',
    otherParents: 'Mr Sharad Kumar & Mrs Alpna',
  },

  /** Events in the order they appear in the PDF */
  events: [
    {
      id: 'mehndi',
      name: 'Mehndi',
      tagline: 'Mehndi Laga ke Rakhna',
      dateLabel: 'Wednesday, 9th December 2026',
      timeLabel: '11:00 AM onwards',
      startISO: '2026-12-09T11:00:00+05:30',
      venue: 'At our residence',
      // Add the home address / Google Maps pin here when ready; it appears in the schedule.
      mapsUrl: '',
      dressCode: 'Shades of green / pink',
    },
    {
      id: 'photoshoot',
      name: 'Photoshoot',
      tagline: 'Photoshoot with bride and groom',
      dateLabel: 'Friday, 11th December 2026',
      timeLabel: '11 AM onwards',
      startISO: '2026-12-11T11:00:00+05:30',
      venue: 'Justa Rasa, Rishikesh',
      mapsUrl: JUSTA_RASA_MAPS,
    },
    {
      id: 'haldi',
      name: 'Haldi',
      tagline: 'Haldi Hues — In our yellow era',
      dateLabel: 'Friday, 11th December 2026',
      // The printed card reads "12 AM onwards"; confirmed as 12 PM (noon).
      timeLabel: '12 PM onwards',
      startISO: '2026-12-11T12:00:00+05:30',
      venue: 'Justa Rasa, Rishikesh',
      mapsUrl: JUSTA_RASA_MAPS,
      dressCode: 'Shades of yellow',
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      tagline: 'Sangeet Night and Party Lights',
      dateLabel: 'Friday, 11th December 2026',
      timeLabel: '6:00 PM onwards',
      startISO: '2026-12-11T18:00:00+05:30',
      venue: 'Justa Rasa, Rishikesh',
      mapsUrl: JUSTA_RASA_MAPS,
      note: "Let's dance good times together!",
      dressCode: 'Blingy',
    },
    {
      id: 'wedding',
      name: 'The Wedding Day',
      tagline: 'Two hearts, one forever.',
      dateLabel: 'Saturday, 12th December 2026',
      timeLabel: 'Baraat — 10:00 AM onwards',
      startISO: '2026-12-12T10:00:00+05:30',
      venue: 'Justa Rasa, Rishikesh',
      mapsUrl: JUSTA_RASA_MAPS,
      dressCode: 'Traditional',
    },
  ] as WeddingEvent[],

  /** RSVP card ("your presence make" on the card is corrected to "makes") */
  rsvp: {
    welcome: 'Dearest Family and Friends,',
    message:
      'We are thrilled to have you with us to celebrate the wedding ceremony of our beloved son. Thank you for traveling near and far to be with us, your presence makes these precious moments even more memorable.',
    contacts: [
      { name: 'Priya', phone: '+91 73874 24280' },
      { name: 'Gaurav', phone: '+91 99990 40244' },
    ],
    /**
     * Optional online RSVP form (e.g. a Google Form linked to the Guest List sheet).
     * Paste its share link here to show an "RSVP online" button. '' = hidden.
     */
    formUrl: '',
    /** Event manager — shown below the RSVP contacts as the person to call with any queries */
    eventManager: {
      name: 'Moumita Mukherjee',
      phone: '+91 97111 33971',
      note: 'For any queries about the events, travel or stay, please contact our event manager.',
    },
    /** Pre-filled WhatsApp message ('' = open an empty chat) */
    whatsappMessage: "Hi! We've received Pranshu & Nishtha's wedding invitation and would love to RSVP.",
  },

  /** "With best compliments" — RSVP card */
  compliments: {
    heading: 'With best compliments',
    names: [
      'Shri Prahlad Kumar Sharma & Sudha Sharma',
      'Shri RP Sharma & Rekha Sharma',
      'Shri Ramakant and Manju Sharma',
      'Gopal ji & Geeta',
      'Lalji & Lata',
    ],
  },

  /** The little ones' note — RSVP card */
  kidsNote: {
    to: 'Dear Arya, Aditi, Nandu, Raja',
    message: 'Mere mama ki shadi main Jalool Jalool Aana',
    from: 'Akira (Manku)',
  },

  /** Travel & Stay section. Any item with an empty text is hidden. */
  travel: {
    title: 'Travel & Stay',
    items: [
      { label: 'By air', text: 'Jolly Grant Airport, Dehradun — about 35 km from Rishikesh, roughly an hour by road.' },
      { label: 'By train', text: 'Haridwar Junction is about 25 km away; Yog Nagari Rishikesh station is closer to town.' },
      { label: 'Stay', text: 'Guests will be staying at Justa Rasa, Rishikesh.' },
      { label: 'Weather', text: 'December evenings in Rishikesh are chilly — please carry warm layers and a shawl.' },
    ],
  },

  /** Floating RSVP button shown while scrolling ('' = hidden) */
  floatingRsvpLabel: 'RSVP',

  closing: {
    line: 'Somewhere between all the flowers and festivities… two people are getting married.',
    signoff: 'We can’t wait to celebrate with you.',
  },

  /**
   * Optional background music. Leave src as '' to hide the music button.
   * To enable: put an MP3 you have the rights to use at public/audio/music.mp3
   * and set src: 'audio/music.mp3'.
   */
  music: {
    src: '',
    title: '',
  },

  /** Link-preview text (WhatsApp, iMessage, etc.) */
  share: {
    title: 'Pranshu & Nishtha · Wedding Invitation · 12 December 2026',
    description:
      'You are invited to celebrate the wedding of Pranshu & Nishtha — 11th & 12th December 2026, Justa Rasa, Rishikesh.',
    themeColor: '#5e1f39',
  },
};

export type WeddingConfig = typeof weddingConfig;
