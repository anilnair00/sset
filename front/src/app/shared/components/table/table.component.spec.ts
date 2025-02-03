import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { EllipsisModule } from 'ngx-ellipsis';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent, SafeHtmlPipe],
      imports: [PopoverModule.forRoot(), EllipsisModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
