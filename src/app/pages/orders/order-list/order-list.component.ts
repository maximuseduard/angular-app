import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Order, OrderStatus } from '@interfaces/order/order';
import { OrderService } from '@services/order/order.service';
import { PageTitleComponent } from 'app/components/page-title/page-title.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  imports: [
    PageTitleComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>([
    { id: 1, total: 10, status: OrderStatus.CANCELED, orderItems: [] },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly _orderService: OrderService,
    private readonly _router: Router
  ) {}

  ngOnInit(): void {
    this._orderService
      .find()
      .subscribe((data) => (this.dataSource.data = data));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editOrder(id: number) {
    this._router.navigate(['/orders', id]);
  }

  deleteOrder(order: Order) {
    Swal.fire({
      icon: 'warning',
      title: `Do you want to delete the order "${order.id}"?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._orderService.delete(order.id).subscribe({
          next: () => Swal.fire('Order deleted!', '', 'success'),
        });
      }
    });
  }
}
