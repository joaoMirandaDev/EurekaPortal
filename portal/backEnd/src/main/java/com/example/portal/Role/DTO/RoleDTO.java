package com.example.portal.Role.DTO;

import com.example.portal.Role.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoleDTO {

  private Integer id;
  private String name;

  public RoleDTO(Role role) {
    this.id = role.getId();
    this.name = role.getName();
  }
}
