package tr.com.obss.bookportal.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="purchases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Book book;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @Column
    @NotNull
    private int quantity;

    @Column
    @NotNull
    private int price;

}
