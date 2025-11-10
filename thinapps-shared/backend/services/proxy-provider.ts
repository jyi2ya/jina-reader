export class ProxyProviderService {
    private readonly staticProxy = new URL('http://127.0.0.1:10809');

    async alloc(): Promise<URL> {
        return this.staticProxy;
    }

    *iterAlloc(): Generator<Promise<URL>, void, unknown> {
        while (true) {
            yield Promise.resolve(this.staticProxy);
        }
    }

    supports(): boolean {
        return false;
    }
}

