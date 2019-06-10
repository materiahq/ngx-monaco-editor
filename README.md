### Documentation

Try it out on : [live demo](https://materiahq.github.io/ngx-monaco-editor).

Api reference available on : [documentation](https://materiahq.github.io/ngx-monaco-editor/api-reference).

### Installation

Install from npm repository:
```
npm install @materia-ui/ngx-monaco-editor --save
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

### Motivations

We wanted to use monaco-editor library with angular in our desktop application: [Materia Designer](https://getmateria.com).

The current angular libraries did not cover all of our needs, notably:
- Works on Browser and Electron application,
- Support flex-box container and correctly resize editor when container size changes.
