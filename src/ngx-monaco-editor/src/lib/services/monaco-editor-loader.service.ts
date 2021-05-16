import { Injectable, NgZone, Optional, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MONACO_PATH } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class MonacoEditorLoaderService {
    nodeRequire: any;
    isMonacoLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _monacoPath = 'assets/monaco-editor/min/vs';

    set monacoPath(value: string) {
        if (value) {
            this._monacoPath = value;
        }
    }

    constructor(private ngZone: NgZone, @Optional() @Inject(MONACO_PATH) public monacoPathConfig: string) {
      if ((<any>window).monacoEditorAlreadyInitialized) {
        ngZone.run(() => this.isMonacoLoaded$.next(true));
        return;
      }

      (<any>window).monacoEditorAlreadyInitialized = true;

      if (this.monacoPathConfig) {
        this.monacoPath = this.monacoPathConfig;
      }

      this.loadMonaco();
    }

    loadMonaco() {
      const onGotAmdLoader = () => {

        let vsPath = this._monacoPath;
        (<any>window).amdRequire = (<any>window).require;

        const isElectron = !!this.nodeRequire;
        const isPathUrl = vsPath.includes('http');

        if (isElectron) {
          // Restore node require in window
          (<any>window).require = this.nodeRequire;

          if (!isPathUrl) {
            const path = (<any>window).require('path');
            vsPath = path.resolve((<any>window).__dirname, this._monacoPath);
          }
        }

        (<any>window).amdRequire.config({ paths: { vs: vsPath } });

        // Load monaco
        (<any>window).amdRequire(['vs/editor/editor.main'], () => {
            this.ngZone.run(() => this.isMonacoLoaded$.next(true));
        });
    };

      // Check if AMD loader already available
      const isAmdLoaderAvailable = !!(<any>window).amdRequire;
      if (isAmdLoaderAvailable) {
        return onGotAmdLoader();
      }

      const isElectron = !!(<any>window).require;

      if (isElectron) {
        this.addElectronFixScripts();
        this.nodeRequire = (<any>window).require;
      }

      const loaderScript: HTMLScriptElement = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = `${this._monacoPath}/loader.js`;
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    }

    addElectronFixScripts() {
        const electronFixScript = document.createElement('script');
        // workaround monaco-css not understanding the environment
        const inlineScript = document.createTextNode('self.module = undefined;');
        // workaround monaco-typescript not understanding the environment
        const inlineScript2 = document.createTextNode('self.process.browser = true;');
        electronFixScript.appendChild(inlineScript);
        electronFixScript.appendChild(inlineScript2);
        document.body.appendChild(electronFixScript);
    }
}
