declare const tag: unique symbol;

type Opaque<T,K> = T & { readonly [tag]: K };

// function pipe(...fns((...args:Array<any>) => any)[]): any {

// }
