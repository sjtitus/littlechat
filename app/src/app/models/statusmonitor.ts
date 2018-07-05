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
    private _message: string;
    private _sinceTimestamp: number;
    private _lastConfirmedTimestamp: number;

    public  StatusChange$: Subject<StatusMonitor>;

    constructor(public name: string) {
      const now = Date.now();
      this._message = '';
      this._status = StatusMonitorStatus.Unknown;
      this._sinceTimestamp = now;
      this._lastConfirmedTimestamp = now;
      this.StatusChange$ = new Subject<StatusMonitor>();
    }

    public SetStatus(status: StatusMonitorStatus, message: string = '') {
      const now = Date.now();
      const changed = ((status !== this._status) || (message !== this._message));
      this._lastConfirmedTimestamp = now;
      if (changed) {
        this._status = status;
        this._message = message;
        this._sinceTimestamp = now;
        this.StatusChange$.next(this);    // notify listeners
      }
    }

    get Status(): StatusMonitorStatus {
      return this._status;
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
      return `${this.name}: ${StatusMonitorStatus[this._status]} since ${this.Since.toISOString}`;
    }

}
