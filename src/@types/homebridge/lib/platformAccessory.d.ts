/// <reference types="node" />

declare module 'homebridge/lib/platformAccessory'
{
    import { EventEmitter } from 'events';
    import { Accessory, Categories, Service, WithUUID } from 'hap-nodejs';

export class PlatformAccessory extends EventEmitter {
    displayName: string;
    public UUID;
    private category;
    public services: Service[];
    private reachable;
    private context;
    private cameraSource;
    _associatedPlugin: any;
    _associatedPlatform: any;
    _associatedHAPAccessory: Accessory;
    constructor(displayName: string, UUID: string, category?: string | Categories);
    addService(service: Service | typeof Service): Service;
    removeService(service: Service): void;
    /**
     * searchs for a Service in the services collection and returns the first Service object that matches.
     * If multiple services of the same type are present in one accessory, use getServiceByUUIDAndSubType instead.
     * @param {ServiceConstructor|string} name
     * @returns Service
     */
    getService(name: string | typeof Service | Service): any;
    /**
     * searchs for a Service in the services collection and returns the first Service object that matches.
     * If multiple services of the same type are present in one accessory, use getServiceByUUIDAndSubType instead.
     * @param {string} UUID Can be an UUID, a service.displayName, or a constructor of a Service
     * @param {string} subtype A subtype string to match
     * @returns Service
     */
    getServiceByUUIDAndSubType(UUID: string | WithUUID<any>, subtype: string): Service;
    updateReachability(reachable: boolean): void;
    configureCameraSource(cameraSource: any): void;
    _prepareAssociatedHAPAccessory(): void;
    private _dictionaryPresentation;
    _configFromData(data: {
        plugin: any;
        platform: any;
        displayName: string;
        UUID: string;
        category: string;
        context: {};
        services: {
            [x: string]: any;
        };
        linkedServices: any;
    }): void;
}
}