// item-entry.component.ts
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Item, ItemStatus } from '../../models/item';
import { HttpClient } from '@angular/common/http';
import { ItemService } from '../../item.service';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MobileFormatPipe, DecimalPipe, RouterLink],
  templateUrl: './item-entry.component.html',
  styleUrl: './item-entry.component.scss'
})
export class ItemEntryComponent {


  itemService = inject(ItemService)

  items: Item[] = [];

  isSmallTable = false;
  filterItems = this.items;

  filterInput = new FormControl<string>('', { nonNullable: true });

  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;

  constructor() {

    this.itemService.list().subscribe(vs => {
      this.items = vs;
      this.filterItems = vs;
    })

    this.filterInput.valueChanges // ดักเหตุการณ์ที่ value เปลี่ยนได้
      .pipe(map((keyword) => keyword.toLocaleLowerCase())) // convert value ได้
      .subscribe((keyword) => {
        console.log('keyword', keyword)
        this.filterItems = this.items.filter((item) => item.title.toLocaleLowerCase().includes(keyword)); // เขียน logic จากการเปลี่ยน value ได้
      });
  }

  onConfirm(item: Item) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to delete "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        this.onDelete(item.id)
      }
    })

  }

  onDelete(id: number) {
    return this.itemService.delete(id).subscribe(v => {
      // filter เอาเฉพาะ item.id ที่ไม่ใข่โดน delete
      this.items = this.items.filter(item => item.id != id)
      this.filterItems = this.items
    });
  }  
}
