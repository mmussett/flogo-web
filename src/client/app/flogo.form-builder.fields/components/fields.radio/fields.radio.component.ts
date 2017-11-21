import { Component } from '@angular/core';
import { FlogoFormBuilderFieldsBaseComponent } from '../fields.base/fields.base.component';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'flogo-form-builder-fields-radio',
  styleUrls: ['fields.radio.less', '../fields.base/fields.base.less'],
  // moduleId: module.id,
  templateUrl: 'fields.radio.tpl.html',
  // disabling no-input-rename rule to make the linter pass for now
  // decided to skip fixing because this class should be deprecated
  /* tslint:disable-next-line:use-input-property-decorator */
  inputs: ['_info:info', '_fieldObserver:fieldObserver', '_index:index']
})

export class FlogoFormBuilderFieldsRadioComponent extends FlogoFormBuilderFieldsBaseComponent {
  _info: any;
  _fieldObserver: any;
  _index: number;

  constructor(public translate: TranslateService) {
    super(translate);
  }

}
