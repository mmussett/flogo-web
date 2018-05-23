import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DiagramSelection, InsertTile, DiagramSelectionType } from '../interfaces';

@Component({
  selector: 'flogo-diagram-tile-insert',
  templateUrl: './tile-insert.component.html',
  styleUrls: ['./tile-insert.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileInsertComponent implements OnChanges {
  @Input() tile: InsertTile;
  @Input() currentSelection: DiagramSelection;
  @Input() diagramId: string;
  @Output() select = new EventEmitter<string>();
  @HostBinding('class.is-selected') isSelected = false;

  ngOnChanges({ currentSelection: currentSelectionChange }: SimpleChanges) {
    if (currentSelectionChange) {
      this.isSelected = this.checkIsSelected();
    }
  }

  onClick() {
    this.select.emit(this.tile.parentId);
  }

  @HostBinding('class.is-root')
  get isRootInsert() {
    return this.tile && this.tile.isRoot;
  }

  private checkIsSelected() {
    if (!this.currentSelection) {
      return false;
    }
    const {type, taskId, diagramId} = this.currentSelection;
    const forRoot = this.isRootInsert && diagramId === this.diagramId;
    return type === DiagramSelectionType.Insert && (taskId && taskId === this.tile.parentId || forRoot);
  }
}
