import './utils';
import { Categories } from 'hap-nodejs';
import { ELKAlarmPanelDevice } from 'isy-nodejs';
import { AlarmMode } from 'isy-nodejs/lib/Devices/Elk/ElkAlarmPanelDevice';
import { ISYAccessory } from './ISYAccessory';
export declare class ISYElkAlarmPanelAccessory extends ISYAccessory<ELKAlarmPanelDevice, Categories.ALARM_SYSTEM> {
    alarmPanelService: any;
    setAlarmTargetState(targetStateHK: any, callback: any): void;
    translateAlarmCurrentStateToHK(): 4 | 3 | 0 | 1 | 2;
    translateAlarmTargetStateToHK(): 3 | 0 | 1 | 2;
    translateHKToAlarmTargetState(state: any): AlarmMode.DISARMED | AlarmMode.AWAY | AlarmMode.STAY | AlarmMode.NIGHT;
    getAlarmTargetState(callback: any): void;
    getAlarmCurrentState(callback: any): void;
    handlePropertyChange(propertyName: string, value: any, oldValue: any, formattedValue: string): void;
    setupServices(): void;
}
//# sourceMappingURL=ISYElkAlarmPanelAccessory.d.ts.map