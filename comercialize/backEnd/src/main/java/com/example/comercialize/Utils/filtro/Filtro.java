package com.example.comercialize.Utils.filtro;

import lombok.Data;

@Data
public class Filtro {
  private String search;
  private String id;
  private boolean desc;
  private Integer tamanhoPagina = 10;
  private Integer pagina = 0;
}
