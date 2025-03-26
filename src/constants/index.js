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
    "id": "a",
    "type": "title",
    "content": {
      "en": "Welcome to DynamicForm",
      "de": "Willkommen bei DynamicForm"
    }
  },
  {
    "id": "b",
    "type": "text",
    "content": {
      "en": "Please log in so that your answers can be saved. If you do not yet have an account, you can create one during the registration process.",
      "de": "Bitte melden Sie sich an, damit Ihre Antworten gespeichert werden können. Wenn Sie noch kein Konto haben, können Sie sich während des Anmeldevorgangs ein Konto einrichten."
    }
  },
  {
    "id": "c",
    "type": "choice",
    "question": {
      "en": "DynamicForm supports...",
      "de": "DynamicForm unterstützt ..."
    },
    "options": [
      {
        "id": "d",
        "en": "... questions where the user can choose from a given list of answers",
        "de": "... Fragen, bei denen der Benutzer aus einer vorgegebenen Liste von Antworten auswählen kann"
      },
      {
        "id": "e",
        "en": "... questions with free text answers",
        "de": "... Fragen mit Freitextantworten"
      },
      {
        "id": "f",
        "en": "... section titles as styling elements",
        "de": "... Abschnittstitel als Stilelemente"
      },
      {
        "id": "g",
        "en": "... and free text (with markdown support) as styling elements",
        "de": "... und Freitext (mit Markdown-Unterstützung) als Stilelemente"
      }
    ]
  },
  {
    "id": "h",
    "type": "text",
    "question": {
      "en": "That's it. Have fun!",
      "de": "Das ist alles. Viel Spaß!"
    },
    "placeholder": {
      "en": "No input is expected, but feel free to enter text",
      "de": "Es ist keine Eingabe erforderlich, aber Sie können gerne Text eingeben."
    }
  }
]; 