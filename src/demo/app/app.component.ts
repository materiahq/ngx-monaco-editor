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
  options = { theme: 'vs-dark' };

  typescriptCode = `export class Animals {
    private name: string;
    constructor(name) {
      this.name = name;
    }
  }`
  simpleText = "hello world!";
  sqlRequest = "SELECT * FROM user;";
  modifiedSqlRequest =  "SELECT * FROM user\nWHERE id = 1;"

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
    this.options = Object.assign({}, { theme: theme });
  }
}
