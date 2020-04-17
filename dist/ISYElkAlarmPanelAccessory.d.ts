import './utils';
import { Categories } from 'hap-nodejs';
import { ElkAlarmSensorDevice } from 'isy-nodejs';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYElkAlarmPanelAccessory extends ISYAccessory<ElkAlarmSensorDevice, Categories.ALARM_SYSTEM> {
    alarmPanelService: any;
    constructor(device: any);
    setAlarmTargetState(targetStateHK: any, callback: any): void;
    translateAlarmCurrentStateToHK(): 4 | 3 | 2 | 1 | 0;
    translateAlarmTargetStateToHK(): 3 | 2 | 1 | 0;
    translateHKToAlarmTargetState(state: any): any;
    getAlarmTargetState(callback: any): void;
    getAlarmCurrentState(callback: any): void;
    handleExternalChange(propertyName: string, value: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYElkAlarmPanelAccessory.d.ts.map