import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { MonacoEditorLoaderService } from '../services/monaco-editor-loader.service';

@Directive({ selector: '[materiaLoadMonacoEditor]' })
export class MonacoEditorLoaderDirective {
    @Input() set loadMonacoEditor(value: any) {
        this.monacoEditorLoaderService.monacoPath = value;
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private monacoEditorLoaderService: MonacoEditorLoaderService) {
        monacoEditorLoaderService.isMonacoLoaded.subscribe(isLoaded => {
            if (isLoaded) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainer.clear();
            }
        });
    }
}
