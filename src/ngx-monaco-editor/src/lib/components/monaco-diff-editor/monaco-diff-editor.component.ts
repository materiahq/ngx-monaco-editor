import {
    Component,
    ViewChild,
    ElementRef,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    Output,
    Input,
    ChangeDetectionStrategy,
    SimpleChanges
} from '@angular/core';
import { filter, take } from 'rxjs/operators';

import { MonacoEditorLoaderService } from '../../services/monaco-editor-loader.service';
import { MonacoDiffEditorConstructionOptions, MonacoEditorUri, MonacoStandaloneDiffEditor } from '../../interfaces';

@Component({
    selector: 'ngx-monaco-diff-editor',
    template: `<div #container class="editor-container" fxFlex>
		<div
			#diffEditor
			class="monaco-editor"
		></div>
</div>`,
    styles: [
        `
.monaco-editor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

}
.editor-container {
	overflow: hidden;
	position: relative;
	display: table;
	width: 100%;
  height: 100%;
  min-width: 0;
}`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonacoDiffEditorComponent implements OnInit, OnChanges, OnDestroy {
    container: HTMLDivElement;
    editor: MonacoStandaloneDiffEditor;

    @Input() original: string;
    @Input() modified: string;
    @Input() originalUri?: MonacoEditorUri;
    @Input() modifiedUri?: MonacoEditorUri;
    @Input() options: MonacoDiffEditorConstructionOptions;
    @Output() init: EventEmitter< MonacoStandaloneDiffEditor> = new EventEmitter();

    @ViewChild('diffEditor', {static: true}) editorContent: ElementRef;

    originalModelUriInstance: monaco.editor.ITextModel;
    modifiedModelUriInstance: monaco.editor.ITextModel;

    constructor(private monacoLoader: MonacoEditorLoaderService) { }

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.monacoLoader.isMonacoLoaded$.pipe(
            filter(isLoaded => isLoaded),
            take(1),
        ).subscribe(() => {
            this.initMonaco();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            this.editor &&
            (
                (changes.original && !changes.original.firstChange) ||
                (changes.modified && !changes.modified.firstChange) ||
                (changes.originalUri && !changes.originalUri.firstChange) ||
                (changes.modifiedUri && !changes.modifiedUri.firstChange)
            )
        ) {
            if (this.originalModelUriInstance) {
                this.originalModelUriInstance.dispose();
            }
            if (this.modifiedModelUriInstance) {
                this.modifiedModelUriInstance.dispose();
            }

            let existingOriginalModel: monaco.editor.ITextModel;
            let existingModifiedModel: monaco.editor.ITextModel;

            if (this.originalUri) {
                existingOriginalModel = monaco.editor.getModels().find((model) => model.uri.path === this.originalUri.path);
            }
            if (this.modifiedUri) {
                existingModifiedModel = monaco.editor.getModels().find((model) => model.uri.path === this.modifiedUri.path);
            }

            this.originalModelUriInstance = existingOriginalModel
                ? existingOriginalModel
                : monaco.editor.createModel(
                    changes.original.currentValue || this.editor.getOriginalEditor().getValue(),
                    undefined,
                    this.originalUri
                );
            this.modifiedModelUriInstance = existingModifiedModel
                ? existingModifiedModel
                : monaco.editor.createModel(
                    changes.modified.currentValue || this.editor.getModifiedEditor().getValue(),
                    undefined,
                    this.modifiedUri
                );

            if (changes.original) {
                this.originalModelUriInstance.setValue(this.original);
            }
            if (changes.modified) {
                this.modifiedModelUriInstance.setValue(this.modified);
            }

            this.editor.setModel({
                original: this.originalModelUriInstance,
                modified: this.modifiedModelUriInstance
            });
        }
        if (
            this.editor &&
            changes.options &&
            !changes.options.firstChange
        ) {
            if (changes.options.previousValue.theme !== changes.options.currentValue.theme) {
                monaco.editor.setTheme(changes.options.currentValue.theme);
            }

            this.editor.updateOptions(changes.options.currentValue);
        }
    }

    private initMonaco() {
        let opts: MonacoDiffEditorConstructionOptions = {
            readOnly: true,
            automaticLayout: true,
            theme: 'vc'
        };
        if (this.options) {
            opts = Object.assign({}, opts, this.options);
        }
        this.editor = monaco.editor.createDiffEditor(this.container, opts);

        this.originalModelUriInstance = monaco.editor.createModel(this.original, undefined, this.originalUri);
        this.modifiedModelUriInstance = monaco.editor.createModel(this.modified, undefined, this.modifiedUri);

        this.editor.setModel({
            original: this.originalModelUriInstance,
            modified: this.modifiedModelUriInstance
        });
        this.editor.layout();
        this.init.emit(this.editor);
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}
