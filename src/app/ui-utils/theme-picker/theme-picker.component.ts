import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {StyleManager} from './style-manager';
import {SiteTheme, ThemeStorage} from "./theme-storage";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-theme-picker',
  templateUrl: 'theme-picker.component.html',
  styleUrls: ['theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit {
  currentTheme: SiteTheme;

  // The below colors need to align with the themes defined in theme-picker.scss
  themes: SiteTheme[] = [
    {
      primary: '#673AB7',
      accent: '#FFC107',
      displayName: 'Deep Purple & Amber',
      name: 'deeppurple-amber',
      isDark: false,
    },
    {
      primary: '#3F51B5',
      accent: '#E91E63',
      displayName: 'Indigo & Pink',
      name: 'indigo-pink',
      isDark: false
    },
    {
      primary: "#FF9800",
      accent: "#CDDC39",
      displayName: "Orange & Lime",
      name: "orange-lime",
      isDark: false,
      isDefault: true
    },
    {
      primary: '#E91E63',
      accent: '#607D8B',
      displayName: 'Pink & Blue-grey',
      name: 'pink-bluegrey',
      isDark: true,
    },
    {
      primary: '#9C27B0',
      accent: '#4CAF50',
      displayName: 'Purple & Green',
      name: 'purple-green',
      isDark: true,
    },
    {
      primary: "#FF5722",
      accent: "#4CAF50",
      displayName: "Deep Orange & Green",
      name: "deeporange-green",
      isDark: true
    }
  ];

  constructor(
    public styleManager: StyleManager,
    private _themeStorage: ThemeStorage,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'theme-example',
      sanitizer.bypassSecurityTrustResourceUrl('assets/theme-demo-icon.svg')
    );
    const themeName = this._themeStorage.getStoredThemeName();
    if (themeName) {
      this.selectTheme(themeName);
    } else {
      const defaultTheme = this.themes.find(t => t.isDefault);
      this.styleManager.onStyleSelected(defaultTheme.name);
      this.currentTheme = defaultTheme;
    }
  }

  ngOnInit() {
  }

  selectTheme(themeName: string) {
    const theme = this.themes.find(currentTheme => currentTheme.name === themeName);
    if (!theme) {
      return;
    }
    this.currentTheme = theme;
    if (theme.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', `assets/${theme.name}.css`);
    }
    this.styleManager.onStyleSelected(theme.name);

    if (this.currentTheme) {
      this._themeStorage.storeTheme(this.currentTheme);
    }
  }
}
