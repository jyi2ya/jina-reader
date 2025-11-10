import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';
import { randomUUID } from 'crypto';

export class FirebaseStorageBucketControl {
    private basePath: string;

    constructor(storagePath: string = './storage') {
        this.basePath = storagePath;
    }

    async downloadFile(filePath: string): Promise<Buffer> {
        const fullPath = path.join(this.basePath, filePath);
        try {
            return await fs.readFile(fullPath);
        } catch (err) {
            throw new Error(`Failed to download file: ${err}`);
        }
    }

    async saveFile(filePath: string, data: Buffer, options?: {
        metadata?: { contentType?: string },
        public?: boolean
    }): Promise<void> {
        const fullPath = path.join(this.basePath, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, data);
    }

    async signDownloadUrl(filePath: string, expires?: number): Promise<string> {
        // For local testing, just return a file:// URL
        return `file://${path.join(this.basePath, filePath)}`;
    }

    get bucket() {
        return {
            file: (filePath: string) => ({
                exists: async (): Promise<[boolean]> => {
                    try {
                        await fs.access(path.join(this.basePath, filePath));
                        return [true];
                    } catch {
                        return [false];
                    }
                },
                save: async (stream: any, options?: { contentType?: string }): Promise<void> => {
                    const fullPath = path.join(this.basePath, filePath);
                    await fs.mkdir(path.dirname(fullPath), { recursive: true });
                    // For simplicity, assuming stream is already processed
                    await fs.writeFile(fullPath, stream);
                }
            })
        };
    }
}

