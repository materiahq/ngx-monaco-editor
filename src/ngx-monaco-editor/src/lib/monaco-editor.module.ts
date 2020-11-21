import { NgModule } from '@angular/core';
import { MonacoEditorLoaderDirective } from './directives/monaco-editor-loader.directive';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { MonacoDiffEditorComponent } from './components/monaco-diff-editor/monaco-diff-editor.component';

@NgModule({
  imports: [],
  declarations: [
    MonacoEditorLoaderDirective,
    MonacoEditorComponent,
    MonacoDiffEditorComponent
  ],
  exports: [
    MonacoEditorLoaderDirective,
    MonacoEditorComponent,
    MonacoDiffEditorComponent
  ],
  entryComponents: [MonacoEditorComponent, MonacoDiffEditorComponent]
})
export class MonacoEditorModule { }
