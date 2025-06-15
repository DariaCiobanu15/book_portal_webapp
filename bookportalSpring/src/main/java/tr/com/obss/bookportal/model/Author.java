package tr.com.obss.bookportal.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Table(name="authors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Author {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotNull(message = "name is not null.")
	@Size(min = 3, message = "name cannot be less than 3 characters ")
	private String name;
	
	@NotNull(message = "surName is not null.")
	@Size(min = 3, message = "userName cannot be less than 3 characters ")
	private String surName;
	
	@NotNull(message = "birthDate is not null.")
	@Column(name = "birth_date")
	private Date birthDate;
	
	
}
