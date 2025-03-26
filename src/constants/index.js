/**
 * Form item types
 */
export const FORM_ITEM_TYPES = {
  TITLE: 'title',
  TEXT: 'text',
  CHOICE: 'choice'
};

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Initial form items with different types, language support, and identifiers
 */
export const initialFormItems = [
  {
    id: "section-preferences",
    type: FORM_ITEM_TYPES.TITLE,
    content: {
      en: "Personal Preferences",
      de: "Persönliche Präferenzen"
    }
  },
  {
    id: "text-preferences-intro",
    type: FORM_ITEM_TYPES.TEXT,
    content: {
      en: "Please tell us about your **preferences** to help us personalize your experience. See our [privacy policy](https://example.com/privacy) for more information.",
      de: "Bitte teilen Sie uns Ihre **Präferenzen** mit, damit wir Ihr Erlebnis personalisieren können. Lesen Sie unsere [Datenschutzrichtlinie](https://example.com/privacy) für weitere Informationen."
    }
  },
  {
    id: "q-color",
    type: FORM_ITEM_TYPES.CHOICE,
    question: {
      en: "Your favourite color?",
      de: "Deine Lieblingsfarbe?"
    },
    options: [
      { id: "color-blue", en: "**dark** blue", de: "**dunkles** blaue" },
      { id: "color-green", en: "green", de: "grün" },
      { id: "color-red", en: "red", de: "rot" },
      { id: "color-yellow", en: "yellow", de: "gelb" }
    ]
  },
  {
    id: "section-travel",
    type: FORM_ITEM_TYPES.TITLE,
    content: {
      en: "Travel & Seasons",
      de: "Reisen & Jahreszeiten"
    }
  },
  {
    id: "q-travel",
    type: FORM_ITEM_TYPES.TEXT,
    question: {
      en: "What's your **favorite** travel destination? Check [travel advisories](https://example.com/travel).",
      de: "Was ist dein **Lieblings**-Reiseziel? Überprüfen Sie [Reisehinweise](https://example.com/travel)."
    },
    placeholder: {
      en: "Enter destination and why you love it...",
      de: "Geben Sie das Reiseziel ein und warum Sie es lieben..."
    }
  }
]; 