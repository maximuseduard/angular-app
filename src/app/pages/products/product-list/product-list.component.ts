import { PageTitleComponent } from 'app/components/page-title/page-title.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '@interfaces/product/product';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductService } from '@services/product/product.service';
import { RequestDestroyHook } from '@services/request-destroy-hook/request-destroy-hook.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [
    PageTitleComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIcon,
    RouterModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly _productService: ProductService,
    private readonly _requestDestroyHook: RequestDestroyHook,
    private readonly _router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editProduct(id: number) {
    this._router.navigate(['/products', id]);
  }

  deleteProduct(product: Product) {
    Swal.fire({
      icon: 'warning',
      title: `Do you want to delete the product "${product.name}"?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._productService
          .delete(product.id)
          .pipe(takeUntil(this._requestDestroyHook.destroy$))
          .subscribe({
            next: () => {
              Swal.fire('Product deleted!', '', 'success');

              this.getData();
            },
          });
      }
    });
  }

  getData() {
    this._productService
      .find()
      .subscribe((data) => (this.dataSource.data = data));
  }
}
