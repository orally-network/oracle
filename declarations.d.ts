declare module '*.scss';
declare module '*.png';

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.jpeg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}