import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme = 'vs-dark';
  themes = ['vs', 'vs-dark', 'hc-black'];
  readOnlys = [true, false];
  options = { theme: 'vs-dark', readOnly: false };

  typescriptCode = `export class Animals {
    private name: string;
    constructor(name) {
      this.name = name;
    }
  }`
  simpleText = "hello world!";
  sqlRequest = "SELECT * FROM user;";
  modifiedSqlRequest = "SELECT * FROM user\nWHERE id = 1;"

  public reactiveForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      code: [
        `{
  "test123":"test456"
}`]
    })
  }

  setTheme(theme) {
    this.options = { ...this.options, theme }
  }

  setReadOnly(readOnly) {
    this.options = { ...this.options, readOnly }
  }

  mergeOptions(moreOptions) {
    return {
      ...this.options,
      ...moreOptions
    }
  }
}
