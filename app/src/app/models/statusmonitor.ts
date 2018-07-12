/*_____________________________________________________________________________
    Class StatusMonitor
    Monitor the state of a named condition/component, broadcast state
    changes to listeners.
  _____________________________________________________________________________
*/

import { Subject } from 'rxjs/Subject';

export enum StatusMonitorStatus { Ok, Warning, Error, Unknown }

export class StatusMonitor {

    private _status: StatusMonitorStatus;
    private _prevStatus: StatusMonitorStatus;
    private _message: string;
    private _sinceTimestamp: number;
    private _lastConfirmedTimestamp: number;

    public  StatusChange$: Subject<StatusMonitor>;

    constructor(public name: string) {
      const now = Date.now();
      this._message = '';
      this._status = StatusMonitorStatus.Unknown;
      this._prevStatus = StatusMonitorStatus.Unknown;
      this._sinceTimestamp = now;
      this._lastConfirmedTimestamp = now;
      this.StatusChange$ = new Subject<StatusMonitor>();
      console.log(`StatusMonitor: new monitor: ${this}`);
    }

    get StatusChanged(): boolean {
      return (this._status !== this._prevStatus);
    }

    get WentBad(): boolean {
      return (
        (this._prevStatus !== StatusMonitorStatus.Error && this._prevStatus !== StatusMonitorStatus.Warning) &&
        (this._status === StatusMonitorStatus.Error || this._status === StatusMonitorStatus.Warning)
      );
    }

    get WentGood(): boolean {
      return (
        (this._prevStatus === StatusMonitorStatus.Error || this._prevStatus === StatusMonitorStatus.Warning) &&
        (this._status !== StatusMonitorStatus.Error && this._status !== StatusMonitorStatus.Warning)
      );
    }

    get Message(): string {
      return this._message;
    }

    get Status(): StatusMonitorStatus {
      return this._status;
    }

    get StatusName(): string {
      return StatusMonitorStatus[this._status];
    }

    get Since(): Date {
      const d = new Date(0);
      d.setUTCMilliseconds(this._sinceTimestamp);
      return d;
    }

    get LastConfirmed(): Date {
      const d = new Date(0);
      d.setUTCMilliseconds(this._lastConfirmedTimestamp);
      return d;
    }

    toString() {
      return `${this.name}: ${StatusMonitorStatus[this._status]}: ${this._message} [since ${this.Since.toISOString()}, confirmed at ${this.LastConfirmed.toISOString()}]`;
    }

    public SetStatus(status: StatusMonitorStatus, message: string = '') {
      const now = Date.now();
      this._prevStatus = this._status;
      this._status = status;
      const mchanged = (this._message !== message);
      this._message = message;
      this._lastConfirmedTimestamp = now;
      // notify listeners if status changed OR if status stayed the same but message changed
      if (this.StatusChanged || mchanged) {
        this.StatusChange$.next(this);
      }
    }

}
