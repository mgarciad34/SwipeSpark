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
      || item?.Email?.toLowerCase().includes(filterPost)
      || item?.Nick?.toLowerCase().includes(filterPost)
      || item?.Estado?.toLowerCase().includes(filterPost)
      || item?.RolID?.toString().includes(filterPost)

  );
  }


}
