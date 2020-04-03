/**
 * Manages user settings and storage locations.
 */
export declare class User {
    protected config: any;
    static customStoragePath: string;
    static storagePath(): string;
    static configPath(): string;
    static persistPath(): string;
    static cachedAccessoryPath(): string;
    static setStoragePath(storagePath: string): void;
}
