import { Directive, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { ResizeSensor } from 'css-element-queries';

export class ResizedEvent {
    constructor(
        readonly element: ElementRef,
        readonly newWidth: number,
        readonly newHeight: number,
        readonly oldWidth: number,
        readonly oldHeight: number
    ) { }
}

@Directive({
    selector: '[materiaResized]',
    exportAs: 'materiaResized'
})
export class ResizedDirective implements OnInit {

    @Output('resized')
    readonly resized = new EventEmitter<ResizedEvent>();

    private oldWidth: number;
    private oldHeight: number;
    private resizeEvent: ResizeSensor;

    constructor(private readonly element: ElementRef) {
    }

    ngOnInit(): void {
        this.resizeEvent = new ResizeSensor(this.element.nativeElement, x => this.onResized());
        this.onResized();
    }

    private onResized(): void {
        const newWidth = this.element.nativeElement.clientWidth;
        const newHeight = this.element.nativeElement.clientHeight;

        if (newWidth === this.oldWidth && newHeight === this.oldHeight) {
            return;
        }

        const event = new ResizedEvent(
            this.element,
            newWidth,
            newHeight,
            this.oldWidth,
            this.oldHeight);

        this.oldWidth = this.element.nativeElement.clientWidth;
        this.oldHeight = this.element.nativeElement.clientHeight;

        this.resized.next(event);
    }

}
