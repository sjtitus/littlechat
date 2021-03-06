/*_____________________________________________________________________________
    Monitor Service
    Monitor application state via a set of named StatusMonitor objects
    corresponding to application components.
  _____________________________________________________________________________
*/
import { Injectable } from '@angular/core';
import { StatusMonitorStatus, StatusMonitor } from '../models/statusmonitor';
import { Observer } from 'rxjs/Observer';

const dbgpackage = require('debug');
const debug = dbgpackage('MonitorService');

@Injectable()
export class MonitorService {

  Monitors: { [name: string]: StatusMonitor; } = {};
  private Components: Array<string> =
    [ 'API', 'Websocket', 'Contacts', 'Messages', 'Auth' ];

  constructor() {
    for (const component of this.Components) {
      this.AddMonitor(component);
    }
  }

  MonitorNames(): Array<string> {
    const out: Array<string> = [];
    for (const n in this.Monitors) {
      if (this.Monitors.hasOwnProperty(n)) {
        out.push(n);
      }
    }
    return out;
  }

  AddMonitor( monitorName: string ) {
    if (monitorName in this.Monitors) {
      console.error(`MonitorService: add of already-existent monitor '${monitorName}'`);
      throw new Error(`MonitorService: add of already-existent monitor '${monitorName}'`);
    }
    debug(`MonitorService: adding monitor '${monitorName}'`);
    this.Monitors[monitorName] = new StatusMonitor(monitorName);
  }

  RemoveMonitor( monitorName: string ) {
    debug(`MonitorService: removing monitor '${monitorName}'`);
    delete this.Monitors[monitorName];
  }

  // Change the status of a specific monitor
  ChangeStatus( monitorName: string, status: StatusMonitorStatus, message: string) {
    debug(`MonitorService: changing status of monitor '${monitorName}' to '${StatusMonitorStatus[status]}' ${message}`);
    this.Monitors[monitorName].SetStatus(status, message);
  }

  // Subscribe to a specific monitor
  // Subscribers will receive a reference to the changed StatusMonitor
  Subscribe( monitorName: string, statusChangeCallback: any ) {
    debug(`MonitorService: subscriber to monitor '${monitorName}'`);
    this.Monitors[monitorName].StatusChange$.subscribe(statusChangeCallback);
  }
}
