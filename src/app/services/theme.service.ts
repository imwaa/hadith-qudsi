import {Injectable} from '@angular/core';
import {StorageServiceService} from './storage-service.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  sharedDarkValue: any;

  isDarkMode = new BehaviorSubject<boolean>(false);

  constructor(private storageService: StorageServiceService) {
    this.storageService.getDarkMode().subscribe((isDarkMode: boolean | null) => {
      if (isDarkMode === null) {
        this.setDarkMode(false);
      } else {
        this.setDarkMode(isDarkMode);
      }
    });
  }

  setDarkMode(isDarkMode: boolean) {
    this.isDarkMode.next(isDarkMode);
    this.storageService.setDarkMode(isDarkMode);
  }

}
