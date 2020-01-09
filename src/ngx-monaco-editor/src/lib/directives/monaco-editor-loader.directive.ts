import { Directive, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { MonacoEditorLoaderService } from '../services/monaco-editor-loader.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({ selector: '[ngxLoadMonacoEditor]' })
export class MonacoEditorLoaderDirective implements OnInit, OnDestroy {
  isMonacoLoaded$ = this.monacoEditorLoaderService.isMonacoLoaded$.asObservable();
  destroyed$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private monacoEditorLoaderService: MonacoEditorLoaderService
  ) {}

  ngOnInit() {
    this.isMonacoLoaded$.pipe(takeUntil(this.destroyed$)).subscribe((loaded) => {
      if (! loaded) {
        return this.viewContainer.clear();
      }
      this.viewContainer.createEmbeddedView(this.templateRef);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
