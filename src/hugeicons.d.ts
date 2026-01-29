type IconSvgObject = ([string, {
    [key: string]: string | number;
}])[] | readonly (readonly [string, {
    readonly [key: string]: string | number;
}])[];

declare module '@hugeicons/core-free-icons/*' {
    const content: IconSvgObject;
    export default content;
}
