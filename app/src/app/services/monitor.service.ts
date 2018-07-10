/*_____________________________________________________________________________
    Monitor Service
    Monitor application state via a set of named StatusMonitor objects.
  _____________________________________________________________________________
*/
import { Injectable } from '@angular/core';
import { StatusMonitorStatus, StatusMonitor } from '../models/statusmonitor';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class MonitorService {

  Monitors: { [name: string]: StatusMonitor; } = {};

  constructor() {
    this.AddMonitor('API');
    this.AddMonitor('Websocket');
    this.AddMonitor('Contacts');
    this.AddMonitor('Messages');
    this.AddMonitor('Auth');
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
    console.log(`MonitorService: adding monitor '${monitorName}'`);
    this.Monitors[monitorName] = new StatusMonitor(monitorName);
  }

  RemoveMonitor( monitorName: string ) {
    console.log(`MonitorService: removing monitor '${monitorName}'`);
    delete this.Monitors[monitorName];
  }

  // Change the status of a specific monitor
  ChangeStatus( monitorName: string, status: StatusMonitorStatus, message: string) {
    console.log(`MonitorService: changing status of monitor '${monitorName}' to '${StatusMonitorStatus[status]}' ${message}`);
    this.Monitors[monitorName].SetStatus(status, message);
  }

  // Subscribe to a specific monitor
  // Subscribers will receive a reference to the changed StatusMonitor
  Subscribe( monitorName: string, statusChangeCallback: any ) {
    console.log(`MonitorService: subscriber to monitor '${monitorName}'`);
    this.Monitors[monitorName].StatusChange$.subscribe(statusChangeCallback);
  }
}
