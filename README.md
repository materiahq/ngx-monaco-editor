- Angular v6/v7: [v2.x](https://github.com/materiahq/ngx-monaco-editor/tree/2.0.x).

### Resources

Try it out on: [Stackblitz](https://stackblitz.com/edit/materia-ngx-monaco-editor-example).

See it in action : [live demo](https://materiahq.github.io/ngx-monaco-editor).

Api reference available on : [documentation](https://materiahq.github.io/ngx-monaco-editor/api-reference).

### Standard installation

Install from npm repository:
```
npm install monaco-editor @materia-ui/ngx-monaco-editor --save
 ```
 
Add the glob to assets in angular.json (to make monaco-editor lib available to the app):
```typescript
{
    ...
    "projects": {
      "YOUR_APP_NAME": {
          ...
          "architect": {
              "build": {
                ...
                "options": {
                    ...
                    "assets": [
                        { "glob": "**/*", "input": "node_modules/monaco-editor", "output": "assets/monaco-editor/" }
                    ],
                    ...
                }
                ...
              }
            }
            ...
        }
    },
    ...
}
 ```

### Sample


Include MonacoEditorModule in Main Module and Feature Modules where you want to use the editor component.(eg: app.module.ts): 

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```


Create Editor options in component.(eg: app.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  originalCode: string = 'function x() { // TODO }';
}
```


Include editor component in your html with options input and ngModel bindings  (eg: app.component.html) or using ReactiveForm features.

```html
<ngx-monaco-editor [options]="editorOptions" [(ngModel)]="code"></ngx-monaco-editor>
```

Include diff-editor component in your html and use the following inputs: options, original and modified (eg: app.component.html).

```html
<ngx-monaco-diff-editor [options]="editorOptions" [original]="originalCode" [modified]="code"></ngx-monaco-diff-editor>
```

Both components support all available `monaco-editor` options:
- EditorOptions: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html,
- DiffEditorOptions: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html.


### Configure default monaco-editor library path

You can configure the default path used to load the monaco-editor library.

It allows you to either change the localization of your local installed library or load the library from a remote resource.

Example **load monaco-editor from a CDN**:

 > ⚠️ Warning: in this case you don't need to install monaco-editor and neither modify angular.json.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule
  ],
  providers: [{
    provide: MONACO_PATH,
    useValue: 'https://unpkg.com/monaco-editor@0.18.1/min/vs'
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
### Access editor instance

If you need to retrieve an editor instance you can do so by using the `init` output:
```html
<ngx-monaco-editor [options]="editorOptions" [(ngModel)]="code" (init)="editorInit($event)"></ngx-monaco-editor>
```

```typescript
import { Component } from '@angular/core';
...
export class AppComponent {
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';

  editorInit(editor) {
    // Here you can access editor instance
     this.editor = editor;
    }
}
```

### Access Monaco instance

If you need to retrieve `monaco-editor` instance for advance use cases (like defining a custom theme, add custom auto-complete support, etc...), you have to wait until monaco is loaded using our `MonacoEditorLoaderService`:

```typescript
import { MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
...
constructor(private monacoLoaderService: MonacoEditorLoaderService) {
      this.monacoLoaderService.isMonacoLoaded$.pipe(
        filter(isLoaded => isLoaded),
        take(1),
      ).subscribe(() => {
           // here, we retrieve monaco-editor instance
           monaco.setTheme(...);
      });
     }
```


### Motivations

We wanted to use monaco-editor library with angular in our desktop application: [Materia Designer](https://getmateria.com).

The current angular libraries did not cover all of our needs, notably:
- Works on Browser and Electron application,
- Support flex-box container and correctly resize editor when container size changes.
