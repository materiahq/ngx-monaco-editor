'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-monaco-editor-demo documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/MonacoEditorModule.html" data-type="entity-link" >MonacoEditorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' : 'data-target="#xs-components-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' :
                                            'id="xs-components-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' }>
                                            <li class="link">
                                                <a href="components/MonacoDiffEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonacoDiffEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MonacoEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonacoEditorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' : 'data-target="#xs-directives-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' :
                                        'id="xs-directives-links-module-MonacoEditorModule-84056bea90da3fb3b39a30e823a6bf5b542b3a8b108ab1c1168ccbc4e141eb76811c8a4f27adcdb34e04e7911a65ecd7d21920e599a6f6db1d73aab948bdcc5b"' }>
                                        <li class="link">
                                            <a href="directives/MonacoEditorLoaderDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonacoEditorLoaderDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CancellationTokenSource.html" data-type="entity-link" >CancellationTokenSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/Emitter.html" data-type="entity-link" >Emitter</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeyMod.html" data-type="entity-link" >KeyMod</a>
                            </li>
                            <li class="link">
                                <a href="classes/Position.html" data-type="entity-link" >Position</a>
                            </li>
                            <li class="link">
                                <a href="classes/Range.html" data-type="entity-link" >Range</a>
                            </li>
                            <li class="link">
                                <a href="classes/Selection.html" data-type="entity-link" >Selection</a>
                            </li>
                            <li class="link">
                                <a href="classes/Token.html" data-type="entity-link" >Token</a>
                            </li>
                            <li class="link">
                                <a href="classes/Uri.html" data-type="entity-link" >Uri</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/MonacoEditorLoaderService.html" data-type="entity-link" >MonacoEditorLoaderService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CancellationToken.html" data-type="entity-link" >CancellationToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Environment.html" data-type="entity-link" >Environment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDisposable.html" data-type="entity-link" >IDisposable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEvent.html" data-type="entity-link" >IEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IKeyboardEvent.html" data-type="entity-link" >IKeyboardEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMarkdownString.html" data-type="entity-link" >IMarkdownString</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMouseEvent.html" data-type="entity-link" >IMouseEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPosition.html" data-type="entity-link" >IPosition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRange.html" data-type="entity-link" >IRange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IScrollEvent.html" data-type="entity-link" >IScrollEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISelection.html" data-type="entity-link" >ISelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UriComponents.html" data-type="entity-link" >UriComponents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Window.html" data-type="entity-link" >Window</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});