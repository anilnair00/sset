import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { ConfigActivator } from './guards/config-activator.guard';
import { DateMaskDirective } from './formatting/date-mask.directive';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DEFAULT_TIMEOUT } from './interceptors/error.interceptor';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { EllipsisModule } from 'ngx-ellipsis';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { HelpModalComponent } from './components/help-modal/help-modal.component';
import { HttpClient } from '@angular/common/http';
import { InputLengthDirective } from './validators/input-length.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { NgxMaskModule } from 'ngx-mask';
import { OptionalPipe } from './pipes/optional.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RangeDirective } from './validators/range.directive';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SelectComponent } from './components/select/select.component';
import { TableComponent } from './components/table/table.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateCutPipe } from './pipes/translate-cut.pipe';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TrimDirective } from './formatting/trim.directive';
import { TrimTextareaDirective } from './formatting/trim-textarea.directive';
import { UnavailableComponent } from './components/unavailable/unavailable.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AutocompleteComponent,
    DateMaskDirective,
    DatepickerComponent,
    DropdownComponent,
    EnumToArrayPipe,
    ErrorModalComponent,
    FileUploadComponent,
    FooterComponent,
    HeaderComponent,
    HeaderComponent,
    HelpModalComponent,
    InputLengthDirective,
    InputLengthDirective,
    LoaderComponent,
    OptionalPipe,
    RangeDirective,
    SafeHtmlPipe,
    SafeHtmlPipe,
    SelectComponent,
    TableComponent,
    TranslateCutPipe,
    TrimDirective,
    TrimTextareaDirective,
    UnavailableComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BsDatepickerModule,
    BsDropdownModule,
    BsDropdownModule,
    CollapseModule,
    CommonModule,
    EllipsisModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ModalModule,
    NgPipesModule,
    NgxMaskModule.forChild(),
    PaginationModule,
    PopoverModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: DEFAULT_TIMEOUT, useValue: 20000 }, ConfigActivator],
  exports: [
    AutocompleteComponent,
    BsDatepickerModule,
    BsDropdownModule,
    CollapseModule,
    CommonModule,
    DateMaskDirective,
    DatepickerComponent,
    DropdownComponent,
    EllipsisModule,
    EnumToArrayPipe,
    ErrorModalComponent,
    FileUploadComponent,
    FooterComponent,
    FormsModule,
    HeaderComponent,
    HelpModalComponent,
    InputLengthDirective,
    LoaderComponent,
    ModalModule,
    NgPipesModule,
    NgxMaskModule,
    OptionalPipe,
    PaginationModule,
    PopoverModule,
    RangeDirective,
    ReactiveFormsModule,
    SafeHtmlPipe,
    SelectComponent,
    TableComponent,
    TabsModule,
    TooltipModule,
    TranslateCutPipe,
    TranslateModule,
    TrimDirective,
    TrimTextareaDirective,
    UnavailableComponent
  ]
})
export class SharedModule {}
