import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    if (!this.allowedLanguages.includes(language)) {
      this.toast.open(`language '${language}' is not supported`);
      return;
    }
    this._selectedLanguage = language;
    this.translate.setDefaultLang(language);
  }

  constructor(private translate: TranslateService, private toast: MatSnackBar) {
    this.allowedLanguages = ["en", "pl"];
    this.selectedLanguage = this.allowedLanguages[0];
  }
}
