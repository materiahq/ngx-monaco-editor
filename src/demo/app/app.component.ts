import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
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

  setTheme(theme) {
    this.options = Object.assign({}, { theme: theme });
  }
}
