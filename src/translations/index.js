/**
 * Translations for UI elements in different languages
 */
export const uiTranslations = {
  en: {
    title: "DynamicForm",
    debugMode: "Debug",
    formItems: "Form Items (Debug)",
    formatJson: "Format JSON",
    saveQuestions: "Save Questions",
    loadQuestions: "Load Questions",
    resetAllData: "Reset All Data",
    saveAnswers: "Save Answers",
    loadAnswers: "Load Answers",
    yourAnswers: "Your Answers (Debug)",
    required: "*",
    answerRequired: "This question requires an answer",
    pleaseAnswerAll: "Please answer all questions before saving",
    savedSuccessfully: "saved successfully",
    loadedSuccessfully: "loaded successfully",
    noSavedAnswers: "No saved answers found",
    errorSaving: "Error saving answers",
    errorLoading: "Error loading answers",
    questionsReset: "All data reset to default and cleared from storage",
    answersCleared: "Answers have been cleared",
    footer: "© 2024 @cht_z. All rights reserved.",
    language: "Language",
    login: "Log in",
    logout: "Log out",
    authRequired: "Authentication required to save data",
    authLoading: "Authentication in progress, please wait",
    tokenMissing: "Authentication token not available"
  },
  de: {
    title: "DynamicForm",
    debugMode: "Debug",
    formItems: "Formularelemente (Debug)",
    formatJson: "JSON formatieren",
    saveQuestions: "Fragen speichern",
    loadQuestions: "Fragen laden",
    resetAllData: "Alle Daten zurücksetzen",
    saveAnswers: "Antworten speichern",
    loadAnswers: "Antworten laden",
    yourAnswers: "Deine Antworten (Debug)",
    required: "*",
    answerRequired: "Diese Frage erfordert eine Antwort",
    pleaseAnswerAll: "Bitte beantworte alle Fragen, bevor du speicherst",
    savedSuccessfully: "erfolgreich gespeichert",
    loadedSuccessfully: "erfolgreich geladen",
    noSavedAnswers: "Keine gespeicherten Antworten gefunden",
    errorSaving: "Fehler beim Speichern der Antworten",
    errorLoading: "Fehler beim Laden der Antworten",
    questionsReset: "Alle Daten auf Standardwerte zurückgesetzt und aus dem Speicher gelöscht",
    answersCleared: "Antworten wurden gelöscht",
    footer: "© 2024 @cht_z. Alle Rechte vorbehalten.",
    language: "Sprache",
    login: "Anmelden",
    logout: "Abmelden",
    authRequired: "Authentifizierung erforderlich, um Daten zu speichern",
    authLoading: "Authentifizierung läuft, bitte warten",
    tokenMissing: "Authentifizierungstoken nicht verfügbar"
  }
};

/**
 * Helper function to get text in the current language with fallback to English
 * @param {Object} textObj - Object containing translations keyed by language code
 * @param {string} language - Current language code
 * @returns {string} - Text in the current language or fallback
 */
export const getTextInLanguage = (textObj, language) => {
  if (!textObj) return '';
  return textObj[language] || textObj.en || '';
}; 