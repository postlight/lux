// @flow
declare module 'faker' {
  declare interface name {
    static firstName(): string;
    static lastName(): string;
  }

  declare interface image {
    static imageUrl(): string;
  }

  declare interface lorem {
    static word(): string;
    static sentence(): string;
    static paragraph(): string;
    static paragraphs(): string;
  }

  declare interface random {
    static boolean(): boolean;
  }

  declare interface helpers {
    static randomize<T>(options: Array<T>): T;
  }

  declare interface internet {
    static email(): string;
    static password(length?: number): string;
  }
}
