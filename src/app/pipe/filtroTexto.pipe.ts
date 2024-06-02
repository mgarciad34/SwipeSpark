import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFiltroTexto',
  standalone: true,
})
export class FiltroTextoPipe implements PipeTransform {


  transform(array: any[], filterPost: string): any[] {
    if (!filterPost) {
      return array;
    }
    filterPost = filterPost?.toLowerCase()!;
    return array.filter(item => item?.Nombre.toLowerCase().includes(filterPost)
      || item?.email?.toLowerCase().includes(filterPost)
      || item?.nick?.toLowerCase().includes(filterPost)
      || item?.estado?.toLowerCase().includes(filterPost)
      || item?.rolID?.toString().includes(filterPost)

  );
  }


}
