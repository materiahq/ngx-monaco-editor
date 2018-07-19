import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy
} from '@angular/core';
import { MonacoEditorLoaderService } from '../../services/monaco-editor-loader.service';
import { MonacoOptions } from '../../interfaces/monaco-options';

declare const monaco: any;

@Component({
    selector: 'ngx-monaco-editor',
    template: `<div #container materiaResized (resized)="onResized($event)" class="editor-container" fxFlex>
	<div class="wrapper">
		<div
			#editor
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
export class MonacoEditorComponent implements OnInit, OnChanges, OnDestroy {
    container: HTMLDivElement;
    editor: any;

    @Input() code: string;
    @Input() options: MonacoOptions;
    @Output() codeChange = new EventEmitter<string>();

    @ViewChild('editor') editorContent: ElementRef;

    constructor(private monacoLoader: MonacoEditorLoaderService) { }

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.codeChange.next(this.code);
        this.monacoLoader.isMonacoLoaded.subscribe(value => {
            if (value) {
                this.initMonaco();
            }
        });
    }

    ngOnChanges(changes) {
        if (this.editor && (changes.code || changes.original)) {
            this.editor.setValue(changes.code.currentValue);

            if (!this.options.language) {
                this.options.language = 'text';
            }
            monaco.editor.setModelLanguage(
                this.editor.getModel(),
                this.options.language
            );
        }
        if (this.editor && changes.options && changes.options.currentValue && changes.options.currentValue.theme) {
            monaco.editor.setTheme(changes.options.currentValue.theme);
        }
    }

    private initMonaco() {
        const opts: any = {
            value: [this.code].join('\n'),
            language: 'json',
            automaticLayout: true,
            scrollBeyondLastLine: false
        };
        if (this.options.minimap) {
            opts.minimap = this.options.minimap;
        }
        if (this.options.readOnly) {
            opts['readOnly'] = true;
        }
        this.editor = monaco.editor.create(this.container, opts);
        this.editor.layout();

        this.editor.onDidChangeModelContent(editor => {
            this.codeChange.next(this.editor.getValue());
        });
        if (this.options.theme) {
            monaco.editor.setTheme(this.options.theme);
        }

        if (!this.options.language) {
            this.options.language = 'text';
        }
        monaco.editor.setModelLanguage(
            this.editor.getModel(),
            this.options.language
        );
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
