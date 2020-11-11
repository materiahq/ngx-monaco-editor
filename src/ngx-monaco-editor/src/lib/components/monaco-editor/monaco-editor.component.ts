import {
    Component,
    ViewChild,
    ElementRef,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    ChangeDetectionStrategy,
    forwardRef,
    SimpleChanges,
    Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

import { MonacoEditorLoaderService } from '../../services/monaco-editor-loader.service';
import { MonacoEditorConstructionOptions, MonacoStandaloneCodeEditor } from '../../interfaces';

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
    @Input() options: MonacoEditorConstructionOptions;
    @Input() modelUri?: monaco.Uri;
    @Output() init: EventEmitter<MonacoStandaloneCodeEditor> = new EventEmitter();
    @ViewChild('editor', {static: true}) editorContent: ElementRef;

    container: HTMLDivElement;
    editor: MonacoStandaloneCodeEditor;
    modelUriInstance: monaco.editor.ITextModel;
    value: string;
    parseError: boolean;

    private onTouched: () => void;
    private onErrorStatusChange: () => void;
    private propagateChange: (_: any) => any = (_: any) => { };

    constructor(private monacoLoader: MonacoEditorLoaderService) { }

    ngOnInit() {
        this.container = this.editorContent.nativeElement;
        this.monacoLoader.isMonacoLoaded$.pipe(
            filter(isLoaded => isLoaded),
            take(1)
        ).subscribe(() => {
            this.initMonaco();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.editor && changes.options && !changes.options.firstChange) {
          const { language: toLanguage, theme: toTheme, ...options } = changes.options.currentValue;
          const { language: fromLanguage, theme: fromTheme, modelUri: fromModelUri } = changes.options.previousValue;
            if (fromLanguage !== toLanguage) {
                monaco.editor.setModelLanguage(
                    this.editor.getModel(),
                    this.options && this.options.language ? this.options.language : 'text'
                );
            }
            if (fromTheme !== toTheme) {
                monaco.editor.setTheme(toTheme);
            }
            this.editor.updateOptions(options);
        }
        if (this.editor && changes.modelUri) {
          const toUri = changes.modelUri.currentValue;
          const fromUri = changes.modelUri.previousValue;
          if (fromUri && !toUri || !fromUri && toUri || toUri && fromUri && toUri.path !== fromUri.path) {
            const value = this.editor.getValue();
            if (this.modelUriInstance) {
              this.modelUriInstance.dispose();
            }
            let existingModel;
            if (toUri) {
              existingModel = monaco.editor.getModels().find((model) => model.uri.path === toUri.path);
            }
            this.modelUriInstance = existingModel ? existingModel : monaco.editor.createModel(value, this.options.language || 'text', this.modelUri);
            this.editor.setModel(this.modelUriInstance);
          }
        }
    }

    writeValue(value: string): void {
        this.value = value;
        if (this.editor && value) {
            this.editor.setValue(value);
        } else if (this.editor) {
            this.editor.setValue('');
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(): ValidationErrors {
        return (!this.parseError) ? null : {
            parseError: {
                valid: false,
            }
        };
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onErrorStatusChange = fn;
    }

    private initMonaco() {
        let opts: MonacoEditorConstructionOptions = {
            value: [this.value].join('\n'),
            language: 'text',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            theme: 'vc'
        };
        if (this.options) {
            opts = Object.assign({}, opts, this.options);
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

        this.init.emit(this.editor);
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
