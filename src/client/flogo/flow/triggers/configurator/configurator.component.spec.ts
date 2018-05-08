import {ConfiguratorComponent} from './configurator.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {ConfiguratorModule} from './configurator.module';
import {ModalStatus} from './configurator.service';
import {FlowMetaDataMock, TriggersMock} from './mocks/triggers.mock';
import {By} from '@angular/platform-browser';
import {FakeRootLanguageModule} from '@flogo/core/language/testing';

describe('ConfiguratorComponent component', () => {
  let component: ConfiguratorComponent;
  let fixture: ComponentFixture<ConfiguratorComponent>;
  let de: DebugElement;
  const MockData: ModalStatus = {
    isOpen: true,
    triggers: [...TriggersMock],
    flowMetadata: {...FlowMetaDataMock},
    selectedTrigger: 'trigger_1'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ConfiguratorModule,
        FakeRootLanguageModule
      ]
    });
    fixture = TestBed.createComponent(ConfiguratorComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('Should be instantiated without any error', () => {
    expect(component).toBeDefined();
  });

  it('Should have currentModal "isOpen" status set to false', () => {
    expect(component.currentModalStatus.isOpen).toEqual(false);
  });

  it('Should show exact number of triggers', () => {
    component.onNextStatus(MockData);
    fixture.detectChanges();
    const triggerElements = fixture.debugElement.queryAll(By.css('.js-trigger-element'));
    expect(triggerElements.length).toEqual(2);
  });

  it('Should select at least one trigger by default', () => {
    component.onNextStatus(MockData);
    fixture.detectChanges();
    const triggerElements = fixture.debugElement.queryAll(By.css('.js-trigger-element.is-selected'));
    expect(triggerElements.length).toEqual(1);
  });

  it('Should disable save by default', () => {
    component.onNextStatus(MockData);
    fixture.detectChanges();
    expect(component.disableSave).toEqual(true);
  });

  it('Should disable save when trigger configurations are modified to original state', () => {
    component.onNextStatus(MockData);
    component.onUpdateTriggerConfiguration({
      triggerId: 'trigger_1',
      isValid: true,
      changedMappings: {
        actionMappings: {
          input: [
            {
              'mapTo': 'in',
              'type': 2,
              'value': 200
            },
            {
              'mapTo': 'in2',
              'type': 2,
              'value': 56565656
            }
          ],
          output: []
        }
      }
    });
    fixture.detectChanges();
    expect(component.disableSave).toEqual(true);
  });

  it('Should mark the trigger as modified', () => {
    component.onNextStatus(MockData);
    component.onUpdateTriggerConfiguration({
      triggerId: 'trigger_1',
      isValid: true,
      changedMappings: {
        actionMappings: {
          input: [
            {
              'mapTo': 'in',
              'type': 2,
              'value': 4754393
            },
            {
              'mapTo': 'in2',
              'type': 2,
              'value': 56565656
            }
          ],
          output: []
        }
      }
    });
    fixture.detectChanges();
    expect(component.configurableTriggers.get('trigger_1').isDirty).toEqual(true);
  });

  it('Should enable save when trigger configurations are modified and valid', () => {
    component.onNextStatus(MockData);
    component.onUpdateTriggerConfiguration({
      triggerId: 'trigger_1',
      isValid: true,
      changedMappings: {
        actionMappings: {
          input: [
            {
              'mapTo': 'in',
              'type': 2,
              'value': 4754393
            },
            {
              'mapTo': 'in2',
              'type': 2,
              'value': 56565656
            }
          ],
          output: []
        }
      }
    });
    fixture.detectChanges();
    expect(component.disableSave).toEqual(false);
  });

  it('Should disable save when trigger configurations are modified and invalid', () => {
    component.onNextStatus(MockData);
    component.onUpdateTriggerConfiguration({
      triggerId: 'trigger_1',
      isValid: false,
      changedMappings: {
        actionMappings: {
          input: [
            {
              'mapTo': 'in',
              'type': 2,
              'value': 4754393
            },
            {
              'mapTo': 'in2',
              'type': 2,
              'value': 56565656
            }
          ],
          output: []
        }
      }
    });
    fixture.detectChanges();
    expect(component.disableSave).toEqual(true);
  });

  it('Should allow selecting other triggers to configure', () => {
    component.onNextStatus(MockData);
    component.changeTriggerSelection('trigger_2');
    fixture.detectChanges();
    expect(component.currentModalStatus.selectedTrigger).toEqual('trigger_2');
    expect(component.selectedTriggerDetails).toBeDefined();
  });
});
