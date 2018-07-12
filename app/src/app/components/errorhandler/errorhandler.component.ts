/*_____________________________________________________________________________
 *  ErrorHandler
 *  Component that stores and displays application errors.
 * ____________________________________________________________________________
 */

import { Component, OnInit } from '@angular/core';
import { MonitorService } from '../../services/monitor.service';
import { StatusMonitorStatus, StatusMonitor } from '../../models/statusmonitor';
import { Observer } from 'rxjs/Observer';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-errorhandler',
  templateUrl: './errorhandler.component.html',
  styleUrls: ['./errorhandler.component.css', '../../app.component.css']
})

export class ErrorhandlerComponent implements OnInit {

  ErrorMonitors: Array<StatusMonitor> = [];
  NumErrors = 0;
  Summary: string;

  constructor(private monitorService: MonitorService) { }

  ngOnInit() {
    let i = 0;
    for (const n of this.monitorService.MonitorNames()) {
      const j = i;
      console.log(`ErrorHandler: subscribing to MonitorService channel '${n}'`);
      this.monitorService.Subscribe(n, (monitor) => this.OnChange(j, monitor) );
      this.ErrorMonitors[i++] = null;
    }
    this.UpdateSummary();
  }

  private UpdateSummary() {
    this.Summary = `${this.NumErrors} errors/warnings in ${this.ErrorMonitors.length} components`;
    console.log(`ErrorHandler: new summary: ${this.Summary}`);
  }

  trackByFn(index, item) {
    if (item === null) { return undefined; }
    return item.toString();
  }

  // Observer implementation
  OnChange(i: number, monitor: StatusMonitor): void {
    console.log(`ErrorHandler: OnChange: monitor ${monitor.name} state ${monitor.StatusName}, index ${i}, message ${monitor.Message}`);
    this.ErrorMonitors[i] = monitor;
    if (monitor.WentBad) {
      this.NumErrors++;
    }
    if (monitor.WentGood) {
      this.NumErrors--;
    }
    this.UpdateSummary();
  }


}
