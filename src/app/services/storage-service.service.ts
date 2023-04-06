/* eslint-disable no-underscore-dangle */
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {BehaviorSubject, from, of} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';

const THEME_KEY = 'theme';
const HADITHFAVORIS_KEY = 'hadithFavoris';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceService {
  public savedHadithList$ = new BehaviorSubject<number[]>([]);

  private isStorageReady = new BehaviorSubject(false);

  constructor(private storage: Storage) {
    this.init().then(() => console.log('DB init'));
  }

  async init() {
    await this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();
    this.isStorageReady.next(true);
    this.getHadithFavorites().subscribe((res: number[]) => {
      this.savedHadithList$.next(res);
    });
  }

  getDarkMode() {
    return this.isStorageReady.pipe(
      filter((ready: boolean) => ready),
      switchMap((() => from(this.storage.get(THEME_KEY)) || of(null)))
    );
  }

  async setDarkMode(isDarkMode: boolean) {
    await this.storage.set(THEME_KEY, isDarkMode);
  }

  async setHadithFavorites(item: number) {
    const storedData = (await this.storage.get(HADITHFAVORIS_KEY)) || [];
    storedData.push(item);
    await this.storage.set(HADITHFAVORIS_KEY, storedData);
    let tmp = this.savedHadithList$.value;
    if (!tmp) {
      tmp = [];
    }
    tmp.push(item);
    this.savedHadithList$.next(tmp);
  }

  async removeHadithFavorites(index) {
    const storedData = (await this.storage.get(HADITHFAVORIS_KEY)) || [];
    storedData.splice(index, 1);
    await this.storage.set(HADITHFAVORIS_KEY, storedData);
    console.log(storedData);
    const tmp = this.savedHadithList$.value;
    console.log(tmp);
    tmp.splice(index, 1);
    this.savedHadithList$.next(tmp);
  }

  private getHadithFavorites() {
    return this.isStorageReady.pipe(
      filter((ready: boolean) => ready),
      switchMap(() => from(this.storage.get(HADITHFAVORIS_KEY) || of([])))
    );
  }
}
