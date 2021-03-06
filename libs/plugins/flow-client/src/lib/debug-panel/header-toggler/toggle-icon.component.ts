import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'flogo-debug-panel-toggle-icon',
  templateUrl: './toggle-icon.component.html',
  styleUrls: ['./toggle-icon.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleIconComponent {
  @Input() isMinimized;
}
