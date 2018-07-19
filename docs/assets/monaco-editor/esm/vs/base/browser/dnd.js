/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { dispose } from '../common/lifecycle.js';
import { addDisposableListener } from './dom.js';
/**
 * A helper that will execute a provided function when the provided HTMLElement receives
 *  dragover event for 800ms. If the drag is aborted before, the callback will not be triggered.
 */
var DelayedDragHandler = /** @class */ (function () {
    function DelayedDragHandler(container, callback) {
        var _this = this;
        this.toDispose = [];
        this.toDispose.push(addDisposableListener(container, 'dragover', function () {
            if (!_this.timeout) {
                _this.timeout = setTimeout(function () {
                    callback();
                    _this.timeout = null;
                }, 800);
            }
        }));
        ['dragleave', 'drop', 'dragend'].forEach(function (type) {
            _this.toDispose.push(addDisposableListener(container, type, function () {
                _this.clearDragTimeout();
            }));
        });
    }
    DelayedDragHandler.prototype.clearDragTimeout = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    DelayedDragHandler.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
        this.clearDragTimeout();
    };
    return DelayedDragHandler;
}());
export { DelayedDragHandler };
// Common data transfers
export var DataTransfers = {
    /**
     * Application specific resource transfer type
     */
    RESOURCES: 'ResourceURLs',
    /**
     * Browser specific transfer type to download
     */
    DOWNLOAD_URL: 'DownloadURL',
    /**
     * Browser specific transfer type for files
     */
    FILES: 'Files',
    /**
     * Typicaly transfer type for copy/paste transfers.
     */
    TEXT: 'text/plain'
};
