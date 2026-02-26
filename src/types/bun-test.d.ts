declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  
  export function expect<T>(value: T): {
    toBe(expected: T): void;
    toEqual(expected: T): void;
    toBeNull(): void;
    not: {
      toBe(expected: T): void;
      toEqual(expected: T): void;
      toBeNull(): void;
    };
    toContain<E>(expected: E): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toBeInstanceOf<C extends new (...args: any[]) => any>(expected: C): void;
    toHaveLength(expected: number): void;
    toHaveProperty(property: string, value?: unknown): void;
    toThrow(expected?: string | RegExp | Error): void;
    toMatch(expected: string | RegExp): void;
  };
} 