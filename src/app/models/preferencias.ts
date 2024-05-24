export interface Preferencias {
  [key: string]: any; // This is the index signature
  relacion?:string | null;
  deportivos?:number | null;
  artisticos?:number | null;
  politicos?:number | null;
  hijos?:boolean | null;
  interes?:string | null;
}
