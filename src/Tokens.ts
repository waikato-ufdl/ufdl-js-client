import UFDLCrypto from "./UFDLCrypto";

export class Token {
    _value: string;

    constructor(value: string) {
        this._value = value;
    }

    public toString(): string {
        return this._value;
    }
}

export class AccessToken extends Token {}
export class RefreshToken extends Token {}

export class Tokens {
    _access: AccessToken;
    _refresh: RefreshToken;

    constructor(access: AccessToken, refresh: RefreshToken) {
        this._access = access;
        this._refresh = refresh;
    }

    get access(): AccessToken {
        return this._access;
    }

    get refresh(): RefreshToken {
        return this._refresh;
    }

    async serialise(key: CryptoKey | undefined): Promise<string> {
        const serialisedRaw = `${this._access} ${this._refresh}`;

        if (UFDLCrypto === undefined || key === undefined) return serialisedRaw;

        return UFDLCrypto.encrypt(serialisedRaw, key);
    }

    static async deserialise(serialised: string, key: CryptoKey | undefined): Promise<Tokens> {
        const decrypted = UFDLCrypto === undefined || key === undefined ?
            serialised :
            await UFDLCrypto.decrypt(serialised, key);

        let tokens: string[] = decrypted.split(" ");

        return this.fromString(tokens[0], tokens[1]);
    }

    static fromString(access: string, refresh: string): Tokens {
        return new Tokens(
            new AccessToken(access),
            new RefreshToken(refresh)
        );
    }
}
