import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

const LANGUAGE_STORAGE_KEY = "language";
const AVAILABLE_LANGUAGES = ["en", "pl"];

@Injectable({
  providedIn: "root"
})
export class LanguageService {
  readonly allowedLanguages: string[];
  private _selectedLanguage: string;
  get selectedLanguage() {
    return this._selectedLanguage;
  }

  set selectedLanguage(language: string) {
    if (!this.isSupported(language)) {
      this.toast.open(`language '${language}' is not supported`);
      return;
    }
    this._selectedLanguage = language;
    this.translate.setDefaultLang(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  constructor(private translate: TranslateService, private toast: MatSnackBar) {
    this.allowedLanguages = AVAILABLE_LANGUAGES;
    this.selectedLanguage = LanguageService.getUserDefinedLanguage() ||
      this.getBrowserLanguageIfSupported() ||
      this.allowedLanguages[0];
  }

  private static getUserDefinedLanguage() {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  }

  private getBrowserLanguageIfSupported() {
    const browserLanguage = detectBrowserLanguage();
    if (!browserLanguage) return;
    const shortLanguage = browserLanguage.substring(0, 2).toLowerCase();
    if (this.isSupported(shortLanguage))
      return shortLanguage;
  }

  private isSupported(language: string) {
    return this.allowedLanguages.includes(language);
  }

}

// https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
function detectBrowserLanguage(): string {
  let nav = window.navigator,
    browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
    i,
    language,
    len,
    shortLanguage = null;

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      len = language.length;
      if (!shortLanguage && len) {
        shortLanguage = language;
      }
      if (language && len > 2) {
        return language;
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    //skip this loop iteration if property is null/undefined.  IE11 fix.
    if (language == null) {
      continue;
    }
    len = language.length;
    if (!shortLanguage && len) {
      shortLanguage = language;
    }
    if (language && len > 2) {
      return language;
    }
  }

  return shortLanguage;
}
