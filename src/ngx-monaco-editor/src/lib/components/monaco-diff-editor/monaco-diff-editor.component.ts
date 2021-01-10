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
import { MonacoDiffEditorConstructionOptions, MonacoStandaloneDiffEditor } from '../../interfaces';

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
    @Input() options: MonacoDiffEditorConstructionOptions;
    @Output() init: EventEmitter< MonacoStandaloneDiffEditor> = new EventEmitter();

    @ViewChild('diffEditor', {static: true}) editorContent: ElementRef;

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
        if (this.editor && ((changes.code && !changes.code.firstChange) || (changes.modified && !changes.modified.firstChange))) {
            const modified = monaco.editor.createModel(this.modified);
            const original = monaco.editor.createModel(this.original);
            this.editor.setModel({
                original,
                modified
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

        const original = monaco.editor.createModel(this.original);
        const modified = monaco.editor.createModel(this.modified);

        this.editor.setModel({
            original,
            modified
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
