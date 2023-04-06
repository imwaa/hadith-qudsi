import {Component, OnInit} from '@angular/core';
import {StatusBar, Style} from '@capacitor/status-bar';
import {ThemeService} from './services/theme.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
  ) {
  }

  async ngOnInit() {
    await StatusBar.setOverlaysWebView({overlay: false});
    this.themeService.isDarkMode.subscribe(async (isDarkMode: boolean) => {
      console.log(isDarkMode);
      if (isDarkMode) {
        document.body.setAttribute('color-theme', 'dark');
        await StatusBar.setBackgroundColor({color: '#1f1f1f'});
        await StatusBar.setStyle({style: Style.Dark});
      } else {
        document.body.removeAttribute('color-theme');
        await StatusBar.setBackgroundColor({color: '#f7f7f7'});
        await StatusBar.setStyle({style: Style.Light});
      }
    });
  }
}
