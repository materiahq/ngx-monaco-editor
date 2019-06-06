import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ChangeDetectionStrategy,
    SimpleChanges
} from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { editor } from 'monaco-editor';

import { MonacoEditorLoaderService } from '../../services/monaco-editor-loader.service';

declare const monaco: any;

@Component({
    selector: 'ngx-monaco-diff-editor',
    template: `<div #container materiaResized (resized)="onResized($event)" class="editor-container" fxFlex>
<div class="wrapper">
  <div
    #diffEditor
    class="monaco-editor"
    [style.width.px]="container.offsetWidth"
    [style.height.px]="container.offsetHeight" style="min-width: 0;"
  ></div>
</div>
</div>`,
    styles: [
        `:host {
flex: 1;
box-sizing: border-box;
flex-direction: column;
display: flex;
overflow: hidden;
max-width: 100%;
min-wdith: 0;
}
.wrapper {
width: 0px; height: 0px;
}
.editor-container {
text-overflow: ellipsis;
overflow: hidden;
position: relative;
min-width: 0;
display: table;
width: 100%;
height: 100%;
}`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonacoDiffEditorComponent implements OnInit, OnChanges, OnDestroy {
    container: HTMLDivElement;
    editor: editor.IStandaloneDiffEditor;

    @Input() original: string;
    @Input() modified: string;
    @Input() options: editor.IDiffEditorConstructionOptions;

    @ViewChild('diffEditor') editorContent: ElementRef;

    constructor(private monacoLoader: MonacoEditorLoaderService) { }

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.monacoLoader.isMonacoLoaded.pipe(
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

            if (changes.options.previousValue.readOnly !== changes.options.currentValue.readOnly) {
                this.editor.updateOptions({ readOnly: changes.options.currentValue.readOnly })
            }
        }
    }

    private initMonaco() {
        let opts: editor.IDiffEditorConstructionOptions = {
            readOnly: true,
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
    }

    onResized(event) {
        if (this.editor) {
            this.editor.layout({
                width: event.newWidth,
                height: event.newHeight
            });
        }
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}
