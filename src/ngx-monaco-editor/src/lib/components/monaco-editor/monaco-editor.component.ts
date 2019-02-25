import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ChangeDetectionStrategy,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS } from '@angular/forms';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MonacoEditorComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MonacoEditorComponent),
            multi: true,
        }
    ]
})
export class MonacoEditorComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {
    container: HTMLDivElement;
    editor: any;

    value: string;
    parseError: boolean;

    @Input() options: MonacoOptions;
    @ViewChild('editor') editorContent: ElementRef;

    private propagateChange = (_: any) => { };
    private onTouched = () => { };
    private onErrorStatusChange: () => void;

    constructor(private monacoLoader: MonacoEditorLoaderService) { }

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.monacoLoader.isMonacoLoaded.subscribe(value => {
            if (value) {
                this.initMonaco();
            }
        });
    }

    ngOnChanges(changes) {
        if (this.editor) {
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

    writeValue(obj: any): void {
        this.value = obj;
        if (this.editor && obj) {
            this.editor.setValue(obj);
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(): import("@angular/forms").ValidationErrors {
        return (!this.parseError) ? null : {
            parseError: {
                valid: false,
            },
        };
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onErrorStatusChange = fn;
    }

    private initMonaco() {
        const opts: any = {
            value: [this.value].join('\n'),
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

        this.editor.onDidChangeModelContent(() => {
            this.propagateChange(this.editor.getValue());
        });

        this.editor.onDidChangeModelDecorations(() => {
            const pastParseError = this.parseError;
            if (monaco.editor.getModelMarkers({}).map(m => m.message).join(', ')) {
                this.parseError = true;
            } else {
                this.parseError = false;
            }

            if (pastParseError !== this.parseError) {
                this.onErrorStatusChange();
            }
        });

        this.editor.onDidBlurEditorText(() => {
            this.onTouched();
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
