import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ChangeDetectionStrategy
} from '@angular/core';
import { MonacoEditorLoaderService } from '../../services/monaco-editor-loader.service';
import { MonacoOptions } from '../../interfaces/monaco-options';

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
    editor: any;

    @Input() original: string;
    @Input() modified: string;
    @Input() options: MonacoOptions;
    @Input() inline = false;
    @Input() enableSplitViewResizing = false;

    @ViewChild('diffEditor') editorContent: ElementRef;

    constructor(private monacoLoader: MonacoEditorLoaderService) { }

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.monacoLoader.isMonacoLoaded.subscribe((value) => {
            if (value) {
                this.initMonaco();
            }
        });
    }

    ngOnChanges(changes) {
        if (this.editor && (changes.code || changes.original)) {
            let modified = monaco.editor.createModel(this.modified);
            if (changes.code && changes.code.currentValue !== this.modified) {
                modified = monaco.editor.createModel(
                    changes.code.currentValue
                );
            }
            let original = monaco.editor.createModel(this.original);
            if (
                changes.original &&
                changes.original.currentValue !== this.original
            ) {
                original = monaco.editor.createModel(
                    changes.original.currentValue
                );
            }
            this.editor.setModel({
                original,
                modified
            });
        }
        if (this.editor && changes.options && changes.options.currentValue && changes.options.currentValue.theme) {
            monaco.editor.setTheme(changes.options.currentValue.theme);
        }
    }

    private initMonaco() {
        const opts = {
            enableSplitViewResizing: this.enableSplitViewResizing,
            renderSideBySide: !this.inline,
            readOnly: true
        };
        this.editor = monaco.editor.createDiffEditor(this.container, opts);

        const original = monaco.editor.createModel(this.original);
        const modified = monaco.editor.createModel(this.modified);

        this.editor.setModel({
            original,
            modified
        });
        this.editor.layout();

        monaco.editor.setTheme('vs-light');
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
