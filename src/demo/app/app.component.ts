import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { take, filter } from 'rxjs/operators';
import {
  colors,
  location,
} from './json-examples';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme = 'vs-dark';
  themes = ['vs', 'vs-dark', 'hc-black'];
  readOnlys = [true, false];
  options: MonacoEditorConstructionOptions = { theme: 'vs-dark', readOnly: false };

  typescriptCode = `export class Animals {
    private name: string;
    constructor(name) {
      this.name = name;
    }
  }`;
  simpleText = "hello world!";
  sqlRequest = "SELECT * FROM user;";
  modifiedSqlRequest = "SELECT * FROM user\nWHERE id = 1;"

  public reactiveForm: FormGroup;
  displayJson: boolean;
  modelUri: monaco.Uri;

  constructor(private fb: FormBuilder, private monacoLoader: MonacoEditorLoaderService) {
    this.reactiveForm = this.fb.group({
      code: [location],
      json: [colors]
    });
    this.registerJSONValidationSchema();
  }

  setOptions(option) {
    this.options = { ...this.options, ...option};
  }

  mergeOptions(moreOptions?) {
    return {
      ...this.options,
      ...moreOptions
    }
  }

  async registerJSONValidationSchema() {
    await this.monacoLoader.isMonacoLoaded$.pipe(filter(isLoaded => isLoaded), take(1)).toPromise();
    this.modelUri = monaco.Uri.parse("a://b/city.json"); // a made up unique URI for our model
    // configure the JSON language support with schemas and schema associations
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
         {
            uri: "http://myserver/city-schema.json", // id of the first schema
            fileMatch: ["city*.json"],
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    city: {
                        enum: ["Paris", "Berlin", "Boardman"]
                    },
                    country: {
                      enum: ["France", "Germany", "United States"]
                    },
                    population: {
                      type: "integer"
                    }
                }
            }
        }]
    });
  }
}
