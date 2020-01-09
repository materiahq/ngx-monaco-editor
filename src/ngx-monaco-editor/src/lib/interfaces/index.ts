/// <reference path="monaco.d.ts" />
declare const monaco: any;
export const MONACO_PATH = 'MONACO_PATH';
export type MonacoEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;
export type MonacoDiffEditorConstructionOptions = monaco.editor.IDiffEditorConstructionOptions;
export type MonacoStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
export type MonacoStandaloneDiffEditor = monaco.editor.IStandaloneDiffEditor;
