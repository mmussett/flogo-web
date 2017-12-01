import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {IFlogoApplicationFlowModel } from '../../core/application.model';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {AppDetailService} from '../../home/services/apps.service';


@Component({
  selector: 'flogo-export-flow',
  templateUrl: 'export-flow.tpl.html',
  styleUrls: ['export-flow.component.less']
})
export class FlogoExportFlowsComponent {
  @ViewChild('modal')
  public modal: ModalComponent;

  @Input()
  flows: Array<IFlogoApplicationFlowModel> = [];
  checkedFlows = [];
  checkAllFlows = [];

  constructor(public translate: TranslateService,
              private appDetailService: AppDetailService,
  ) {

  }

  public openExport() {
    this.resetForm();
    this.modal.open();
    this.selectAllFlows();
  }

  public selectAllFlows() {
    this.checkedFlows = [];
    this.checkAllFlows = [];
    this.flows.forEach((flow, index) => {
      this.checkAllFlows.push(index);
      this.checkedFlows.push(flow.id);
    });
  }
  public unselectAllFlows() {
    this.checkedFlows = [];
    this.checkAllFlows = [];
  }
  public flowSelect(flowId: string, isChecked: boolean, index) {
    if (isChecked) {
      this.checkedFlows.push(flowId);
      this.checkAllFlows.push(index);
    } else {
      const indexOfFlows = this.checkedFlows.indexOf(flowId);
      const indexOfIndices = this.checkAllFlows.indexOf(index);
      this.checkedFlows.splice(indexOfFlows, 1);
      this.checkAllFlows.splice(indexOfIndices, 1);
    }
  }

  public exportFlows() {
    let flowsToExport;
    if (this.checkedFlows.length === this.flows.length) {
      flowsToExport = [];
    } else {
      flowsToExport = this.checkedFlows;
    }
      return () => this.appDetailService.exportFlow(flowsToExport)
        .then(appWithFlows => {
          return [{
            fileName: 'flows.json',
            data: appWithFlows
          }];
        });
    }
  private resetForm() {
    this.unselectAllFlows();
  }

}
